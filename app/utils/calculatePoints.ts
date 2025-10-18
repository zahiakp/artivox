import { AssignResult } from "../judgement/func";

const SPECIAL_PROGRAM_IDS = ['99', '101'];

interface Participant {
    code: string;
    student: string;
    mark: number;
    mark2: number;
    mark3: number;
    status: "finished" | "pending" | "error";
    rank?: number;
    points?: number;
    grade?: string | null;
}

/**
 * Defines the structure for the program object.
 */
interface Program {
    id: string;
    isGroup: 0 | 1;
    members: number;
    [key: string]: any;
}

/**
 * Defines the arguments for the main exported function.
 */
interface GenerateResultsArgs {
    participants: Participant[];
    program: Program;
}

// --- Helper Functions ---

/**
 * Determines the grade based on the participant's mark percentage.
 */
const calculateGrade = (mark: number): string | null => {
    if (mark >= 90) return "A+";
    if (mark >= 70) return "A";
    if (mark >= 60) return "B";
    if (mark >= 50) return "C";
    return null;
};

/**
 * [MODIFIED] Gets the points awarded for a given rank.
 * This function no longer distinguishes between group and individual programs.
 */
const getRankPoints = (rank: number): number => {
    switch (rank) {
        case 1: return 5;
        case 2: return 3;
        case 3: return 1;
        default: return 0;
    }
};

/**
 * [MODIFIED] Gets the points awarded for a given grade based on program type.
 * Handles special programs, group programs, and individual programs.
 */
const getGradePoints = (grade: string | null, program: Program): number => {
    if (!grade) return 0;

    // Point maps based on the new criteria
    const specialPoints: Record<string, number> = { "A+": 35, "A": 30, "B": 20, "C": 10 };
    const groupPoints: Record<string, number> = { "A+": 18, "A": 15, "B": 13, "C": 11 };
    const individualPoints: Record<string, number> = { "A+": 8, "A": 5, "B": 3, "C": 1 };

    // Determine which point map to use
    let pointsMap: Record<string, number>;
    if (SPECIAL_PROGRAM_IDS.includes(program.id)) {
        pointsMap = specialPoints;
    } else if (program.isGroup === 1) {
        pointsMap = groupPoints;
    } else {
        pointsMap = individualPoints;
    }

    return pointsMap[grade] || 0;
};


// --- Core Logic ---

/**
 * Assigns ranks and calculates total points for participants.
 * Rank is determined by a 'finalMark' percentage, which is calculated based on
 * the most comprehensive set of marks available across all participants.
 */
const assignRanksAndCalculatePoints = (args: { participants: Participant[], program: Program }): Participant[] => {
    const { participants, program } = args;

    // 1. [REMOVED] No longer need global maxMark calculation here.

    // 2. Calculate a final mark percentage for each participant individually
    const participantsWithFinalMark = participants.map(p => {
        
        let totalScore = p.mark || 0;
        let maxMark = 100; // Default to 100

        // Check THIS participant's marks to determine THEIR maxMark
        if (p.mark3 != null && p.mark3 > 0) {
            totalScore += (p.mark2 || 0) + (p.mark3 || 0);
            maxMark = 300;
        } else if (p.mark2 != null && p.mark2 > 0) {
            totalScore += (p.mark2 || 0);
            maxMark = 200;
        }

        const finalMark = (totalScore / maxMark) * 100;
        return { ...p, finalMark };
    });

    // 3. Sort participants by the calculated finalMark in descending order
    // (The rest of the function is the same as before)
    const sortedParticipants = [...participantsWithFinalMark].sort((a, b) => b.finalMark - a.finalMark);

    const rankedParticipants: Participant[] = [];
    let lastMark = -1;
    let lastRank = 0;

    sortedParticipants.forEach((participant, index) => {
        const rank = participant.finalMark === lastMark ? lastRank : index + 1;
        const grade = calculateGrade(participant.finalMark);
        const rankPoints = getRankPoints(rank);
        const gradePoints = getGradePoints(grade, program);
        const totalPoints = rankPoints + gradePoints;

        const { finalMark, ...originalParticipant } = participant;

        rankedParticipants.push({
            ...originalParticipant,
            rank,
            grade,
            points: totalPoints,
        });

        lastMark = participant.finalMark;
        lastRank = rank;
    });

    return rankedParticipants;
};

export const generateFinalResults = async (args: GenerateResultsArgs): Promise<boolean> => {
    const { participants, program } = args;

    const finishedParticipants = participants.filter(p => p.status === "finished");

    const calculatedParticipants = assignRanksAndCalculatePoints({
        participants: finishedParticipants,
        program,
    });

    const gradedParticipants = calculatedParticipants.filter(p => p.points && p.points > 0);
    console.log("Graded Participants to be saved:", gradedParticipants);

    let allSavedSuccessfully = true;
    for (const participant of gradedParticipants) {
        const { student, code, rank, grade, points } = participant;

        // 1. Always split the student string by comma to get all IDs
        const allStudentIds = student.split(',').map(s => s.trim()).filter(Boolean);

        // If there are no IDs, skip this record
        if (allStudentIds.length === 0) {
            console.warn(`Skipping participant with empty student field for code ${code}`);
            continue;
        }

        let studentIdsToSave: string[];

        // 2. [CORRECTED LOGIC] Decide *which* IDs to save
        if (program.isGroup === 1) {
            // For a group, take ONLY the first ID from the list
            studentIdsToSave = [allStudentIds[0]];
        } else {
            // For an individual program, save all IDs found (usually just one)
            studentIdsToSave = allStudentIds;
        }

        // 3. Loop through the one (for group) or all (for individual) IDs
        for (const studentId of studentIdsToSave) {
            try {
                console.log(`Saving result for: ${studentId}, Rank: ${rank}, Grade: ${grade}, Points: ${points}`);
                const saveResult = await AssignResult(
                    code,
                    studentId,
                    program.id,
                    String(rank!),
                    grade,
                    String(points!)
                );

                if (!saveResult.success) {
                    console.error(`Failed to save result for participant ${studentId}`);
                    allSavedSuccessfully = false;
                }
            } catch (error: any) {
                console.error(`Error saving result for participant ${studentId}:`, error.message);
                allSavedSuccessfully = false;
            }
        }
    }

    return allSavedSuccessfully;
};