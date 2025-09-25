import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { IoMdAddCircle } from "react-icons/io";
import ParticipantForm from "./ParticipantForm";
import { TbUserScan } from "react-icons/tb";
import CameraCapture from "./CameraCapture";
import { assignCode } from "../../app/utils/assignCode";
import { ongoingUpdate } from "../../app/utils/ongoingUpdate";
import { useCookies } from "react-cookie";
import { showMessage } from "./CusToast";

function GetAward({ result, setLoading, loading }:{result:any, setLoading:any, loading:any}) {
  const [cookies] = useCookies(["access"]);
  const [role, setRole] = useState();
  useEffect(() => {
    setRole(cookies?.access?.role);
  }, []);
  return (
    <div className="flex flex-col gap-3 w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="w-max">Rank</th>
            <th>Code</th>
            <th>Student</th>
            <th>Jamia No</th>
            <th>Campus</th>
            {role == "award" && <th>status</th>}
          </tr>
        </thead>
        <tbody>
          {result?.first?.length != 0 && (
            <tr>
              <td>1</td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.first?.map((student:any) => (
                    <li>{student.code}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.first?.map((student:any) => (
                    <li>{student.studentName}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.first?.map((student:any) => (
                    <li>{student.student}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.first?.map((student:any) => (
                    <li>{student.campusName}</li>
                  ))}
                </ul>
              </td>
              {role == "award" && (
                <td>
                  <ul className="flex flex-col gap-2 borde-b">
                    {result?.first?.map((student:any) => (
                      <li>
                        <button
                          disabled={
                            student?.status !== "awarded"
                              ? false
                              : loading
                              ? true
                              : true
                          }
                          className={`px-3 py-1 duration-300 ${
                            student?.status !== "awarded"
                              ? "text-white bg-red-500 hover:rounded-md"
                              : "text-red-600 bg-red-50"
                          } rounded-full  `}
                          onClick={async () => {
                            setLoading(true);
                            const response = await fetch(
                              "/api/programList/status",
                              {
                                method: "POST",
                                // header: {
                                //   "Content-Type": "application/json",
                                // },
                                body: JSON.stringify({
                                  type: "awarded",
                                  participant: { id: student.id },
                                  program: null,
                                }),
                              }
                            );
                            const status = await response.json();
                            if (status.success) {
                              return showMessage(`awarded successfully`,"success")
                            }
                            return showMessage(`failed`,"error")
                          }}
                        >
                          {student.status !== "awarded" ? "Award" : "Awarded"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
              )}
            </tr>
          )}
          {result?.second?.length != 0 && (
            <tr>
              <td>2</td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.second?.map((student:any) => (
                    <li>{student.code}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.second?.map((student:any) => (
                    <li>{student.studentName}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.second?.map((student:any) => (
                    <li>{student.student}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.second?.map((student:any) => (
                    <li>{student.campusName}</li>
                  ))}
                </ul>
              </td>
              {role == "award" && (
                <td>
                  <ul className="flex flex-col gap-2 borde-b">
                    {result?.second?.map((student:any) => (
                      <li>
                        <button
                          disabled={
                            student?.status !== "awarded"
                              ? false
                              : loading
                              ? true
                              : true
                          }
                          className={`px-3 py-1 duration-300 ${
                            student?.status !== "awarded"
                              ? "text-white bg-red-500 hover:rounded-md"
                              : "text-red-600 bg-red-50"
                          } rounded-full  `}
                          onClick={async () => {
                            setLoading(true);
                            const response = await fetch(
                              "/api/programList/status",
                              {
                                method: "POST",
                                // header: {
                                //   "Content-Type": "application/json",
                                // },
                                body: JSON.stringify({
                                  type: "awarded",
                                  participant: { id: student.id },
                                  program: null,
                                }),
                              }
                            );
                            const status = await response.json();
                            if (status.success) {
                              return showMessage("Awarded successfully","success");
                            }
                            return showMessage("failed","error");
                          }}
                        >
                          {student.status !== "awarded" ? "Award" : "Awarded"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
              )}
            </tr>
          )}
          {result?.third?.length != 0 && (
            <tr>
              <td>3</td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.third?.map((student:any) => (
                    <li>{student.code}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.third?.map((student:any) => (
                    <li>{student.studentName}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.third?.map((student:any) => (
                    <li>{student.student}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="flex flex-col gap-2 borde-b">
                  {result?.third?.map((student:any) => (
                    <li>{student.campusName}</li>
                  ))}
                </ul>
              </td>
              {role == "award" && (
                <td>
                  <ul className="flex flex-col gap-2 borde-b">
                    {result?.third?.map((student:any) => (
                      <li>
                        <button
                          disabled={
                            student?.status !== "awarded"
                              ? false
                              : loading
                              ? true
                              : true
                          }
                          className={`px-3 py-1 duration-300 ${
                            student?.status !== "awarded"
                              ? "text-white bg-red-500 hover:rounded-md"
                              : "text-red-600 bg-red-50"
                          } rounded-full  `}
                          onClick={async () => {
                            setLoading(true);
                            const response = await fetch(
                              "/api/programList/status",
                              {
                                method: "POST",
                                // header: {
                                //   "Content-Type": "application/json",
                                // },
                                body: JSON.stringify({
                                  type: "awarded",
                                  participant: { id: student.id },
                                  program: null,
                                }),
                              }
                            );
                            const status = await response.json();
                            if (status.success) {
                              return showMessage("Awarded successfully","success")
                            }
                            return showMessage("Failed","error");
                          }}
                        >
                          {student.status !== "awarded" ? "Award" : "Awarded"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
      {role == "result" && result?.grades ? (
        <div className="w-full">
          <h3 className=" text-center text-lg font-semibold p-2 bg-gray-100">
            Other grades
          </h3>
          <table className="table w-full">
            <tbody>
              <tr className="my-2">
                <td></td>
                <td>
                  <ul>
                    {result?.grades?.map((student:any) => (
                      <li>{student.code}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {result?.grades?.map((student:any) => (
                      <li>{student.studentName}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {result?.grades?.map((student:any) => (
                      <li>{student.campusName}</li>
                    ))}
                  </ul>
                </td>

                <td>
                  <ul>
                    {result?.grades?.map((student:any) => (
                      <li>{student.grade || ""}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {result?.grades?.map((student:any) => (
                      <li>{student.points}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default GetAward;
