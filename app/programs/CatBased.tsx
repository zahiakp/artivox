"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useCookies } from "react-cookie";

// PrimeReact and Icon Imports
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { IoSearchOutline } from "react-icons/io5";
import { MdMicExternalOn, MdOutlineAssignment, MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { RiPenNibFill } from "react-icons/ri";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BsPersonFill } from "react-icons/bs";
import IconDownload2 from "../../components/icon/icon-download2";
import IconMaximizeSquare from "../../components/icon/icon-maximize-square";
import IconNotesEdit from "../../components/icon/icon-notes-edit";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import IconListCheck from "../../components/icon/icon-list-check";
import IconLayoutGrid from "../../components/icon/icon-layout-grid";

// Component Imports
import LDRloader from "../../components/common/LDRloader";
import DeleteItem from "./Delete"; // Assuming this is the correct path
import { generatePDF } from "../../components/common/GenaratePdf";
import { getFirstLastInitials } from "../../components/common/NameShorter";
import AddPrograms from "../../components/common/AddPrograms";
import AssignForm from "../../components/common/AssignForm";
import ParticipantsCard from "../../components/common/ParticipantsCard";

// Function Imports
import {
    getParticipantsbyProgram,
    getParticipantsbyProgramwithTeamId,
    getProgramsbyCategorywithTeamId,
    getProgramswithPagination,
} from "../programs/func";
import { showMessage } from "../../components/common/CusToast";
import { getAllStudentsByteamIdwithCat } from "../students/func";
import { brandName } from "../data/branding";


// --- TYPE DEFINITIONS ---

type UserRole = "admin" | "judge" | "campus" | "campusAdmin";

interface AccessCookie {
    role: UserRole;
    teamId?: string; // Optional teamId
    campusId?: string; // Optional campusId
}

interface Program {
    id: number | string;
    name: string;
    category: string;
    isStage: 0 | 1;
    isGroup: 0 | 1;
    participants: number;
    limit: number;
}

interface Participant {
    id: number | string;
    name: string;
    // Add other relevant participant fields
}

interface ViewState {
    participants: Participant[];
    program: Program;
}

interface AssignState extends Program {
    // Add any additional properties needed for assignment
}

interface CategoryBasedProps {
    category: string;
}

// --- COMPONENT ---

const CategoryBased: React.FC<CategoryBasedProps> = ({ category }) => {
    // --- STATE MANAGEMENT ---
    const [cookies] = useCookies([`${brandName}-access`]);
    const accessInfo: AccessCookie | undefined = cookies[`${brandName}-access`];
    const { role: Role, campusId: campus } = cookies[`${brandName}-access`] || {};
    // Data State
    const [programs, setPrograms] = useState<Program[]>([]);
    
    // UI State
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<ViewState | null>(null);
    const [assign, setAssign] = useState<AssignState | null>(null);
    const [reassign, setReassign] = useState<boolean>(false);
    const [edit, setEdit] = useState<Program | null>(null);

    // Pagination and Search State
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [inputValue, setInputValue] = useState<string>(''); // Holds the immediate input value
    const [searchQuery, setSearchQuery] = useState<string>(''); // Holds the submitted search value
    const [downloading,setDownloading] =useState<any>(null)

    // API Endpoints
    const proEndpoint = "programs";
    const partEndpoint = "participants";

// const fetchStudents = async () => {
//         setLoading(true);
    
//         try {
//           const { role, categories , campusId } = cookies?.access || {};
      
//               let studentsData = null;

//               if (role === 'campus') {
//                     //   const studentsPromises = categories.filter((item:any)=>item.id!=='general').map(async (item: any) => {
//                           const studentData = await getAllStudentsByteamIdwithCat(campusId, category);
              
//                           if (studentData.success) {
//                               console.log(`${category} ${studentData.total} students fetched successfully`);
//                               localStorage.setItem(category.toLowerCase(), JSON.stringify(
//                                   studentData.data.map((student: any) => ({
//                                       [student.jamiaNo] : student.name,
//                                   }))
//                               ));
//                               return studentData.data; // Return the fetched student data
//                           } else {
//                               console.log(`Error fetching students for category ${category}`);
//                               return []; // Return an empty array in case of failure
//                           }
//               }
              
//               console.log("Final Students Data:", studentsData);
              
//       } catch (error) {
//           console.error("Error fetching students data:", error);
//       } finally {
//           setLoading(false);
//       }
      
//       };
//       useEffect(() => {
//         fetchStudents();
//       }, [category]);


console.log("view",view);

    
   const fetchProgramsByRole = async (
       role: string,
       cookies: any,
       query: string,
       endpoint: string
     ) => {
       switch (role) {
         case "admin":
           return await getProgramswithPagination(query);
   
         case "campus":
        //    const status = cookies.access.categories.map((cat: any) => cat.id);
           return await getProgramsbyCategorywithTeamId(
             category,
             accessInfo?.campusId,
             query,
             endpoint
           );
   
         default:
           console.error("Unsupported user role:", role);
           return null;
       }
     };

    const fetchPrograms = useCallback(async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
            page: page.toString(),
            limit: rows.toString(),
            category: category,
        });

        // The API call now uses the submitted `searchQuery` state
        if (searchQuery) {
            params.append('search', searchQuery);
        }

        try {
            if (!category) {
                setPrograms([]);
                setTotalRecords(0);
                return;
            };

            
            const response = await fetchProgramsByRole(
        accessInfo?.role || "",
        cookies,
        params.toString(),
        proEndpoint
      );
            
            if (response && response.success) {
                
                
                setPrograms(response.data || []);
                setTotalRecords(response.total || 0);
            } else {
                throw new Error(response?.message || "Failed to fetch programs.");
            }
        } catch (err: any) {
            console.error("Error fetching programs:", err);
            setError(err.message || "An unexpected error occurred.");
            setPrograms([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    }, [page, rows, category, searchQuery]); // Depends on the submitted searchQuery

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);
    
    // --- EVENT HANDLERS ---

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setPage(e.page + 1);
        setRows(e.rows);
    };

    // This handler now commits the search term when "Enter" is pressed
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setPage(1); // Reset to first page for new search
            setSearchQuery(inputValue); // Commit the inputValue to trigger the API call
        }
    };

    const handleViewParticipants = async (program: Program) => {
        if (view?.program.id === program.id) {
            setView(null);
            return;
        }
        
        try {
             const participantData = await handleGetParticipants(program);
                setView({ participants: participantData || [], program });
           
        } catch (err: any) {
            console.error("Error fetching participants:", err);
            showMessage(err.message, "error");
        }
    };
    const handleGetParticipants = async (program: Program) => {
        try {
            let participantData;
            if (accessInfo?.role === "campus" && accessInfo.campusId) {
                participantData = await getParticipantsbyProgramwithTeamId(program.id, accessInfo.campusId, partEndpoint);
            } else {
                participantData = await getParticipantsbyProgram(program.id);
            }

            if (participantData && participantData.success) {
                return participantData.data || [];
            } else {
                throw new Error(participantData?.message || "Could not fetch participants.");
            }
        } catch (err: any) {
            console.error("Error fetching participants:", err);
            showMessage(err.message, "error");
        }
    };

    const handleDownload = async (program: any) => {
        const endpoint = "participants";
        try {
          const participant = await getParticipantsbyProgramwithTeamId(
            program.id,
            campus,
            partEndpoint
          );
          if (participant) {
            
            const pdfBlob = generatePDF(
              participant?.data,
              program.isGroup,
              program.name,
              program.category
            );
    
            // Create a URL for the Blob and download
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${program.category + "_" + program.name}.pdf`;
            link.click();
    
            // Clean up
            URL.revokeObjectURL(url);
            setDownloading(null)
          } else {
            console.error("No programs returned");
          }
        } catch (error) {
          console.error("Error fetching programs:", error);
        }
      };

    const handleAssignClick = async (program: Program) => {
        if(program.participants > 0){
        const participantData = await handleGetParticipants(program);
        setAssign({...program,participants:participantData});
        }else{
        setAssign(program);
        }
        setReassign(program.participants > 0);
    };

    console.log("assign",assign);
    

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
                <div className="p-5 rounded-full bg-red-100 text-red-600"><IconInfoHexagon size={"50"} /></div>
                <p className="text-red-700 font-medium">{error}</p>
            </div>
        );
    }

    if (programs.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                    <h3 className="text-lg font-medium text-gray-900"><span className="font-bold">{totalRecords}</span> Program(s)</h3>
                    <div className="flex-grow max-w-md">
                        <div className="relative">
                            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                id="search-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="outline-none border border-gray-300 rounded-lg py-2 pl-10 pr-4 w-full focus:ring-2 focus:ring-primary-500"
                                type="search"
                                placeholder="Search by program name..."
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-5 w-full bg-gray-50 rounded-xl min-h-60 border-t border-gray-200 items-center justify-center flex-col p-10">
                    <div className="p-5 rounded-full bg-gray-100 text-gray-500"><IconInfoHexagon size={"50"} /></div>
                    <p className="text-gray-700 font-medium">No Programs Found</p>
                    <p className="text-gray-500 text-sm">There are no programs available for the "{category}" category.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Header with Search and Info */}
                <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                    <h3 className="text-lg font-medium text-gray-900"><span className="font-bold">{totalRecords}</span> Program(s)</h3>
                    <div className="flex-grow max-w-md">
                        <div className="relative">
                            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                id="search-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="outline-none border border-gray-300 rounded-lg py-2 pl-10 pr-4 w-full focus:ring-2 focus:ring-primary-500"
                                type="search"
                                placeholder="Search by program name..."
                            />
                        </div>
                    </div>
                    <span className="text-sm text-gray-500">
                        Showing {(page - 1) * rows + 1}-{Math.min(page * rows, totalRecords)} of {totalRecords}
                    </span>
                </div>

                {/* Programs Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {programs.map((program) => (
                                <tr key={program.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={`https://placehold.co/40x40/f7e6ff/7d00b3?text=${getFirstLastInitials(program.category) || "P"}`}
                                                alt={program.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div className="ml-4">
                                                <p className="text-sm font-medium line-clamp-1 text-gray-900">{program.name}</p>
                                                <div className="text-[12px] text-gray-500">ID: #PRGM{program.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div title={program.isStage ? "Stage Program" : "Off-Stage Program"} className={`p-2 rounded-lg ${program.isStage ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'}`}>
                                                {program.isStage ? <MdMicExternalOn /> : <RiPenNibFill />}
                                            </div>
                                            <div title={program.isGroup ? "Group Program" : "Individual Program"} className={`p-2 rounded-lg ${program.isGroup ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {program.isGroup ? <HiMiniUserGroup /> : <BsPersonFill />}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className={`font-bold ${program.participants === 0 ? "text-red-600" : "text-gray-700"}`}>
                                            {program.participants > 0 ? program.participants : "No"} <span className="font-normal">
                                            {program.isGroup ? `Group(s)` : 'Participants'}
                                            </span>
                                        </div>
                                        
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            {accessInfo?.role === 'admin' && program.participants > 0 && (
                                                <button disabled={downloading == program.id}
                              className="rounded-lg h-8 w-8 flex items-center justify-center disabled:grayscale bg-gradient-to-r text-white from-red-400 to-red-500 cursor-pointer"
                              onClick={() => {setDownloading(program.id); handleDownload(program)}}
                            >
                             {downloading == program.id ? <span className="text-lg">••</span> : <IconDownload2 />}
                            </button>
                                            )}
                                            {program.participants > 0 && (
                                                <button onClick={() => handleViewParticipants(program)} title="View Participants" className="p-2 rounded-lg bg-gradient-to-t from-violet-500 to-violet-400 text-white transition-colors"><IconMaximizeSquare size="18" /></button>
                                            )}
                                            {accessInfo?.role === 'admin' && (
                                                <>
                                                    <button onClick={() => setEdit(program)} title="Edit Program" className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"><IconNotesEdit /></button>
                                                    <DeleteItem id={program.id} root={proEndpoint} fetchPrograms={fetchPrograms} />
                                                </>
                                            )}
                                            {accessInfo?.role === 'campus' && (
                                                <button onClick={() => handleAssignClick(program)} title={program.participants > 0 ? "Re-assign Participants" : "Assign Participants"} className={`p-2 rounded-lg text-[18px] text-white transition-colors ${program.participants > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                                                    {program.participants > 0 ? <MdOutlineAssignmentTurnedIn /> : <MdOutlineAssignment />}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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

            {/* Modals */}
            {edit && (
                <AddPrograms
                    close={() => setEdit(null)}
                    edit={edit}
                    fetchPrograms={fetchPrograms}
                    root={proEndpoint}
                />
            )}
            {assign && (
                <AssignForm
                    close={() => setAssign(null)}
                    assign={assign}
                    reassign={reassign}
                    fetchPrograms={fetchPrograms}
                />
            )}
            {view && (
                <ParticipantsCard
                    participants={view.participants}
                    close={() => setView(null)}
                    program={view.program}
                    fetchPrograms={fetchPrograms}
                />
            )}
        </>
    );
};

export default CategoryBased;
