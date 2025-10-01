import React, { useState } from "react";
import Modal from "./Modal";
import { IoMdAddCircle } from "react-icons/io";
import ParticipantForm from "./ParticipantForm";
import { TbUserScan } from "react-icons/tb";
import CameraCapture from "./CameraCapture";
import GetTopic from "./GetTopic";
import IconMenuApps from "../icon/menu/icon-menu-apps";
import { showMessage } from "./CusToast";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { ChangeParticipantStatus } from "../../app/programs/func";
import { assignCode, getTopic } from "../../app/utils/assignCode";
import { brandName } from "../../app/data/branding";

function Report({ close, data ,fetch}:{close:any, data:any,fetch?:any}) {
  const router = useRouter()
  const [cookies] = useCookies([`${brandName}-access`]);
const [userRole, setUserRole] = useState(cookies[`${brandName}-access`]?.role);
  const proEndpoint = "programs";
  const partEndpoint = "participants";
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState(false);
  const { program, type,topics } = data;
  const [participants, setParticipants] = useState(data.participants);
const [showTopic,setShowTopic]=useState<any>()

const fetchPrograms = async (participants:any, setParticipants:any) => {
  setLoading(true);
  try {
    const response = await assignCode(participants, setParticipants);

    if (response) {
      showMessage("Code Assigned Successfully", "success");
      close(false);
      fetch && fetch();
      // router.refresh();
    } else {
      console.error("No programs returned");
      showMessage("Code Assigning Failed", "error");
    }
  } catch (error) {
    console.error("Error assigning codes:", error);
  }
  setLoading(false);
};
const StatusChange = async (id:any, status:any, participants:any, setParticipants:any) => {
  setLoading(true);
  try {
    const response = await ChangeParticipantStatus(id, status,partEndpoint);

    if (response.success) {
      setParticipants((prevParticipants:any) =>
        prevParticipants.map((participant:any) =>
          participant.id === id
            ? { ...participant, status } // Update the status
            : participant
        )
      );
      
      showMessage(`Participant Successfully ${status}`, "success");
    } else {
      console.error("Status change failed");
      showMessage(`Participant ${status} Failed`, "error");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    showMessage("An error occurred while updating status", "error");
  } finally {
    setLoading(false);
  }
};

console.log("participants",participants);


  return (
    <Modal close={() => { close(false); fetch && fetch(); }}>
      <div
        className="flex flex-col gap-3"
        //   onSubmit={handleSubmit}
      >
        <h6 className="font-semibold text-xl mb-3 w-full text-center">
          {program?.name}
        </h6>
        <p className="text-lg text-center">
          {participants?.length} Participants
        </p>
        <div className="flex flex-col gap-3 mx-auto "></div>
        <div className="max-h-80 overflow-auto">
          <table className="table">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th></th>
                {type == "update" && <th>student</th>}
                <th>{type == "update" ? "Code" : "Student"}</th>
                {type !== "update" && <th>Team</th>}
                <th>
                  {type == "report" || type == "update" ? "Status" : "Code"}
                </th>
              </tr>
            </thead>
            <tbody className="">
              {participants?.map((student:any, index:number) => (
                <tr key={student.id}>
                  <th>{index + 1}</th>
                  {type == "update" && (
                    <td className="font-semibold">{student.student}</td>
                  )}
                  <td className="font-semibold">
                    {type == "update" ? student.code : student.student}
                  </td>
                  {type !== "update" && <td>{student.campus}</td>}
                  {type == "report" ? (
                    <><td
                      className={`${
                        student.status == "not reported"
                          ? "text-red-500"
                          : "text-green-500"
                      } font-semibold`}
                    >
                      {student.status == "not reported"
                        ? "Not Reported"
                        : "Reported"}
                    </td>
                    <td>
                    {student.status == "not reported" && <button
                  className=" cursor-pointer bg-blue-500 text-white p-2 px-3 rounded-lg shadow-lg"
                  onClick={()=>StatusChange(student.id,"reported",participants,setParticipants)}
                  disabled={loading}
                >
                  {loading ? "Reporting..." : "Report"}
                </button>}
                    </td></>
                  ) : type == "assign" ? (
                    <td
                      className={`${
                        student.status == "not reported"
                          ? "text-red-500"
                          : "text-green-500"
                      } font-semibold`}
                    >
                      {student.code && student.code}
                    </td>
                  ) : (
                    <td
                      className={`${
                        student.status == "finished"
                          ? "text-green-500"
                          : student.status == "cancelled"
                          ? "text-red-500"
                          : ""
                      } font-semibold`}
                    >
                      {student.status == "finished" ? (
                        "Finished"
                      ) : student.status == "cancelled" ? (
                        "Cancelled"
                      ) : (
                        <div className="flex gap-2">
                          {topics && student.topic==0 ?<button
                            className="w-max px-3 rounded-lg bg-zinc-400 hover:bg-opacity-90 text-white active:scale-90 py-2 disabled:bg-gray-500"
                            onClick={async () => {
                              await getTopic(topics,student,setParticipants,setLoading,program)
                            }}
                            disabled={loading}
                          >
                            Get Topic
                          </button> :<>
                          {topics && student.topic!=0 &&<button
                            className="w-max px-3 rounded-lg bg-green-500 hover:bg-opacity-90 text-white active:scale-90 py-2 disabled:bg-gray-400"
                            onClick={async () => {
                              setShowTopic({index:topics.map((item:any) =>item.id).indexOf(student.topic),topic:topics.find((item:any)=>item.id==student.topic)})

                            }}
                            disabled={loading}
                          >
                            Show Topic
                          </button>}
                          <button
                            className="w-max px-3 rounded-lg bg-green-500 hover:bg-opacity-90 text-white active:scale-90 py-2 disabled:bg-gray-400"
                            onClick={()=>StatusChange(student.id,"finished",participants,setParticipants)}
                            disabled={loading}
                          >
                            Finish
                          </button>
                          </> }
                          <button
                            className="w-max px-3 rounded-lg bg-red-500 hover:bg-opacity-90 text-white active:scale-90 py-2 disabled:bg-gray-400"
                            disabled={loading}
                            onClick={()=>StatusChange(student.id,"cancelled",participants,setParticipants)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-5">
          {type == "report"
            ? participants.some((item:any) => item.status == "not reported") && (
                <button
                  onClick={() => setScan(true)}
                  className="cursor-pointer rounded-xl bg-gradient-to-tr from-primary-400 to-primary-600 shadow-lg duration-300 hover:shadow-sm px-5 py-3 flex gap-2 items-center mt-5 text-white"
                  disabled={loading}
                >
                  <IconMenuApps/>
                  Scan Code
                </button>
                // <></>
              )
            : type == "assign" &&
              participants.some((item:any) => item.code == null) && (
                <button
                  className=" cursor-pointer bg-blue-500 text-white p-2 px-3 rounded-lg"
                  onClick={()=>fetchPrograms(participants, setParticipants)}
                  disabled={loading}
                >
                  {loading ? "assigning" : "Assign Code"}
                </button>
              )}
        </div>
      </div>
      {scan && (
        <CameraCapture
          participants={participants}
          close={setScan}
          setParticipants={setParticipants}
          program={program}
          partEndpoint={partEndpoint}
        />
      )}
      {showTopic && <GetTopic data={showTopic} close={setShowTopic} />}
    </Modal>
  );
}

export default Report;
