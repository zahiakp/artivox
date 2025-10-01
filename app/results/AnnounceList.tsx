"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { IoSearchOutline } from "react-icons/io5";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import IndividualPoint from "./Indivitual"; // Renamed for clarity, assuming this is the refactored component
import Group from "./Group";

// API Function Imports
import {
  AssignBulkOrder,
  getJudgedPros,
  getProgramsbyStatusandPagination,
} from "../programs/func";
import { showMessage } from "../../components/common/CusToast";
import LDRloader from "../../components/common/LDRloader";
import Confirm from "../../components/common/Confirm";
import ResultCard from "../../components/common/ResultCard";
import { ProResult } from "../judgement/func";
import Overview from "./Overview";
import CategoryDesignProvider from "../../components/common/CategoryDesign";
import { brandName, categoryMap } from "../data/branding";

// Main Component
function AnnounceList() {
  const [cookies] = useCookies([`${brandName}-access`]);
  const user = cookies[`${brandName}-access`] || {};

  // Main status to switch between tabs
  const [status, setStatus] = useState<"program" | "campus" | "indivitual">("program");

  // State for "Program Results" tab
  const [reporting, setReporting] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // State for reordering functionality
  const [list, setList] = useState<any[]>([]);
  const [isReordering, setIsReordering] = useState(false);

  // State for modals/popups
  const [drop, setDrop] = useState<any>();
  const [confirm, setConfirm] = useState<any>();

  // Memoized options for the main status tabs
  const statusOptions = useMemo(() => {
    if (user.role === "admin") {
      return [
        { label: "Program Results", value: "program" },
        { label: "Team Points", value: "campus" },
        { label: "Individual Points", value: "indivitual" },
      ];
    } else {
      return [
        { label: "Program Results", value: "program" },
        { label: "Team Points", value: "campus" },
      ];
    }
  }, [user.role]);

  // Memoized API endpoints based on user role
  const resultEndpoint = useMemo(() => {
    switch (user.role) {
      case "admin":
      case "announce":
        return "results";
      default:
        return "";
    }
  }, [user.role]);

  const programEndpoint = useMemo(() => {
    switch (user.role) {
      case "admin":
      case "announce":
        return "programs";
      default:
        return "";
    }
  }, [user.role]);

  // Fetches the list of judged programs for the "Program Results" tab
  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams({
      page: page.toString(),
      limit: rows.toString(),
      search: searchQuery || '',
    }).toString();

    try {
      let programsResponse = await getJudgedPros(query,"judged");

      if (programsResponse) {
        setReporting(programsResponse.data || []);
        setTotalRecords(programsResponse.total || 0);
      } else {
        setReporting([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setReporting([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [page, rows, searchQuery, user.role, user.campusId, programEndpoint]);

  // Effect to fetch data only when the "program" tab is active
  useEffect(() => {
    if (status === 'program') {
      fetchPrograms();
    }
  }, [status, fetchPrograms]);

  // Fetches results for a specific program to show in the ResultCard
  const fetchResultbyProgam = async (program: any) => {
    // setLoading(true);
    try {
      const response = await ProResult(program.id, resultEndpoint);
      if (response.success) {
        setDrop({
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

  

  // Handles pagination change
  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setPage(e.page + 1);
    setRows(e.rows);
  };

  // Handles search on Enter key press
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchPrograms();
    }
  };

  // --- Reordering Logic ---
  const handleReorderClick = () => {
    if (isReordering) {
      if (list.length > 0) {
        confirmReorder();
      } else {
        handleClearReorder(); // Cancel action
      }
    } else {
      setIsReordering(true); // Start reordering
    }
  };

  const confirmReorder = async () => {
    setLoading(true);
    try {
      const remains = reporting.filter((item: any) => !list.includes(item.id));
      const startOrder = reporting[0]?.order || 1;
      const updatedList = [...list, ...remains.map((item: any) => item.id)].map(
        (id: any, index: number) => ({ id, order: index + startOrder })
      );
      
      const response = await AssignBulkOrder(updatedList, programEndpoint);
      if (response) {
        showMessage("Programs reordered successfully", "success");
        handleClearReorder();
        fetchPrograms();
      }
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClearReorder = () => {
    setIsReordering(false);
    setList([]);
  };

  const handleProgramRowClick = (programId: any) => {
    if (isReordering) {
      setList(prevList =>
        prevList.includes(programId)
          ? prevList.filter((id) => id !== programId)
          : [...prevList, programId]
      );
    }
  };


  // --- Render Functions ---
  const renderProgramResults = () => {
    if (loading) {
      return <div className='bg-primary-50 flex items-center justify-center w-full h-60 rounded-lg border border-primary-200'><LDRloader /></div>;
    }
    if (reporting.length === 0) {
      return (
        <div className="flex gap-5 w-full bg-blue-50 rounded-xl min-h-60 border border-blue-200 items-center justify-center flex-col p-10">
          <div className="p-5 rounded-full bg-blue-100 text-blue-600"><IconInfoHexagon size="50" /></div>
          No Programs Found
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900"><span className="font-bold">{totalRecords}</span> Programs</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Showing {(page - 1) * rows + 1}-{Math.min(page * rows, totalRecords)} of {totalRecords}</span>
          </div>
          <div className="flex items-center gap-4">
            {/* <button onClick={handleReorderClick} className="cursor-pointer py-2 px-5 rounded-lg bg-blue-600 font-semibold text-base text-white transition-colors hover:bg-blue-700">
              {isReordering ? (list.length > 0 ? 'Confirm' : 'Cancel') : 'Reorder'}
            </button>
            {list.length > 0 && isReordering && (
              <button onClick={handleClearReorder} className="cursor-pointer py-2 px-5 rounded-lg bg-red-600 font-semibold text-base text-white transition-colors hover:bg-red-700">
                Clear
              </button>
            )} */}
            <div className="p-[6px] px-4 rounded-lg flex items-center border border-gray-200 gap-3">
              <input id="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown} className="outline-none border-none w-full" type="search" placeholder="Search" />
              <IoSearchOutline className="text-xl text-gray-500" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reporting.sort((a, b) => a.order - b.order).map((program) => (
                <tr key={program.id} onClick={() => handleProgramRowClick(program.id)} className={`${list.includes(program.id) ? 'bg-primary-100' : ''} ${isReordering ? 'cursor-pointer' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={`https://placehold.co/40x40/f7e6ff/7d00b3?text=${program.order || "W"}`} alt={program.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="ml-4">
                        <p className="text-sm font-medium line-clamp-1 text-gray-900">{program.name}</p>
                        <div className="text-[12px] text-gray-500">ID: #PRGM{program.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categoryMap[program.category.toString()] || "Unknown"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <div className="flex gap-3">
                      <button onClick={(e) => { e.stopPropagation(); fetchResultbyProgam(program); }} className="p-2 rounded-lg gap-2 px-3 pr-4 flex text-white bg-green-600 hover:bg-green-700 transition-colors">View Result</button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirm({ program, type: "announced" }); }} className="p-2 px-4 rounded-lg gap-2 flex text-white bg-blue-600 hover:bg-blue-700 transition-colors">Publish</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {page} of {totalRecords > 0 ? Math.ceil(totalRecords / rows) : 1}
          </div>
          <div className="w-fit"><Paginator first={(page - 1) * rows} rows={rows} totalRecords={totalRecords} rowsPerPageOptions={[10, 15, 20, 50]} onPageChange={onPageChange} />
        </div></div>
      </div>
    );
  };

  const renderContent = () => {
    switch (status) {
      case 'program':
        return renderProgramResults();
      case 'campus':
        return <Group />;
      case 'indivitual':
        return <IndividualPoint/>; // Using the clear name
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* <Overview/> */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatus(option.value as "program" | "campus" | "indivitual")}
                className={`px-4 py-2 ${status === option.value ? "bg-primary-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"} rounded-lg text-sm transition-colors font-medium`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {renderContent()}

      {confirm && <Confirm {...confirm} close={setConfirm} fetch={fetchPrograms} />}
      {drop && <ResultCard data={drop} close={setDrop} />}
    </div>
  );
}

export default AnnounceList;
