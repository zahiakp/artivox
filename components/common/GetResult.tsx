import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { IoMdAddCircle } from "react-icons/io";
import ParticipantForm from "./ParticipantForm";
import { TbUserScan } from "react-icons/tb";
import CameraCapture from "./CameraCapture";
import { assignCode } from "../../app/utils/assignCode";
import { ongoingUpdate } from "../../app/utils/ongoingUpdate";

function GetResult({ result }:{result:any}) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-3 w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th className="w-max">Rank</th>
            <th>Code</th>
            <th>Student</th>
            <th>Campus</th>

            <th>Grade</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {result?.first?.length != 0 && (
            <tr>
              <td>1</td>
              <td>
                <ul>
                  {result?.first?.map((student:any) => (
                    <li>{student.code}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {result?.first?.map((student:any) => (
                    <li>{student.studentName}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {result?.first?.map((student:any) => (
                    <li>{student.campusName}</li>
                  ))}
                </ul>
              </td>

              <td>
                <ul>
                  {result?.first?.map((student:any) => (
                    <li>{student.grade || ""}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {result?.first?.map((student:any) => (
                    <li>{student.points}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {result?.second?.length != 0 && (
            <tr>
              <td>2</td>
              <td>
                <ul>
                  {result?.second?.map((student:any) => (
                    <li>{student.code}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {result?.second?.map((student:any) => (
                    <li>{student.studentName}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {result?.second?.map((student:any) => (
                    <li>{student.campusName}</li>
                  ))}
                </ul>
              </td>

              <td>
                <ul>
                  {result?.second?.map((student:any) => (
                    <li>{student.grade || ""}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {result?.second?.map((student:any) => (
                    <li>{student.points}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {result?.third?.length != 0 && (
            <tr>
              <td>3</td>
              <td>
                <ul>
                  {result?.third?.map((student:any) => (
                    <li>{student.code}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {result?.third?.map((student:any) => (
                    <li>{student.studentName}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {result?.third?.map((student:any) => (
                    <li>{student.campusName}</li>
                  ))}
                </ul>
              </td>

              <td>
                <ul>
                  {result?.third?.map((student:any) => (
                    <li>{student.grade || ""}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {result?.third?.map((student:any) => (
                    <li>{student.points}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {result?.grades ? (
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

export default GetResult;
