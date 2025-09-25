import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { UpdateMark } from "../../app/programs/func";
import { showMessage } from "./CusToast";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

function AddResult({
  close,
  data,
  fetch,
}: {
  close: any;
  data: any;
  fetch: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { program } = data;
  const [cookies] = useCookies(["access"]);
  const [role, setRole] = useState(cookies?.access?.role);
  const endpoint =
    role === "admin" || role == "judge"
      ? "participants" : "";
  const [participants, setParticipants] = useState<any>();
  
  useEffect(() => {
  if (data && data.participants) {
    const sortedAndFiltered = data.participants
  .filter((p: any) => p.code != null)
  .sort((a: any, b: any) => codeToNumber(a.code!) - codeToNumber(b.code!));
    setParticipants(sortedAndFiltered);
  }
}, [data]);
  console.log(data.participants);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // find only changed participants
    const toUpdate = participants.filter((item:any) => {
      const original = data.participants.find((o:any) => o.id === item.id);
      if (!original) return false;

      return (
        item.mark !== original.mark ||
        item.mark2 !== original.mark2 ||
        item.mark3 !== original.mark3
      );
    });
    
    if (toUpdate.length === 0) {
      showMessage("No changes detected.", "error");
      return;
    }

    // run update calls
    const updates = toUpdate.map((p:any) =>
      UpdateMark(p.id, p.mark, p.mark2, p.mark3, endpoint)
    );

    // wait for all updates (settled, so one failure doesn’t block others)
    const results = await Promise.allSettled(updates);

    const failed = results.filter(r => r.status === "rejected");
    if (failed.length > 0) {
      showMessage(`${failed.length} update(s) failed.`, "error");
    } else {
      showMessage("All participants updated successfully.", "success");
    }

    // refresh data/UI
    fetch();
    close(false);

  } catch (error: any) {
    // this only catches *unexpected* errors, not individual UpdateMark failures
    showMessage(`Unexpected error: ${error.message}`, "error");
  } finally {
    setLoading(false);
  }
};


const rowValid = {
    mark:  participants?.some((p:any) => p.mark  > 0) ?? false,
    mark2: participants?.some((p:any) => p.mark2 > 0) ?? false,
    mark3: participants?.some((p:any) => p.mark3 > 0) ?? false,
  };

if(!participants || participants.length == 0){
  return (
    <p>no participants found</p>
  )
}

  return (
    <Modal close={close} className="w-fix" edit={false}>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <h6 className="font-bold text-2xl mb-3 w-full text-center">
          {program.name} <p className="text-lg">{`(${program.category})`}</p>
        </h6>

        <div className="gap-3 mx-auto overflow-auto grid grid-cols-1">
          {participants.map((student: any, index: number) => (
            <div
              key={student.code}
              className="flex gap-3 items-center bg-zinc-100 p-2 rounded-xl"
            >
              <label htmlFor={"mark" + index}>{student.code}</label>
              <input
                value={student.mark === 0 ? "" : student.mark}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 0 && value <= 100) {
                    setParticipants((prev: any) =>
                      prev.map((p: any, i: any) =>
                        i === index ? { ...p, mark: value } : p
                      )
                    );
                  }
                }}
                type="number"
                id={"mark" + index}
                style={{ width: "100px" }}
                className={`p-2 px-5 ${rowValid.mark &&  "border-green-500 bg-green-50 text-green-700"}`}
                disabled={loading}
                // min="0"
                max="100"
                aria-label={`Mark for participant ${student.code}`}
              />
              <input
                value={student.mark2 === 0 ? "" : student.mark2}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 0 && value <= 100) {
                    setParticipants((prev: any) =>
                      prev.map((p: any, i: any) =>
                        i === index ? { ...p, mark2: value } : p
                      )
                    );
                  }
                }}
                type="number"
                id={"mark" + index}
                style={{ width: "100px" }}
                className={`p-2 px-5 ${rowValid.mark2 && "border-green-500 bg-green-50 text-green-700"}`}
                disabled={loading}
                // min="0"
                max="100"
                aria-label={`Mark for participant ${student.code}`}
              />
              <input
                value={student.mark3 === 0 ? "" : student.mark3}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 0 && value <= 100) {
                    setParticipants((prev: any) =>
                      prev.map((p: any, i: any) =>
                        i === index ? { ...p, mark3: value } : p
                      )
                    );
                  }
                }}
                type="number"
                id={"mark" + index}
                style={{ width: "100px" }}
                className={`p-2 px-5 ${rowValid.mark3 && "border-green-500 bg-green-50 text-green-700"}`}
                disabled={loading}
                // min="0"
                max="100"
                aria-label={`Mark for participant ${student.code}`}
              />
            </div>
          ))}
        </div>
        <button
          className="bg-gradient-to-tr mt-5 from-primary-400 to-primary-600 text-white p-3 px-5 rounded-xl font-semibold flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>{" "}
              Updating...
            </>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </Modal>
  );
}

export default AddResult;


export function codeToNumber(code: string): number {
  let num = 0;
  for (let i = 0; i < code.length; i++) {
    num = num * 26 + (code.charCodeAt(i) - 64); // 'A'.charCodeAt(0) = 65
  }
  return num;
}