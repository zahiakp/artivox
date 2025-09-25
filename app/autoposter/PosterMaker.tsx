"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useCookies } from "react-cookie";
import {
    getProgramsbyStatusandPagination,
} from "../programs/func";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { generatePDF } from "../published/GenaratePdf";
import { ProResult } from "../judgement/func";
import IconMaximizeSquare from "../../components/icon/icon-maximize-square";
import IconDownload2 from "../../components/icon/icon-download2";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import { getFirstLastInitials } from "../../components/common/NameShorter";
import LDRloader from "../../components/common/LDRloader";
import SearchBar from "./SearchBar";
// DEBUG: Assuming PosterCanvas is the component to show the poster.
import PosterCanvas from "../../components/common/PosterCanvas";
import { BsStars } from "react-icons/bs";
import ResultCard from "../../components/common/ResultCard";
import { categoryMap } from "../data/branding";

function PosterMaker() {
    const [cookies] = useCookies(["access"]);
    // DEBUG: Safely access nested properties from cookies.
    // This prevents "cannot read properties of undefined" if `cookies.access` doesn't exist.
    const userRole = cookies?.access?.role;
    const campusId = cookies?.access?.campusId;

    const [datas, setDatas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Set initial loading to true
    const [error, setError] = useState<string | null>(null);
    const [drop, setDrop] = useState<{ program: any; result: any } | null>(null);

    // Pagination state
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(18);

    // Search state
    const [inputValue, setInputValue] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [downloading,setDownloading] = useState<any>(null);


    const[result,setResult]=useState<any|null>(null);

    // DEBUG: useMemo is better for values that are derived from state/props.
    const resultEndpoint = useMemo(() => {
        switch (userRole) {
            case "admin":
            case "team":
            case "result":
                return "results";
            default:
                return "";
        }
    }, [userRole]);

    const proEndpoint = useMemo(() => {
        switch (userRole) {
            case "admin":
            case "team":
            case "result":
                return "programs";
            default:
                return "";
        }
    }, [userRole]);


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
            
                response = await getProgramsbyStatusandPagination(
                    "announced",
                    params.toString(),
                    proEndpoint
                );
            

            if (response && response.data) {
                setDatas(response.data);
                setTotalRecords(response.total || 0);
            } else {
                setDatas([]);
                setTotalRecords(0);
                console.error("No programs returned");
            }
        } catch (err: any) {
            setError("Failed to fetch programs. Please try again later.");
            console.error("Error fetching programs:", err);
        } finally {
            setLoading(false);
        }
    }, [page, rows, searchQuery, userRole, campusId, proEndpoint]);

    useEffect(() => {
        // Fetch programs when component mounts or dependencies change
        fetchPrograms();
    }, [fetchPrograms]);

const fetchResultbyProgams = async (program: any) => {
    // setLoading(true);
    try {
      const response = await ProResult(program.id, resultEndpoint);
      if (response.success) {
        setResult({
          program: program,
          result: response.data.sort((a: any, b: any) => a.rank - b.rank),
        });
      }
      console.log(drop);
      
    } catch (error) {
      console.error("Error fetching program result:", error);
    }
    // setLoading(false);
  };

    const fetchResultbyProgam = async (program: any) => {
        try {
            const response = await ProResult(program.id, resultEndpoint);
            if (response.success && response.data) {
                console.log(response.data);
                
                setDrop({
                    program: program,
                    result: response.data.sort((a: any, b: any) => a.rank - b.rank),
                });
            } else {
                console.error("No result returned or data is invalid", response);
            }
        } catch (error) {
            console.error("Error fetching result for program:", error);
        }
    };

    const handleDownload = async (program: any) => {
        try {
            const result = await ProResult(program.id, resultEndpoint);
            if (result && result.success && Array.isArray(result.data)) {
                const pdfBlob = generatePDF(result.data, program);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement("a");
                link.href = url;
                const fileName = `Result-${program.order ? `${program.order}_` : ''}${program.category.toUpperCase()}_${program.name.toUpperCase()}.pdf`;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setDownloading(null)
            } else {
                console.error("No result returned or data is invalid for PDF generation", result);
            }
        } catch (error) {
            console.error("Error during PDF download:", error);
        }
    };

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setPage(e.page + 1);
        setRows(e.rows);
    };

    const handleSearch = () => {
        setSearchQuery(inputValue);
        setPage(1); // Reset to first page on new search
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };
    
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };


    const renderContent = () => {
        if (loading) {
            return (
                <div className='bg-primary-50 flex items-center justify-center w-full h-60 rounded-lg border border-primary-200'>
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

        // DEBUG: Ensure `datas` is an array before calling .length or .map
        if (!Array.isArray(datas) || datas.length === 0) {
            return (
                <div className="flex gap-5 w-full bg-red-50 rounded-xl min-h-60 border border-red-200 items-center justify-center flex-col p-10">
                    <div className="p-5 rounded-full bg-red-100 text-red-600"><IconInfoHexagon size="50" /></div>
                    No Programs Found
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
                            {datas.map((program: any) => (
                                <tr key={program.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={`https://placehold.co/40x40/f7e6ff/7d00b3?text=${program.order || "W"}`}
                                                alt={program.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div className="ml-4">
                                                <p className="text-sm font-medium line-clamp-1 text-gray-900">{program.name}</p>
                                                <div className="text-[12px] text-gray-500">ID: #PRGM{program.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categoryMap[program.category.toString()] || "Unknown"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                                        <button
                                            onClick={() => fetchResultbyProgam(program)}
                                            className="p-2 rounded-lg gap-2 px-3 pr-4 text-white flex items-center bg-gradient-to-br from-violet-400 to-violet-600"
                                        >
                                            <BsStars /> Poster
                                        </button>
                                        <button
                                            onClick={() => fetchResultbyProgams(program)}
                                            className="p-2 rounded-lg gap-2 px-3 pr-4 text-white flex items-center bg-gradient-to-r from-green-500 to-emerald-600"
                                        >
                                            <IconMaximizeSquare size="18" /> Result
                                        </button>
                                        <button disabled={downloading == program.id}
                              className="rounded-lg h-8 w-8 flex items-center justify-center disabled:grayscale bg-gradient-to-r text-white from-red-400 to-red-500 cursor-pointer"
                              onClick={() => {setDownloading(program.id); handleDownload(program)}}
                            >
                             {downloading == program.id ? <span className="text-lg">••</span> : <IconDownload2 />}
                            </button>
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
                            rowsPerPageOptions={[10, 15, 20, 30]} // Added more options
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-6 space-y-6">
            <SearchBar handleKeyDown={handleSearchKeyDown} handleSearchInputChange={handleSearchInputChange} inputValue={inputValue}/>
            {renderContent()}
            {drop && <PosterCanvas close={() => setDrop(null)} data={drop} />}
            {result && <ResultCard data={result} close={setResult} />}
        </div>
    );
}

export default PosterMaker;
