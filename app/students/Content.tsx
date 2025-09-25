"use client";

import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { IoSearchOutline } from "react-icons/io5";
import { LuFileEdit } from "react-icons/lu";

// --- Component Imports ---
import LDRloader from "../../components/common/LDRloader";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import AddPrograms from "../../components/common/AddPrograms";
import AssignForm from "../../components/common/AssignForm";
import ParticipantsCard from "../../components/common/ParticipantsCard";
import DeleteItem from "./Delete";

// --- Function & Data Imports ---
import { getStudentsByteamId } from "../campus/func";
import { getFirstLastInitials } from "../../components/common/NameShorter";
import { showMessage } from "../../components/common/CusToast";
import { MdOutlineAddCircle } from "react-icons/md";
import AddStudent from "../../components/common/AddStudent";
import { getStudentsByteamIdwithCat } from "./func";
import { categoryMap } from "../data/branding";

// --- Main Component ---
function StudentsContent() {
    // --- State Management ---
    const [cookies] = useCookies(["access"]);
    const { campusId, categories, role } = cookies.access || {};

    // Modal and View States
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState<any>(null);
    const [assign, setAssign] = useState<any>(null);
    const [reassign, setReassign] = useState<any>(null);
    const [view, setView] = useState<any>(null);

    // Data and Fetching States
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination and Filtering States
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(15);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [status, setStatus] = useState<string>("all");

    const proEndpoint = "programs";

    // --- Data Fetching Logic ---
    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: rows.toString(),
                search: searchQuery || "",
            }).toString();

            let response;
            if (status === "all") {
                response = await getStudentsByteamId(campusId, queryParams);
            } else {
                response = await getStudentsByteamIdwithCat(campusId, queryParams, status);
            }

            if (response) {
                setStudents(response.data || []);
                setTotalRecords(response.total || 0);
            } else {
                throw new Error("No data returned from the API.");
            }
        } catch (err: any) {
            console.error("Error fetching students:", err);
            setError("Failed to fetch students. Please try again later.");
            setStudents([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };
    
    // --- Event Handlers ---
    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setPage(e.page + 1);
        setRows(e.rows);
    };

    const handleSearch = () => {
        // A new search should always reset to the first page.
        if (page === 1) {
            fetchStudents(); // Manually fetch if already on page 1
        } else {
            setPage(1); // Triggers the useEffect to fetch
        }
    };
    
    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setPage(1); // Resetting page is crucial and triggers the useEffect
    };

    // --- Effects ---
    // This single useEffect is the source of truth for fetching data when dependencies change.
    useEffect(() => {
        fetchStudents();
    }, [page, rows, status]); // Removed incorrect/duplicate hooks

    // --- UI Data ---
    const statusOptions = [
        { label: "All Students", value: "all" },
        { value: "hizone", label: "Hi Zone" },
        { value: "dzone", label: "D Zone" },
        { value: "pzone", label: "P Zone" },
    ];

    console.log(students);
    console.log("categories",categories);
    
    
    
    // Derived list of categories available to the user from cookies
    const availableCategories = [...(categories?.split(",") || []), "all"];
    
    // --- Render Logic ---
    const renderContentBody = () => {
        if (loading) {
            return (
                <div className='flex items-center justify-center w-full min-h-[300px]'>
                    <LDRloader />
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col gap-5 w-full bg-red-50 rounded-lg min-h-[300px] border border-red-200 items-center justify-center p-10">
                    <div className="p-5 rounded-full bg-red-100 text-red-600"><IconInfoHexagon size="50" /></div>
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            );
        }
        if (students.length === 0) {
            return (
                <div className="flex flex-col gap-5 w-full bg-gray-50 min-h-[300px] items-center justify-center p-10">
                    <div className="p-5 rounded-full bg-gray-100 text-gray-500"><IconInfoHexagon size="50" /></div>
                    <p className="text-gray-700 font-medium">No Students Found</p>
                    <p className="text-gray-500 text-sm">Your search or filter returned no results.</p>
                </div>
            );
        }
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student: any) => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img
                                            src={`https://placehold.co/40x40/f7e6ff/7d00b3?text=${getFirstLastInitials(student.name) || "AV"}`}
                                            alt={student.name}
                                            className="w-10 h-10 rounded-lg object-cover"
                                        />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium line-clamp-1 text-gray-900">{student.name}</p>
                                            <div className="text-[12px] text-gray-500">ID: #STD{student.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.jamiaNo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categoryMap[student.category.toString()] || "Unknown"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="text-lg font-bold flex justify-end gap-2">
                                        <button onClick={() => setEdit(student)} className="text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-md p-2 transition-colors">
                                            <LuFileEdit className="text-lg" />
                                        </button>
                                        <DeleteItem id={student.id} fetchAllStudents={fetchStudents} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            {/* --- Filter Buttons --- */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between mt-6">
                <div className="">
                    <div className="flex flex-wrap gap-2">
                        {statusOptions
                            .filter((option) => availableCategories.includes(option.value))
                            .map((option: any) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleStatusChange(option.value)}
                                    className={`px-4 py-2 ${status === option.value ? "bg-primary-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"} rounded-lg text-sm transition-colors font-medium`}
                                >
                                    {option.label}
                                </button>
                            ))}
                    </div>
                </div><div className="flex gap-3">
                  <button
                            onClick={() =>
                              showMessage(
                                "Importing has been disabled due to a security concern ",
                                "info"
                              )
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Import
                          </button>
                          <button
                            onClick={() => setAdd(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <MdOutlineAddCircle className="text-xl" />
                            <span>Add Student</span>
                          </button>
                </div>
            </div>

            {/* --- Main Content Table/Cards --- */}
            <div className="bg-white rounded-xl border border-gray-200 mt-6 overflow-hidden">
                {/* Consistent Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        <span className="font-bold">{totalRecords}</span> Student(s)
                    </h3>
                    <div className="flex-grow max-w-md">
                        <div className="relative">
                            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="outline-none border border-gray-300 rounded-lg py-2 pl-10 pr-4 w-full focus:ring-2 focus:ring-primary-500"
                                type="search"
                                placeholder="Search by student name..."
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Showing {(page - 1) * rows + 1}-{Math.min(page * rows, totalRecords)} of {totalRecords}</span>
          </div>
                </div>

                {/* Conditional Content Body (Loading, Error, Empty, Data) */}
                {renderContentBody()}

                {/* Consistent Footer with Paginator (only shows if there's data) */}
                {!loading && !error && students.length > 0 && (
                    <div className="px-6 border-t border-gray-200 flex items-center justify-between">
                              <div className="text-sm text-gray-700">
                                Page {page} of {totalRecords > 0 ? Math.ceil(totalRecords / rows) : 1}
                              </div>
                              <div className="w-fit"><Paginator first={(page - 1) * rows} rows={rows} totalRecords={totalRecords} rowsPerPageOptions={[10, 15, 20, 50]} onPageChange={onPageChange} />
                            </div></div>
                )}
            </div>
            
            {/* --- Modals --- */}
            {(add || edit) && (
                <AddStudent
                    close={edit ? setEdit : setAdd}
                    edit={edit}
                    fetch={fetchStudents}
                />
            )}
            {assign && (
                <AssignForm
                    close={setAssign}
                    assign={assign}
                    reassign={reassign}
                    fetchPrograms={fetchStudents}
                />
            )}
            {view && (
                <ParticipantsCard
                    participants={view.participants}
                    close={setView}
                    program={view.program}
                    fetchPrograms={fetchStudents}
                />
            )}
        </>
    );
}

export default StudentsContent;