"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FcRating } from "react-icons/fc";
import AddResult from "../../components/common/AddResult";
import Confirm from "../../components/common/Confirm";
import { useCookies } from "react-cookie";
import { FaCheckCircle } from "react-icons/fa";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import ResultAssign from "../../components/common/ResultAssign";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { getProgramsbyStatusandPagination, getProgramsforJudgment } from "../programs/func";
import { IoSearchOutline } from "react-icons/io5";
import LDRloader from "../../components/common/LDRloader";
import IconMenuElements from "../../components/icon/menu/icon-menu-elements";
import { getFirstLastInitials } from "../../components/common/NameShorter";
import OffStage from "./OffStage";
import Finalize from "./Finalize";

function ResultList() {
    const [add, setAdd] = useState<any>(null);
    const [confirm, setConfirm] = useState<any>(null);
    const [cookies] = useCookies(["access"]);
    const { role, campusId } = cookies.access || {};

    const [ongoing, setOngoing] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [reporting, setReporting] = useState([]);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [status, setStatus] = useState<"stage" | "off"  | "finalize">("stage");
    const [inputValue, setInputValue] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const statusOptions = useMemo(() => {
        if (role === "admin") {
          return [
            { label: "Stage", value: "stage" },
            { label: "Off Stage", value: "off" },
            { label: "Finalize", value: "finalize" },
          ];
        } else {
          return [
            { label: "Stage", value: "stage" },
            { label: "Off Stage", value: "off" },
          ];
        }
      }, [role]);

    const proEndpoint = useMemo(() => {
        switch (role) {
            case "admin":
            case "judge":
                return "programs";
            case "zoneAdmin":
            case "zonecampus":
                return "zoneprograms";
            case "campusAdmin":
            case "campusJudge":
                return "campusprograms";
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
            
                response = await getProgramsforJudgment("ongoing,finished", params.toString(), proEndpoint, 1);
            

            if (response && response.data) {
                setOngoing(response.data);
                setTotalRecords(response.totalCount || response.total);
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
                <div className="flex gap-5 w-full bg-blue-50 rounded-xl min-h-60 border border-blue-200 items-center justify-center flex-col p-10">
                    <div className="p-5 rounded-full bg-blue-100 text-blue-600"><IconInfoHexagon size="50" /></div>
                    No Programs
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900"><span className="font-bold">{totalRecords}</span> Program(s)</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Showing {(page - 1) * rows + 1}-{Math.min(page * rows, totalRecords)} of {totalRecords}</span>
                    </div>
                    <div className="p-[6px] px-4 rounded-lg flex items-center border border-gray-200 gap-3 w-1/3">
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
                                    <td className="px-6 py-4 flex whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            className="rounded-lg p-2 h-max px-4 bg-gradient-to-tr from-violet-400 to-violet-500 text-white flex w-fit cursor-pointer"
                                            onClick={() => {
                                                const participants = program.isStage > 0
                                                    ? program.participantsData.filter((item: any) => item.code != null)
                                                    : program.participantsData.filter((item: any) => item.status === "finished");
                                                setAdd({ program, participants });
                                            }}
                                        >
                                            Update Result
                                        </button>
                                        {(role !== 'campusJudge' && role !== 'judge') && program.participantsData.some((item: any) => item.status === "finished" && item.mark !== 0) && program.status === 'finished' && (
                                            <button
                                                className="rounded-lg p-2 px-5 h-max bg-gradient-to-tr from-green-500 to-emerald-600 text-white flex w-fit cursor-pointer"
                                                onClick={() => setConfirm({ program, type: "resulted" })}
                                            >
                                                Confirm
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
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
            </div>
        );
    };

    return (
        <div className="w-full relative">
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setStatus(option.value as "stage" | "off")}
                                className={`px-4 py-2 ${status === option.value ? "bg-primary-600 text-white" : "hover:bg-gray-50 border border-gray-300 text-gray-700"} rounded-lg text-sm transition-colors font-medium`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {status === "stage" && renderContent()}
            {status === "off" && <OffStage/>}
            {status === "finalize" && <Finalize/>}

            {add && <AddResult close={() => setAdd(null)} data={add} fetch={fetchPrograms} />}
            {confirm && <ResultAssign {...confirm} close={() => setConfirm(null)} fetch={fetchPrograms} />}
        </div>
    );
}

export default ResultList;