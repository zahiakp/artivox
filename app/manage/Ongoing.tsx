"use client";;
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useCookies } from "react-cookie";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { getProgramsbyStatusandPagination } from "../programs/func";
import { IoSearchOutline } from "react-icons/io5";
import LDRloader from "../../components/common/LDRloader";
import { getFirstLastInitials } from "../../components/common/NameShorter";
import Confirm from "../../components/common/Confirm";
import IconClipboardText from "../../components/icon/icon-clipboard-text";
import Report from "../../components/common/Report";
import IconCircleCheck from "../../components/icon/icon-circle-check";
// import { getTopicsByProgram } from "../topics/func";
// import { TopicCard } from "../../components/common/TopicCard";
import IconRefresh from "../../components/icon/icon-refresh";
import { RxLetterCaseCapitalize } from "react-icons/rx";


function Reporting() {
    const [cookies] = useCookies(["access"]);
    const { role, campusId } = cookies.access || {};
    const [ongoing, setOngoing] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [inputValue, setInputValue] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [confirm, setConfirm] = useState<any>(null);
    const [report, setReport] = useState<any>(null);
    const [view, setView] = useState<any>(null);
    // const [topics, setTopics] = useState([]);
    
    const proEndpoint = useMemo(() => {
        switch (role) {
            case "admin":
            case "judge":
            case "report":
                return "programs";
            default:
                return "";
        }
    }, [role]);

    const fetchPrograms = useCallback(async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
            page: page.toString(),
            limit: rows.toString(),
        });

        if (searchQuery) {
            params.append('search', searchQuery);
        }

        try {
            let response;
            
                response = await getProgramsbyStatusandPagination("ongoing", params.toString(), proEndpoint);
            

            if (response && response.data) {
                const filteredData = response.data;
                setOngoing(filteredData);
                setTotalRecords(response.total || filteredData.length);
            } else {
                setOngoing([]);
                setTotalRecords(0);
                console.error("No programs returned");
            }
        } catch (err: any) {
            console.error("Error fetching programs:", err);
            setError("Failed to fetch programs. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [page, rows, searchQuery, role, campusId, proEndpoint]);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setPage(e.page + 1);
        setRows(e.rows);
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSearch = () => {
        setSearchQuery(inputValue);
        setPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
//     const fetchTopcsbyProgam = async (program:any) => {
//     try {
//       const response = await getTopicsByProgram(program.id);
// console.log(response);

//       if (response.success) {
//           setView({
//             program: program,
//             topics: response.data.sort((a: any, b: any) => a.id - b.id),
//           });
//         }
//     } catch (error) {
//       console.error("Error fetching programs:", error);
//     }
//   };

    const renderContent = () => {
        if (loading) {
            return (
                <div className='bg-primary-50 flex items-center w-full h-60 rounded-lg border border-primary-200'>
                    <LDRloader />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex gap-5 w-full bg-red-50 rounded-xl min-h-60 border border-red-200 items-center justify-center flex-col p-10">
                    <div className="p-5 rounded-full bg-red-100 text-red-600"><IconInfoHexagon size="50" /></div>
                    {error}
                </div>
            );
        }

        if (ongoing.length === 0) {
            return (
                <div className="flex gap-5 w-full bg-red-50 rounded-xl min-h-60 border border-red-200 items-center justify-center flex-col p-10">
                    <div className="p-5 rounded-full bg-red-100 text-red-600"><IconInfoHexagon size="50" /></div>
                    No Programs
                </div>
            );
        }

        return (<>
        <div className="py-3 md:hidden mb-6 px-4 rounded-lg flex items-center border bg-white border-gray-200 gap-3 w-full">
                                <input
                                    id="search-input"
                                    value={inputValue}
                                    onChange={handleSearchInputChange}
                                    onKeyDown={handleKeyDown}
                                    className="outline-none border-none w-full"
                                    type="search"
                                    placeholder="Search"
                                />
                                <div onClick={handleSearch} className="cursor-pointer">
                                    <IoSearchOutline className="text-xl" />
                                </div>
                            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900"><span className="font-bold">{totalRecords}</span> Program(s)</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Showing {(page - 1) * rows + 1}-{Math.min(page * rows, totalRecords)} of {totalRecords}</span>
                    </div>
                    <div className="p-[6px] hidden px-4 rounded-lg md:flex items-center border border-gray-200 gap-3 w-1/3">
                        <input
                            id="search-input"
                            value={inputValue}
                            onChange={handleSearchInputChange}
                            onKeyDown={handleKeyDown}
                            className="outline-none border-none w-full"
                            type="search"
                            placeholder="Search"
                        />
                        <div onClick={handleSearch} className="cursor-pointer">
                            <IoSearchOutline className="text-xl" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                <th className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ongoing.map((program: any) => (
                                <tr key={program.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={`https://placehold.co/40x40/f7e6ff/7d00b3?text=${getFirstLastInitials(program.name) || "AV"}`}
                                                alt={program.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div className="ml-4">
                                                <p className="text-sm font-medium line-clamp-1 text-gray-900">{program.name}</p>
                                                <div className="text-[12px] text-gray-500">ID: #PRGM{program.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap uppercase text-sm text-gray-500">{program.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                      <div className="flex gap-3">
                              {program.participants > 0 &&
                                program.participantsData.some(
                                  (it: any) =>
                                    it.status == "reported" && it.code !== null
                                ) && (
                                  <button
                                    className="tooltip rounded-xl p-2 h-max bg-gradient-to-tr from-teal-400 to-green-600 text-white flex w-fit cursor-pointer"
                                    onClick={() =>
                                      setReport({
                                        program,
                                        participants: program.participantsData
                                          .filter(
                                            (item: any) => item.code != null
                                          )
                                          .sort((a: any, b: any) =>
                                            a.code.localeCompare(b.code)
                                          ),
                                        type: "update",
                                        // topics:
                                        //   topics.filter(
                                        //     (item: any) =>
                                        //       item.programId == program.id
                                        //   ).length > 1 &&
                                        //   topics.filter(
                                        //     (item: any) =>
                                        //       item.programId == program.id
                                        //   ),
                                      })
                                    }
                                    data-tip="Update"
                                  >
                                    <IconRefresh />
                                    {/* Update  */}
                                  </button>
                                )}

                              {program.participants > 0 &&
                                program.status == "ongoing" &&
                                program.participantsData.some(
                                  (it: any) => it.status == "not reported"
                                ) && (
                                  <button
                                    className="tooltip rounded-xl p-2 bg-gradient-to-tr from-blue-400 to-blue-600 text-white flex w-fit cursor-pointer"
                                    onClick={() =>
                                      setReport({
                                        program,
                                        participants:
                                          program.participantsData.filter(
                                            (item: any) =>
                                              item.status == "not reported"
                                          ),
                                        type: "report",
                                      })
                                    }
                                    data-tip="Report"
                                  >
                                    <IconClipboardText />
                                    {/* report */}
                                  </button>
                                )}
                              {/* {program.participants > 0 &&
                                program.status == "ongoing" &&
                                program.participantsData.some(
                                  (it: any) =>
                                    it.status == "reported" && it.code == null
                                ) && ( */}
                                  <button
                                    data-tip="Code"
                                    className="tooltip rounded-xl p-[10px] h-max bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white flex w-fit cursor-pointer"
                                    onClick={() =>
                                      setReport({
                                        program,
                                        participants:
                                          program?.participantsData.filter(
                                            (item: any) =>
                                              item.status !== "not reported"
                                          ),
                                        type: "assign",
                                      })
                                    }
                                  >
                                    <RxLetterCaseCapitalize className="text-xl"/>
                                    {/* assign code  */}
                                  </button>
                                {/* )} */}
                                {/* {program.topics >0 &&  <button data-tip="Get Topic"
                     className="tooltip rounded-xl h-max p-2 bg-gradient-to-tr from-blue-400 to-blue-600 text-white flex w-fit cursor-pointer"
                     onClick={() => fetchTopcsbyProgam(program)}>
                   <IconZipFile/>
                              Get Topic
                              </button>} */}
                              {program.participants > 0 &&
                                program.participantsData.every(
                                  (it: any) => it.status !== "reported"
                                ) && (
                                  <button
                                    data-tip="Finish"
                                    className="tooltip rounded-xl h-max p-2 bg-gradient-to-tr from-red-400 to-violet-600 text-white flex w-fit cursor-pointer"
                                    onClick={() =>
                                      setConfirm({ program, type: "finished" })
                                    }
                                  >
                                    <IconCircleCheck />
                                    {/* Finish */}
                                  </button>
                                )}
                              
                            </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700 hidden md:block">
                        Showing page {page} of {Math.ceil(totalRecords / rows)}
                    </div>
                    <div className="flex space-x-2">
                        <Paginator
                            first={(page - 1) * rows}
                            rows={rows}
                            totalRecords={totalRecords}
                            rowsPerPageOptions={[10, 15, 20]}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
                {confirm && <Confirm {...confirm} close={setConfirm} fetch={fetchPrograms}/>}
                {report && <Report close={setReport} data={report} fetch={fetchPrograms} />}
                {/* {view && <TopicCard close={setView} fetch={fetchPrograms} view={view} />} */}
            </div></>
        );
    };

    return renderContent();
}

export default Reporting;












