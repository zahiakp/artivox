import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { showMessage } from "../../../components/common/CusToast";
import Modal from "../../../components/common/Modal";
import { ROOT_URL } from "../../data/func";
import axios from "axios";

function Report({
  close,
  data,
  fetch,
}: {
  close: any;
  data: any;
  fetch?: any;
}) {

  const router = useRouter();
  const [cookies] = useCookies(["access"]);
  const [userRole, setUserRole] = useState(cookies?.access?.role);
  const partEndpoint = "participants";
  const [loading, setLoading] = useState(false);
  const { program, type } = data;
  const [edit, setEdit] = useState(false);
  const [participants, setParticipants] = useState(data.participants);
  const [duplicateIndices, setDuplicateIndices] = useState<Set<number>>(new Set());
  const [skippedCodeWarning, setSkippedCodeWarning] = useState<string>('');
  const [skippedIndices, setSkippedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    // --- DUPLICATE CHECK LOGIC ---
    const codeCounts = new Map<string, number[]>();
    participants.forEach((p: any, index: number) => {
      if (p.code && p.code.toString().trim() !== "") {
        if (!codeCounts.has(p.code)) {
          codeCounts.set(p.code, []);
        }
        codeCounts.get(p.code)?.push(index);
      }
    });
    const duplicates = new Set<number>();
    for (const [code, indices] of codeCounts.entries()) {
      if (indices.length > 1) {
        indices.forEach(index => duplicates.add(index));
      }
    }
    setDuplicateIndices(duplicates);

    const newSkippedIndices = new Set<number>();
    let newWarning = '';

    const codesWithIndices = participants
      .map((p: any, index: number) => ({ code: p.code, index }))
      .filter((item: any) => item.code && item.code.toString().trim() !== '');

    if (codesWithIndices.length > 1) {
      const uniqueCodesMap = new Map();
      codesWithIndices.forEach((item:any) => {
        if (!uniqueCodesMap.has(item.code)) {
          uniqueCodesMap.set(item.code, item.index);
        }
      });
      const uniqueCodesWithIndices = Array.from(uniqueCodesMap.entries())
        .map(([code, index]) => ({ code, index }))
        .sort((a, b) => a.code.localeCompare(b.code));

      const isAllLetters = uniqueCodesWithIndices.every(c => /^[A-Z]$/.test(c.code));
      const isAllNumbers = uniqueCodesWithIndices.every(c => /^\d+$/.test(c.code));

      if (isAllLetters) {
        for (let i = 1; i < uniqueCodesWithIndices.length; i++) {
          const prev = uniqueCodesWithIndices[i - 1];
          const current = uniqueCodesWithIndices[i];
          if (current.code.charCodeAt(0) !== prev.code.charCodeAt(0) + 1) {
            newSkippedIndices.add(current.index);
            if (!newWarning) {
              newWarning = `Non-sequential code. Found '${current.code}' after '${prev.code}'.`;
            }
          }
        }
      } else if (isAllNumbers) {
        for (let i = 1; i < uniqueCodesWithIndices.length; i++) {
          const prev = uniqueCodesWithIndices[i - 1];
          const current = uniqueCodesWithIndices[i];
          if (Number(current.code) !== Number(prev.code) + 1) {
            newSkippedIndices.add(current.index);
            if (!newWarning) {
              newWarning = `Non-sequential code. Found '${current.code}' after '${prev.code}'.`;
            }
          }
        }
      }
    }
    setSkippedCodeWarning(newWarning);
    setSkippedIndices(newSkippedIndices);

  }, [participants]);

  const handleUpdate = async () => {
    if (duplicateIndices.size > 0) {
      showMessage("Please resolve duplicate codes before updating.", "error");
      return;
    }
    if (skippedCodeWarning) {
      showMessage("Please resolve non-sequential codes before updating.", "error");
      return;
    }
    if (participants.some((p: any) => p.code == null || p.code.toString().trim() === "")) {
      showMessage("Please fill in all codes before updating.", "error");
      return;
    }

    setLoading(true);
    try {
      const originalParticipantsMap = new Map(
        data.participants.map((p: any) => [p.id, p])
      );

      const changedParticipants = participants.filter((p: any) => {
        const originalParticipant: any = originalParticipantsMap.get(p.id);
        return !originalParticipant || originalParticipant.code !== p.code;
      });

      if (changedParticipants.length === 0) {
        showMessage("No changes to save.", "info");
        return;
      }
      
      const updatePromises = changedParticipants.map(async (participant: any) => {
        try {
          const urlencoded = new URLSearchParams();
          urlencoded.append("id", String(participant.id));
          urlencoded.append("code", participant.code as string);

          
          await axios.put(
            `${ROOT_URL}participants/action.php?action=assignCode`,
            urlencoded,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

         
          return { success: true, id: participant.id };

        } catch (error: any) {
         
          let errorMessage = "An unknown error occurred";
          if (axios.isAxiosError(error)) {
            if (error.response) {
              errorMessage = `Server Error: ${error.response.status}. ${error.response.data?.message || ''}`;
              console.error(`Error updating ID ${participant.id}:`, error.response.data);
            } else if (error.request) {
              errorMessage = "Network Error: No response from server.";
              console.error(`Network error for ID ${participant.id}:`, error.request);
            } else {
              errorMessage = error.message;
            }
          } else {
             errorMessage = error.message;
          }
          
          console.error(`Failed to update participant ID ${participant.id}. Reason: ${errorMessage}`);
          return { success: false, id: participant.id, message: errorMessage };
        }
      });

      const results = await Promise.all(updatePromises);
      const failedUpdates = results.filter((result) => !result.success);

      if (failedUpdates.length > 0) {
        const failedIds = failedUpdates.map(f => f.id).join(', ');
        showMessage(`Failed to update codes for ID(s): ${failedIds}. See console for details.`, "error");
      } else {
        showMessage("Codes assigned successfully!", "success");
        fetch && fetch();
        close(false);
      }
    } catch (error: any) {
      console.error("A critical error occurred during the update process:", error.message);
      showMessage(error.message || "An unknown critical error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal close={() => close(false)}>
      <div className="flex flex-col gap-3">
        <h6 className="font-semibold text-xl mb-3 w-full text-center">
          {program?.name}
        </h6>
        <p className="text-lg text-center">
          {participants?.length} Participants
        </p>

        
        {duplicateIndices.size > 0 && (
          <div className="p-2 px-4 rounded-md text-sm text-red-600 border border-red-400 bg-red-50 text-center">
            Duplicate code found in position(s): {
              Array.from(duplicateIndices)
                .sort((a, b) => a - b)
                .map(index => index + 1)
                .join(', ')
            }
          </div>
        )}
        {edit && skippedCodeWarning && (
          <div className="p-2 px-4 rounded-md text-sm text-amber-700 border border-amber-400 bg-amber-50 text-center">
            {skippedCodeWarning}
          </div>
        )}
        
        <div className="max-h-80 overflow-auto">
          <table className="table">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th></th>
                {type == "update" && <th>student</th>}
                <th>{type == "update" ? "Code" : "Student"}</th>
                {type !== "update" && <th>Team</th>}
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {participants?.map((student: any, index: number) => {
                const isDuplicate = duplicateIndices.has(index);
                const isSkipped = skippedIndices.has(index);

                return (
                  <tr key={student.id}>
                    <th>{index + 1}</th>
                    <td className="font-semibold">{student.student}</td>
                    <td>{student.campus}</td>
                    <td className="font-semibold">
                      <input
                        value={student.code || ''}
                        onChange={(e) => {
                          setParticipants((prev: any) =>
                            prev.map((p: any, i: any) =>
                              i === index ? { ...p, code: e.target.value } : p
                            )
                          );
                        }}
                        id={"code" + index}
                        style={{ width: "70px" }}
                        className={`p-2 px-3 border rounded-md transition-all duration-200 ${
                          isDuplicate
                            ? "border-red-500 bg-red-50 text-red-700 focus:ring-red-500"
                            : isSkipped && edit
                            ? "border-amber-500 bg-amber-50 text-amber-700 focus:ring-amber-500"
                            : edit
                            ? "border-green-500 bg-green-50 text-green-700 focus:ring-green-500"
                            : "border-gray-300"
                        }`}
                        disabled={!edit}
                        aria-label={`Code for participant ${student.student}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-5">
          {participants.some((item: any) => item.code != null) && (
            <button
              className=" cursor-pointer bg-blue-500 text-white p-2 px-5 rounded-lg disabled:bg-gray-400"
              onClick={
                edit ? handleUpdate : () => setEdit(true)
              }
              disabled={loading || (edit && duplicateIndices.size > 0)}
            >
              {edit ? "Update" : "Edit Code"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default Report;