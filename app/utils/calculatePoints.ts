import { AssignResult } from "../judgement/func";

// --- Type Definitions ---

/**
 * Defines the structure for a participant object.
 */
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
 * Gets the points awarded for a given rank based on program type.
 */
const getRankPoints = (rank: number, program: Program): number => {
    if (program.isGroup === 0) { // Individual
        switch (rank) {
            case 1: return 3;
            case 2: return 2;
            case 3: return 1;
            default: return 0;
        }
    }

    // Group (using the correct 'members_count' property)
    const {members} = program;
    let points = 0;
    switch (members) {
        case 1:
            if (rank === 1) points = 3;
            if (rank === 2) points = 2;
            if (rank === 3) points = 1;
            break;
        case 2:
            if (rank === 1) points = 5;
            if (rank === 2) points = 3;
            if (rank === 3) points = 2;
            break;
        case 3:
        case 4:
            if (rank === 1) points = 10;
            if (rank === 2) points = 6;
            if (rank === 3) points = 4;
            break;
        case 5:
            if (rank === 1) points = 15;
            if (rank === 2) points = 10;
            if (rank === 3) points = 5;
            break;
        default:
            points = 0;
    }
    return points;
};

/**
 * Gets the points awarded for a given grade.
 */
const getGradePoints = (grade: string | null, program: Program): number => {
    if (!grade) return 0;
    const individualPoints: Record<string, number> = { "A+": 7, "A": 5, "B": 3, "C": 1 };
    const groupPoints: Record<string, number> = { "A+": 10, "A": 7, "B": 5, "C": 3 };
    const pointsMap = program.isGroup === 0 ? individualPoints : groupPoints;
    return pointsMap[grade] || 0;
};


// --- Core Logic ---

/**
 * [MODIFIED] Assigns ranks and calculates total points for participants.
 * Rank is now determined by a 'finalMark' percentage, which is calculated based on
 * the most comprehensive set of marks available across all participants.
 */
const assignRanksAndCalculatePoints = (args: { participants: Participant[], program: Program }): Participant[] => {
    const { participants, program } = args;

    // 1. Determine the fairest maximum score by checking if any participant has mark2 or mark3
    const useMark3 = participants.some(p => p.mark3 != null && p.mark3 > 0);
    const useMark2 = !useMark3 && participants.some(p => p.mark2 != null && p.mark2 > 0);

    let maxMark = 100;
    if (useMark3) maxMark = 300;
    else if (useMark2) maxMark = 200;

    // 2. Calculate a final mark percentage for each participant using the determined maxMark
    const participantsWithFinalMark = participants.map(p => {
        let totalScore = p.mark || 0;
        if (useMark3) {
            totalScore += (p.mark2 || 0) + (p.mark3 || 0);
        } else if (useMark2) {
            totalScore += (p.mark2 || 0);
        }
        const finalMark = (totalScore / maxMark) * 100;
        return { ...p, finalMark };
    });

    // 3. Sort participants by the calculated finalMark in descending order
    const sortedParticipants = [...participantsWithFinalMark].sort((a, b) => b.finalMark - a.finalMark);

    const rankedParticipants: Participant[] = [];
    let lastMark = -1;
    let lastRank = 0;

    sortedParticipants.forEach((participant) => {
        // Assign rank, handling ties based on the finalMark
        const rank = participant.finalMark === lastMark ? lastRank : lastRank + 1;

        // Calculate grade and points using the finalMark
        const grade = calculateGrade(participant.finalMark);
        const rankPoints = getRankPoints(rank, program);
        const gradePoints = getGradePoints(grade, program);
        const totalPoints = rankPoints + gradePoints;

        // Destructure to remove the temporary 'finalMark' before returning
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


// --- Main Exported Function ---

/**
 * Main function to process participants, generate final results, and save them.
 */
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

        // [MODIFIED] Split student string to correctly handle group participants
        const studentIds = [student.split(',').map(s => s.trim()).find(Boolean)].filter(Boolean);

        // Save the result for each student in the group
        for (const studentId of studentIds) {
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
