"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useCookies } from "react-cookie";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { IoSearchOutline } from "react-icons/io5";

// --- Import Custom Components ---
import { getFirstLastInitials } from "../../components/common/NameShorter";
import LDRloader from "../../components/common/LDRloader";
import AwardCard from "../../components/common/AwardCard";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import IconMaximizeSquare from "../../components/icon/icon-maximize-square";

// --- Import API Functions ---
import { getAwardDetails } from "../programs/func";
import Overview from "../results/Overview";
import { brandName } from "../data/branding";

// --- Type Definitions ---

type UserRole = "admin" | "judge" | "award" | "result";

interface UserAccess {
    role?: UserRole;
    campusId?: string | number;
}

interface ProgramResult {
    id: number;
    status: 'awarded' | 'pending';
    rank: string;
}

interface Program {
    id: number;
    name: string;
    category: string;
    order: string;
    // FIX: Made the results property optional to match potential API responses
    results?: ProgramResult[];
}

interface ApiResponse {
    data: Program[];
    total: number;
}

// --- Helper & Sub-Components ---

const LoadingState = () => (
    <div className='bg-primary-50 flex items-center justify-center w-full h-60 rounded-lg border border-primary-200'>
        <LDRloader />
    </div>
);

const ErrorState = ({ message }: { message: string }) => (
    <div className="flex gap-5 w-full bg-red-50 rounded-xl min-h-60 border border-red-200 items-center justify-center flex-col p-10">
        <div className="p-5 rounded-full bg-red-100 text-red-600"><IconInfoHexagon size="50" /></div>
        {message}
    </div>
);

const EmptyState = ({ message }: { message: string }) => (
    <div className="flex gap-5 w-full bg-blue-50 rounded-xl min-h-60 border border-blue-100 items-center justify-center flex-col p-10">
        <div className="p-5 rounded-full bg-blue-100 text-blue-600"><IconInfoHexagon size="50" /></div>
        {message}
    </div>
);

/**
 * Renders the award status for a program.
 * Integrates the more detailed display logic from the user's latest version.
 */
const AwardStatus = ({ results = [] }: { results?: ProgramResult[] }) => {
    // FIX: By setting a default value `results = []`, we prevent the TypeError.
    const awardedCount = results.filter(r => r.status === 'awarded').length;

    if (results.length > 0 && awardedCount === results.length) {
        return <p className="uppercase text-sm font-semibold text-green-600 ">All Awarded</p>;
    }
    
    if (awardedCount > 0) {
        return (
            <div className="flex items-center gap-2 flex-wrap">
                 <p className="uppercase text-sm font-semibold text-blue-600 ">
                    {awardedCount} Awarded
                </p>
            </div>
        );
    }

    return <p className="uppercase text-sm font-semibold text-red-600 ">Not Awarded</p>;
};

const ProgramTable = ({
    programs,
    onUpdateClick,
}: {
    programs: Program[];
    onUpdateClick: (program: Program) => void;
}) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Award Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {programs.map((program) => (
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
                        <td className="px-6 py-4 whitespace-nowrap uppercase text-sm text-gray-500">{program.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <AwardStatus results={program.results} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                                onClick={() => onUpdateClick(program)}
                                className="p-2 rounded-lg gap-2 px-3 pr-4 text-white flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all"
                            >
                                <IconMaximizeSquare size="18" /> Update
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


// --- Main Component ---

function AwardList() {
    const [cookies] = useCookies([`${brandName}-access`]);
    const { role, campusId }: UserAccess = cookies[`${brandName}-access`] || {};

    const [programs, setPrograms] = useState<Program[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(15);
    
    const [inputValue, setInputValue] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    const proEndpoint = useMemo(() => {
        switch (role) {
            case "admin":
            case "judge": 
            case "result": 
            case "award": 
            return "programs";
            default: return "";
        }
    }, [role]);

    const fetchPrograms = useCallback(async () => {
        if (!proEndpoint) {
            setError("Invalid user role. Cannot fetch data.");
            setLoading(false);
            return;
        }
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
            let response: ApiResponse;
            
                response = await getAwardDetails(params.toString());
            

            setPrograms(response?.data || []);
            setTotalRecords(response?.total || 0);

        } catch (err: any) {
            console.error("Error fetching programs:", err);
            setError("Failed to fetch programs. Please try again later.");
            setPrograms([]);
            setTotalRecords(0);
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

    const handleSearch = () => {
        setSearchQuery(inputValue);
        setPage(1); // Reset to first page on new search
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const renderContent = () => {
        if (loading) return <LoadingState />;
        if (error) return <ErrorState message={error} />;
        if (programs.length === 0) return <EmptyState message={searchQuery ? `No results found for "${searchQuery}"` : "No Announced Programs Found"} />;

        return (
            <>
            <div className="p-[6px] px-4 rounded-lg flex md:hiddenitems-center border border-gray-200 gap-3 w-full sm:w-1/3">
                        <input
                            id="search-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="outline-none border-none w-full bg-transparent"
                            type="search"
                            placeholder="Search by program name..."
                        />
                        <button onClick={handleSearch} className="cursor-pointer text-gray-500 hover:text-gray-800">
                            <IoSearchOutline className="text-xl" />
                        </button>
                    </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center gap-4 flex-wrap">
                    <h3 className="text-lg font-medium text-gray-900"><span className="font-bold">{totalRecords}</span> Program(s)</h3>
                    
                    <div className="p-[6px] hidden px-4 rounded-lg md:flex items-center border border-gray-200 gap-3 w-full sm:w-1/3">
                        <input
                            id="search-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="outline-none border-none w-full bg-transparent"
                            type="search"
                            placeholder="Search by program name..."
                        />
                        <button onClick={handleSearch} className="cursor-pointer text-gray-500 hover:text-gray-800">
                            <IoSearchOutline className="text-xl" />
                        </button>
                    </div>
                </div>

                <ProgramTable programs={programs} onUpdateClick={setSelectedProgram} />

                <div className="px-6 border-t border-gray-200 flex items-center justify-between gap-4">
                    <div className="hidden md:block text-sm text-gray-700">
                        Showing {(page - 1) * rows + 1} to {Math.min(page * rows, totalRecords)} of {totalRecords}
                    </div>
                    <div className="w-fit"><Paginator
                        first={(page - 1) * rows}
                        rows={rows}
                        totalRecords={totalRecords}
                        rowsPerPageOptions={[10, 15, 20]}
                        onPageChange={onPageChange}
                        className="p-0"
                    /></div>
                </div>
            </div></>
        );
    };

    return (
        <div className="space-y-6 grid grid-cols-1">   
        {/* <Overview/> */}
            {renderContent()}
            {selectedProgram && (
                <AwardCard 
                    fetchPrograms={fetchPrograms} 
                    program={selectedProgram} 
                    close={() => setSelectedProgram(null)} 
                />
            )}
        </div>
    );
}

export default AwardList;
