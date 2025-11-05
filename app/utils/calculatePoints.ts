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
  id: string;
  isGroup: 0 | 1;
  members: number;
  [key: string]: any;
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

const getRankPoints = (rank: number, program: Program): number => {
  let pointsMap: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

  if (program.isGroup == 0) {
    pointsMap = { 1: 3, 2: 2, 3: 1 };
  } else {
    switch (program.members) {
      case 2:
        pointsMap = { 1: 5, 2: 3, 3: 2 };
        break;
      case 3:
      case 4:
        pointsMap = { 1: 10, 2: 6, 3: 4 };
        break;
      case 5:
        pointsMap = { 1: 15, 2: 10, 3: 5 };
        break;
    }
  }

  return pointsMap[rank] || 0;
};

const getGradePoints = (grade: string | null, program: Program): number => {
  if (!grade) return 0;

  const Points: Record<string, number> = { "A+": 6, A: 5, B: 3, C: 1 };
  return Points[grade] || 0;
};

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
