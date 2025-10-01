"use client";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { FaDownload } from "react-icons/fa6";
import { brandName } from "../../app/data/branding";
function PrintPrograms({ data }:{data:any}) {
  const programRef = useRef(null);
  const { students, programList, programs, campuses } = data;
  const [cookies] = useCookies([`${brandName}-access`]);
  const [campusName, setCampusName] = useState();
  const [campusId,setCampusId]=useState()
  useEffect(() => {
    setCampusName(cookies[`${brandName}-access`]?.name || null);
    setCampusId(cookies[`${brandName}-access`]?.jamiaNo || null)
  }, []);
  const handleExportToPDF = async () => {
    const input:any = programRef.current;

    try {
      const newWindow:any = window.open();
      newWindow.document.write(
        `<main><script src="https://cdn.tailwindcss.com"></script>${input.innerHTML}</main>`
      );
      setTimeout(() => {
        newWindow.print();
        newWindow.close();
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <a
        href={`/program pdf/${campusId || 'main'}.pdf`}
        title="Download PDF"
        className="absolute -top-4 right-[6rem] text-green-500 hover:opacity-80 mt-5 text-2xl active:scale-90"
        download
      >
        <FaDownload />
      </a>
      {/* <span onClick={handleExportToPDF}>helo</span> */}
      <div ref={programRef} className="py-2 px-3 bg-transparent">
        <style>
          {`
         li:last-child{
          border-bottom: 0;
        }
        @media print {
          .new-page:not(:first-child) {
            page-break-before: always;
        }
        }
        
         `}
        </style>
        {campusName && (
          <div>
            <h1 className="text-4xl font-bold text-center">{campusName}</h1>
            <h2 className="text-center font-semibold text-3xl">
              Programs List
            </h2>
          </div>
        )}
        <div>
          {programs.map((category:any, index:number) => (
            <div
              key={index}
              className={`my-3 px-2 py-1 ${campusName && "new-page"}`}
            >
              {campusName && (
                <div className="mt-3">
                  <h3 className="text-center text-3xl font-semibold">
                    {category.label}
                  </h3>
                </div>
              )}
              <div className=" my-2">
                {category.programs.map((program:any, index:number) => (
                  <div key={program.id} className={`mb-2 ${!campusName && 'new-page'}`}>
                    {campusName ? (
                      <h4 className="border-x border-t text-center text-xl font-bold border-b border-black">
                        {program.name}
                      </h4>
                    ) : (
                      <>
                        <h1 className="text-4xl font-bold text-center mb-4">
                          RENDEZVOUS 2024
                        </h1>
                        <div className="flex gap-1 justify-center items-baseline">
                          <h4 className="text-2xl mb-2 font-bold">
                            {program.name}
                          </h4>
                          <p className="font-semibold text-xl">
                            {'('+category.label+')'}
                          </p>
                        </div>
                      </>
                    )}
                    <table className="w-full print-table">
                      <thead className="border border-black">
                        <tr>
                          <th className="w-10 border-r border-black"></th>
                          <th className=" border-r border-black">
                            Name of Student
                          </th>
                          <th className="w-max border-r border-black">
                            Jamia No
                          </th>
                          {!campusName && <><th className="w-max border-r border-black">Campus</th>
                          <th className="w-max border-r border-black">Code</th>
                          <th className="w-[6rem]">Sign</th>
                          </>}
                        </tr>
                      </thead>
                      <tbody>
                        {programList
                          .filter(
                            (list:any) =>
                              list.program == program.id && list.student !== ""
                          )
                          .map((participant:any, index:number) => (
                            <tr
                              key={participant.id}
                              className="border-b border-x border-black"
                            >
                              <th className="w-10 border-r border-black">
                                {index + 1}
                              </th>
                              <td className=" border-r border-black">
                                <ul>
                                  {participant.student
                                    .split("&")
                                    .map((jamiaNo:any, index:number) => (
                                      <li
                                        key={jamiaNo}
                                        className="pl-5 border-b border-black"
                                      >
                                        {
                                          students.find(
                                            (student:any) =>
                                              student.jamiaNo == jamiaNo
                                          )?.name
                                        }
                                      </li>
                                    ))}
                                </ul>
                              </td>
                              <td className="border-r border-black">
                                <ul>
                                  {participant.student
                                    .split("&")
                                    .map((jamiaNo:any, index:number) => (
                                      <li
                                        key={jamiaNo}
                                        className="text-center border-b border-black"
                                      >
                                        {jamiaNo}
                                      </li>
                                    ))}
                                </ul>
                              </td>
                              {!campusName && (
                                <>
                                <td className="text-center border-r border-black">
                                  {
                                    campuses.find(
                                      (campus:any) =>
                                        campus.jamiaNo == participant.campus
                                    )?.name
                                  }
                                </td>
                                <td className="w-max border-r border-black"></td>
                                <td className="w-[6rem]"></td>
                                </>
                              )}
                            </tr>
                            
                          ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrintPrograms;
