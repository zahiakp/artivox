"use client";;
import React, { useEffect, useState } from "react";
import PrintPrograms from "../../components/common/PrintPrograms";
import { MdMicExternalOn } from "react-icons/md";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BsPersonFill } from "react-icons/bs";
import AddPrograms from "../../components/common/AddPrograms";
import AssignForm from "../../components/common/AssignForm";
import { useCookies } from "react-cookie";
import { RiPenNibFill } from "react-icons/ri";
import DeleteItem from "./Delete";
import IconLayoutGrid from "../../components/icon/icon-layout-grid";
import IconListCheck from "../../components/icon/icon-list-check";
import {
  getParticipantsbyProgram,
  getParticipantsbyProgramwithTeamId,
  getProgramsbyCategorywithTeamId,
  getProgramswithPagination,
  ImportProgram,
} from "./func";
import ParticipantsCard from "../../components/common/ParticipantsCard";
import IconMaximizeSquare from "../../components/icon/icon-maximize-square";
import IconNotesEdit from "../../components/icon/icon-notes-edit";
import IconDownload2 from "../../components/icon/icon-download2";
import { generatePDF } from "../../components/common/GenaratePdf";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { IoSearchOutline } from "react-icons/io5";
import { showMessage } from "../../components/common/CusToast";
import { getStudentsByTeamIdwithCategory } from "../students/func";
import Overview from "./Highlight";
import SearchBar from "./SearchBar";
import { getFirstLastInitials } from "../../components/common/NameShorter";
import LDRloader from "../../components/common/LDRloader";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import CategoryBased from "./CatBased";
import { brandName, categoryMap } from "../data/branding";

function ProgramList() {
  const [add, setAdd] = useState(false);
  const [programs, setPrograms] = useState<any>([]);
  const [edit, setEdit] = useState<any>();
  const [assign, setAssign] = useState<any>();
  const [reassign, setReassign] = useState<any>();
  const [students, setStudents] = useState<any>([]);
  const [cookies,setCookie] = useCookies([`${brandName}-access`,'']);
  const { role: Role, campusId: campus } = cookies[`${brandName}-access`] || {};
  const [userRole, setUserRole] = useState(cookies[`${brandName}-access`]?.role);
  const [view, setView] = useState<any>();
  const [campuses, setTeames] = useState<any>([]);
  const [programList, setProgramList] = useState([]);
  const [table, setTable] = useState(false);

  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(15);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading,setDownloading] = useState<any>(null)
  const proEndpoint = "programs";
  const partEndpoint ="participants";

  const { role, categories } = cookies[`${brandName}-access`] || {};

      const fetchStudents = async () => {
        setLoading(true);
    
        try {
      
              let studentsData = null;

             
                  // Fetch students by campus for each category
                  const studentsPromises = categories.map(async (item: any) => {
                      const categoryData = await getStudentsByTeamIdwithCategory(campus, item.id);
              
                      if (categoryData.success) {
                          console.log(`${item.id} students fetched successfully`);
                          // Store the students data in localStorage
                          localStorage.setItem(item.id.toLowerCase(), JSON.stringify(
                              categoryData.data[0].students.map((student: any) => ({
                                  jamiaNo: student.teamId,
                                  name: student.name,
                              }))
                          ));
                          return categoryData.data[0].students; // Return the fetched student data
                      } else {
                          console.log(`Error fetching students for category ${item.id}`);
                          return []; // Return an empty array in case of failure
                      }
                  });
              
                  // Await all student fetching promises
                  const studentsResults = await Promise.all(studentsPromises);
              
                  // Flatten the results into one array
                  studentsData = studentsResults.flat();
            
              
              console.log("Final Students Data:", studentsData);
              
      } catch (error) {
          console.error("Error fetching students data:", error);
      } finally {
          setLoading(false);
      }
      
      };
      useEffect(() => {
        fetchStudents();
      }, [page, rows]);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      const query = new URLSearchParams({
        page: page.toString(),
        limit: rows.toString(),
        search: searchQuery || "",
      }).toString();

      // Fetch programs based on role
      const Programs = await fetchProgramsByRole(
        userRole,
        cookies,
        query,
        proEndpoint
      );
      // Update state based on response
      if (Programs) {
        
        setProgramList(Programs.data || null);
        setTotalRecords(Programs.total || 0);
      } else {
        console.error("No programs returned");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setError("Failed to fetch programs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
const [status, setStatus] = useState<any>(Role=="campus"? categories?.split(",")[0] :"all");
const allProgramsOption = { label: "All Programs", value: "all" };
const categoryOptions = Object.entries(categoryMap).map(([key, label]) => ({
  label: label,
  value: key
}));
const statusOptions = [allProgramsOption, ...categoryOptions];

  // Helper function to fetch programs based on user role
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
        const categoryIds = cookies[`${brandName}-access`].categories.map((cat: any) => cat.id);
        return await getProgramsbyCategorywithTeamId(
          categoryIds,
          campus,
          query,
          endpoint
        );

      default:
        console.error("Unsupported user role:", role);
        return null;
    }
  };

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setPage(e.page + 1);
    setRows(e.rows);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchPrograms();
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [page, rows]);

  const ImportPrograms = async () => {
    let ImportedProgram;
    try {
      ImportedProgram = await ImportProgram(campCategoriesVal, campus);

      if (ImportedProgram) {
        showMessage("All programs Imported successfully", "success");
        fetchPrograms();
      } else {
        console.error("No programs returned");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };
  
  const fetchParticipants = async (program: any) => {
    let participant;
    try {
      if(Role === "campus"){
        participant = await getParticipantsbyProgramwithTeamId(
          program.id,
          campus,
          partEndpoint
        );
      } else {
        participant = await getParticipantsbyProgram(
          program.id
        );
      }
      
      

      if (participant) {
        setView({ participants: participant.data || [], program: program });
      } else {
        console.error("No programs returned");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };
  // ------------------pagination--------------------

  const handleDownload = async (program: any) => {
    // setDownloading(true);
    const endpoint = "participants";
    try {
      const participant = await getParticipantsbyProgramwithTeamId(
        program.id,
        campus,
        partEndpoint
      );
      if (participant) {
        console.log("participant",participant);
        console.log("program",program);
        
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
  const campCategories = cookies[`${brandName}-access`]?.categories
  const campCategoriesVal = cookies[`${brandName}-access`]?.categories
const statusTheme:any ={
  pending : "text-red-500",
  reporting : "text-primary-500",
  ongoing: "text-blue-500",
  finished:"text-green-500",
  judged:"text-violet-500",
  announced:"text-blue-500",
  awarded:"text-green-500",
  default : "text-gary-500"
  
}

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

        if (programList.length === 0) {
            return (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                    <h3 className="text-lg font-medium text-gray-900"><span className="font-bold">{totalRecords}</span> Program(s)</h3>
                    <div className="flex-grow max-w-md">
                        <div className="relative">
                            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                id="search-input"
                                 value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <p className="text-gray-500 text-sm">There are no programs available</p>
                </div>
            </div>
            );
        }

        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                      <h3 className="text-lg font-medium text-gray-900"><span className="font-bold">{totalRecords}</span> Program(s)</h3>
                                      <div className="p-[6px] px-4 rounded-lg flex items-center border border-gray-200 gap-3 w-1/3">
                                          <div className="cursor-pointer">
                                              <IoSearchOutline className="text-xl" />
                                          </div><input
                                              id="search-input"
                                              value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                                              className="outline-none border-none w-full"
                                              type="search"
                                              placeholder="Search"
                                          />
                                          
                                      </div><div className="flex items-center space-x-2">
                                          <span className="text-sm text-gray-500">Showing {(page - 1) * rows + 1}-{Math.min(page * rows, totalRecords)} of {totalRecords}</span>
                                      </div>
                                      
                                  </div>
                  
                                  <div className="overflow-x-auto">
                                      <table className="min-w-full divide-y divide-gray-200">
                                          <thead className="bg-gray-50">
                                              <tr>
                                                  <th className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                                  <th className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">type</th>
                                                  <th className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                  <th className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                  <th className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                              </tr>
                                          </thead>
                                          <tbody className="bg-white divide-y divide-gray-200">
                                              {programList.map((program: any) => (
                                                  <tr key={program.id}>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                          <div className="flex items-center">
                                                              <img
                                                                  src={`https://placehold.co/40x40/f7e6ff/7d00b3?text=${getFirstLastInitials(program.category) || "AV"}`}
                                                                  alt={program.name}
                                                                  className="w-10 h-10 rounded-lg object-cover"
                                                              />
                                                              <div className="ml-4">
                                                                  <p className="text-sm font-medium line-clamp-1 text-gray-900">{program.name}</p>
                                                                  <div className="text-[12px] text-gray-500">ID: #PRGM{program.id}</div>
                                                              </div>
                                                          </div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap uppercase text-sm text-gray-500"><div className="flex items-center gap-3">
                          {program.isStage == 1 ? (
                            <div className="flex items-center gap-7 p-[6px] bg-green-100 rounded-lg">
                              <MdMicExternalOn
                                title="Stage"
                                className="text-lg text-green-700 "
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-7 p-[6px] bg-primary-100 rounded-lg">
                              <RiPenNibFill
                                title="Off Stage"
                                className="text-lg text-primary-700"
                              />
                            </div>
                          )}

                          {program.isGroup == 1 ? (
                            <div className="flex items-center gap-7 p-[6px] bg-teal-100 rounded-lg">
                              <HiMiniUserGroup
                                title="Group Item"
                                className=" text-lgtext-teal-700"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-7 p-[6px] bg-purple-100 rounded-lg">
                              <BsPersonFill
                                title="Single Item"
                                className=" text-lg text-purple-700"
                              />
                            </div>
                          )}
                        </div></td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${statusTheme[program.status]} text-gray-500`}>{program.status}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500`}>{program.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm ">
                          <div className={`${program.participants==0?"text-red-600":"text-gray-500"} mt-2 font-bold rounded-lg flex`}>
                          {program.participants > 0 ? program.participants : "No"}
                          {userRole == "campus" ? (
                            <b className=" font-normal ml-2 line-clamp-1">
                              / {program.isGroup > 0 ? 1 : program.limit}{" "}
                              Participants{" "}
                              {program.isGroup == 1 && (
                                <span className="text-[14px]">
                                  ({program.limit} Mem.)
                                </span>
                              )}
                            </b>
                          ) : (
                            (userRole == "admin") && (
                              <b className=" font-normal ml-2 line-clamp-1">
                                Participants
                              </b>
                            )
                          )}
                        </div>
                        </td>
                                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                         <div className="flex items-center gap-2">
                                                          {program.participants > 0 &&
                          (userRole == "admin") ? (
                            <button disabled={downloading == program.id}
                              className="rounded-lg h-8 w-8 flex items-center justify-center disabled:grayscale bg-gradient-to-r text-white from-red-400 to-red-500 cursor-pointer"
                              onClick={() => {setDownloading(program.id); handleDownload(program)}}
                            >
                             {downloading == program.id ? <span className="text-lg">••</span> : <IconDownload2 />}
                            </button>
                          ) : (
                            <p className="w-10"></p>
                          )}
                          {program.participants > 0 ? (
                            <p
                              className="rounded-lg bg-gradient-to-r text-white from-violet-400 to-violet-500 p-[7px] cursor-pointer"
                              onClick={() =>
                                fetchParticipants(view !== program ? program : null)
                              }
                            >
                              <IconMaximizeSquare size="18" />
                            </p>
                          ) : (
                            <p className="w-10"></p>
                          )}
                          {userRole == "admin" ? (
                            <div className=" text-lg font-bold flex justify-end gap-1">
                              <div
                                className="text-blue-600 bg-blue-50 rounded-md p-2"
                                onClick={() => setEdit(program)}
                              >
                                <IconNotesEdit className="text-lg cursor-pointer" />
                              </div>
                              <DeleteItem
                                id={program.id}
                                root={proEndpoint}
                                fetchPrograms={fetchPrograms}
                              />
                            </div>
                          ) : (
                            
                            userRole == "campus" && (
                              <div
                                onClick={() => {
                                  if (program.participants > 0) {
                                    setAssign({
                                      ...program,
                                      participants:
                                        programList &&
                                        programList?.some(
                                          (list: any) =>
                                            list.program == program.id
                                        )
                                          ? [
                                              ...programList.filter(
                                                (list: any) =>
                                                  list.program == program.id
                                              ),
                                            ]
                                          : null,
                                    });
                                    setReassign(true); // Call setEdit() after setAssign
                                  } else {
                                    setAssign({
                                      ...program,
                                      participants:
                                        programList &&
                                        programList?.some(
                                          (list: any) =>
                                            list.program == program.id
                                        )
                                          ? [
                                              ...programList.filter(
                                                (list: any) =>
                                                  list.program == program.id
                                              ),
                                            ]
                                          : null,
                                    });
                                    setReassign(false);
                                  }
                                }}
                                className={`p-2 text-white rounded-lg cursor-pointer bg-gradient-to-tr shadow-lg ${
                                  program?.participants > 0
                                    ? "from-green-500 to-green-400"
                                    : "from-red-500 to-red-400"
                                }`}
                              >
                                {program?.participants > 0 ? (
                                  <IconListCheck />
                                ) : (
                                  <>
                                    <IconLayoutGrid />
                                  </>
                                )}
                              </div>
                            )
                          )}
                        </div>
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
    <>
    {/* <Overview/> */}

    {role =="admin"&& <SearchBar handleSearchKeyDown={handleSearchKeyDown} searchQuery={searchQuery} setAdd={setAdd} setSearchQuery={setSearchQuery}/>}
    <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {(role=="campus" ? statusOptions
                            .filter((option) => categories?.split(",").includes(option.value)) :
                            statusOptions)
                            .map((option) => (
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
    
    <div className=" w-full relative grid grid-cols-3 mt-6">
      <div className="col-span-3"> 
        {status === "all" && renderContent()}
        {status !== "all" && <CategoryBased category={status}/>}
            
            {(add || edit) && (
              <AddPrograms
                close={edit ? setEdit : setAdd}
                edit={edit}
                fetchPrograms={fetchPrograms}
                root={proEndpoint}
              />
            )}
            {assign && (
              <AssignForm
                close={setAssign}
                assign={assign}
                reassign={reassign}
                fetchPrograms={fetchPrograms}
              />
            )}
            {view && (
              <ParticipantsCard
                participants={view.participants}
                close={setView}
                program={view.program}
                fetchPrograms={fetchPrograms}
              />
            )}
        
      </div>
    </div></>
  );
}

export default ProgramList;
