import { AssignResult } from "../judgement/func";

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

interface Program {
  id: string | number;
  isGroup: 0 | 1;
  members: number;
  [key: string]: any; // Allows for program.name or other properties
}

interface GenerateResultsArgs {
  participants: Participant[];
  program: Program;
}

const calculateGrade = (mark: number): string | null => {
  if (mark >= 90) return "A+";
  if (mark >= 70) return "A";
  if (mark >= 60) return "B";
  if (mark >= 50) return "C";
  return null;
};

// --- Updated Functions ---

const getRankPoints = (rank: number, program: Program): number => {
  const programName = program.name as string | undefined;

  let rankPointsMap: Record<number, number> = { 1: 3, 2: 2, 3: 1 }; // Default

  if (rank > 3) return 0;

  // Custom programs (Individual or Group doesn't matter for these specific points)
  if ([27,32].includes(program.id as number)) {
    rankPointsMap = { 1: 8, 2: 6, 3: 4 };
  } else if ([39,31].includes(program.id as number)) {
    rankPointsMap = { 1: 4, 2: 3, 3: 2 };
  } else if ([20,21,22,23,33,34,35,36,50].includes(program.id as number)) {
    rankPointsMap = { 1: 4, 2: 3, 3: 2 };
  } else {
    // Group programs based on members
    if (program.isGroup === 1) {
      switch (program.members) {
        case 5:
          rankPointsMap = { 1: 8, 2: 6, 3: 4 };
          break;
        case 3:
        case 4:
          rankPointsMap = { 1: 6, 2: 4, 3: 2 };
          break;
        case 2:
          rankPointsMap = { 1: 4, 2: 3, 3: 2 };
          break;
        // Default case for group programs not matching 2, 3, 4, 5 members
        default:
          rankPointsMap = { 1: 3, 2: 2, 3: 1 };
          break;
      }
    }
    // isGroup === 0 (Individual) uses the default map { 1: 3, 2: 2, 3: 1 }
  }

  return rankPointsMap[rank] || 0;
};

const getGradePoints = (grade: string | null, program: Program): number => {
  if (!grade) return 0;

  const programName = program.name as string | undefined;

  let gradePointsMap: Record<string, number> = { A: 3, "A+": 5, B: 2, C: 1 }; // Default

  // Custom programs
  if ([27,32].includes(program.id as number)) {
    gradePointsMap = { "A+": 12, A: 10, B: 9, C: 8 };
  } else if ([39,31].includes(program.id as number)) {
    gradePointsMap = { "A+": 8, A: 6, B: 5, C: 4 };
  } else if ([20,21,22,23,33,34,35,36,50].includes(program.id as number)) {
    gradePointsMap = { "A+": 6, A: 4, B: 3, C: 2 };
  } else {
    // Group programs based on members
    if (program.isGroup === 1) {
      switch (program.members) {
        case 5:
          gradePointsMap = { "A+": 12, A: 10, B: 9, C: 8 };
          break;
        case 3:
        case 4:
          gradePointsMap = { "A+": 10, A: 8, B: 7, C: 6 };
          break;
        case 2:
          gradePointsMap = { "A+": 8, A: 6, B: 5, C: 4 };
          break;
        // Default case for group programs not matching 2, 3, 4, 5 members
        default:
          gradePointsMap = { A: 3, "A+": 5, B: 2, C: 1 };
          break;
      }
    }
    // isGroup === 0 (Individual) uses the default map { A: 3, "A+": 5, B: 2, C: 1 }
  }

  return gradePointsMap[grade] || 0;
};

// --- Unchanged Functions ---

const assignRanksAndCalculatePoints = (args: {
  participants: Participant[];
  program: Program;
}): Participant[] => {
  const { participants, program } = args;

  const participantsWithFinalMark = participants.map((p) => {
    let totalScore = p.mark || 0;
    let maxMark = 100;

    if (p.mark3 != null && p.mark3 > 0) {
      totalScore += (p.mark2 || 0) + (p.mark3 || 0);
      maxMark = 300;
    } else if (p.mark2 != null && p.mark2 > 0) {
      totalScore += p.mark2 || 0;
      maxMark = 200;
    }

    const finalMark = (totalScore / maxMark) * 100;
    return { ...p, finalMark };
  });

  const sortedParticipants = [...participantsWithFinalMark].sort(
    (a, b) => b.finalMark - a.finalMark
  );

  const rankedParticipants: Participant[] = [];
  let lastMark = -1;
  let lastRank = 0;

  sortedParticipants.forEach((participant, index) => {
    const rank = participant.finalMark === lastMark ? lastRank : index + 1;
    const grade = calculateGrade(participant.finalMark);
    // Calls updated functions
    const rankPoints = getRankPoints(rank, program);
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

export const generateFinalResults = async (
  args: GenerateResultsArgs
): Promise<boolean> => {
  const { participants, program } = args;

  const finishedParticipants = participants.filter(
    (p) => p.status === "finished"
  );

  const calculatedParticipants = assignRanksAndCalculatePoints({
    participants: finishedParticipants,
    program,
  });

  // Filter participants with calculated points (rankPoints + gradePoints)
  const gradedParticipants = calculatedParticipants.filter(
    (p) => p.points && p.points > 0
  );
  console.log("Graded Participants to be saved:", gradedParticipants);

  let allSavedSuccessfully = true;
  for (const participant of gradedParticipants) {
    const { student, code, rank, grade, points } = participant;

    const allStudentIds = student
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (allStudentIds.length === 0) {
      console.warn(
        `Skipping participant with empty student field for code ${code}`
      );
      continue;
    }

    let studentIdsToSave: string[];

    // If it's a group program, only save the result to the first student ID in the list.
    // If it's an individual program, save the result to all student IDs listed (comma-separated).
    if (program.isGroup === 1) {
      studentIdsToSave = [allStudentIds[0]];
    } else {
      studentIdsToSave = allStudentIds;
    }

    for (const studentId of studentIdsToSave) {
      try {
        console.log(
          `Saving result for: ${studentId}, Rank: ${rank}, Grade: ${grade}, Points: ${points}`
        );
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
        console.error(
          `Error saving result for participant ${studentId}:`,
          error.message
        );
        allSavedSuccessfully = false;
      }
    }
  }

  return allSavedSuccessfully;
};