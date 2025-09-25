import { ROOT_URL } from "../data/func";
import React from "react";
import { showMessage } from "../../components/common/CusToast";

interface Participant {
  id: number | string;
  code: string | null;
}

interface Topic {
  id: number | string;
}

interface Student {
  id: number | string;
}

interface Program {
  id: number | string;
}

interface AssignTopicResponse {
  success: boolean;
  data: Participant[];
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// ✅ Compact generator: A–Z, AA–ZZ, AAA–ZZZ...
const generateCodes = (count: number): string[] => {
  const codes: string[] = [];
  for (let i = 1; i <= count; i++) {
    let n = i;
    let label = "";
    while (n > 0) {
      n--; // make 0-based
      label = String.fromCharCode(65 + (n % 26)) + label;
      n = Math.floor(n / 26);
    }
    codes.push(label);
  }
  return codes;
};

/**
 * Assigns unique, sequential codes to random participants who don't have one.
 */
export const assignCode = async (
  participants: Participant[],
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>,
): Promise<boolean> => {
  try {
    const participantsWithoutCode = participants.filter((p) => p.code == null);
    if (participantsWithoutCode.length === 0) {
      showMessage("All participants already have a code.", "info");
      return true;
    }

    const shuffledParticipants = shuffle(participantsWithoutCode);

    const usedCodes = new Set(
      participants
        .map((item) => item.code)
        .filter((code): code is string => code != null)
    );

    // Generate only as many codes as needed
    const allCodes = generateCodes(participants.length * 2); // safe buffer
    const codesToAssign = allCodes.filter((c) => !usedCodes.has(c)).slice(0, shuffledParticipants.length);

    if (codesToAssign.length < shuffledParticipants.length) {
      showMessage("Not enough unique codes available to assign.", "error");
      throw new Error("Not enough codes to assign");
    }

    const newCodeAssignments = new Map<string | number, string>();
    shuffledParticipants.forEach((participant, index) => {
      newCodeAssignments.set(participant.id, codesToAssign[index]);
    });

    const newParticipants = participants.map((participant) =>
      newCodeAssignments.has(participant.id)
        ? { ...participant, code: newCodeAssignments.get(participant.id)! }
        : participant
    );

    setParticipants(newParticipants);

    const participantsToUpdate = newParticipants.filter(p => newCodeAssignments.has(p.id));

    const updatePromises = participantsToUpdate.map(async (participant) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("id", String(participant.id));
        urlencoded.append("code", participant.code as string);

        const requestOptions: RequestInit = {
          method: "PUT",
          headers: myHeaders,
          body: urlencoded,
        };

        const response = await fetch(
          `${ROOT_URL}participants/action.php?action=assignCode`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        return { success: true, id: participant.id };
      } catch (error: any) {
        console.error(`Error updating ID ${participant.id}:`, error.message);
        return { success: false, id: participant.id, message: error.message };
      }
    });

    const results = await Promise.all(updatePromises);
    const failedUpdates = results.filter((result) => !result.success);

    if (failedUpdates.length > 0) {
      showMessage(`${failedUpdates.length} code assignments failed to save.`, "error");
      throw new Error(`${failedUpdates.length} updates failed.`);
    }

    showMessage("Codes assigned successfully!", "success");
    return true;
  } catch (error: any) {
    console.error("An error occurred in assignCode:", error.message);
    showMessage(error.message || "An unknown error occurred.", "error");
    return false;
  }
};

/**
 * Assigns a random topic to a student and updates the participants list.
 */
export const getTopic = async (
  topics: Topic[],
  student: Student,
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  program: Program
): Promise<void> => {
  try {
    setLoading(true);
    if (!topics || topics.length === 0) {
      throw new Error("No topics available to assign.");
    }

    const shuffledTopics = shuffle(topics);

    const response = await fetch('/api/programList/assignTopic', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: shuffledTopics[0].id,
        student: student.id,
        program: program.id
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Topic assigning failed' }));
      throw new Error(errorData.message || 'Topic assigning failed');
    }

    const status: AssignTopicResponse = await response.json();

    if (status.success) {
      setParticipants(
        status.data
          .filter((item) => item.code != null)
          .sort((a, b) => (a.code as string).localeCompare(b.code as string))
      );
      showMessage("Topic assigned successfully", "success");
    } else {
      throw new Error('Topic assigning failed');
    }
  } catch (error: any) {
    showMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
};
