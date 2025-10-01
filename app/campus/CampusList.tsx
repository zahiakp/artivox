"use client";;
import React, { useEffect, useState } from "react";
import AddCampus from "../../components/common/AddCampus";
import DeleteItem from "./Delete";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import LDRloader from "../../components/common/LDRloader";
import { useCookies } from "react-cookie";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import CHighlight from "./Highlight";
import SearchBar from "./SearchBar";
import { FaUsers } from "react-icons/fa";
import IconNotesEdit from "../../components/icon/icon-notes-edit";
import { getCampuseswithPagination } from "./func";
import { SideBar } from "./SideBar";
import { brandName } from "../data/branding";

function CampusList() {
  const [cookies] = useCookies([`${brandName}-access`]);
  const [role] = useState(cookies[`${brandName}-access`]?.role);
  const [students, setStudents] = useState<any>(null);
  const [campuses, setCampuses] = useState<any>("loading");
  const [overView, setOverView] = useState<any>("loading");
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState();
  const [details, setDetails] = useState<any>(null);

  // const fetchAllStudents = async (id: any) => {
  //   console.log(id);
    
  //   try {
  //     let response;
  //     if(role=="campusAdmin"){
  //       response = await getStudentsByGroupId(id);
  //     }else{
  //       const response = await getStudentsByCampusId(id);
  //     }
  //     setStudents(response.data);
  //   } catch (error) {
  //     console.error("Error fetching students:", error);
  //   }
  // };

  const fetchCampuses = async () => {
    setLoading(true);
  
    // Construct the query parameters
    const query = new URLSearchParams({
      page: page.toString(),
      limit: rows.toString(),
      search: searchQuery || "",
    }).toString();
  
    let endpoint = "";
    let fetchData;
  
    // Determine endpoint and fetch logic based on role
    switch (role) {
      case "admin":
        endpoint = "campus";
        fetchData = () => getCampuseswithPagination(query);
        break;
      default:
        console.error("Invalid role provided:", role);
        resetData();
        setLoading(false);
        return;
    }
  
    try {
      const data = await fetchData();
  
      if (data?.success) {
        setOverView(data.overview || []);
        setCampuses(data.data || []);
        setTotalRecords(data.pagination?.total || data.total || 0);
      } else {
        resetData();
      }
    } catch (error) {
      console.error("Error fetching campuses:", error);
      resetData();
    } finally {
      setLoading(false);
    }
  };
  

  const resetData = () => {
    setOverView([]);
    setCampuses([]);
    setTotalRecords(0);
  };

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setPage(e.page + 1);
    setRows(e.rows);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchCampuses();
    }
  };
  useEffect(() => {
    fetchCampuses();
  }, [page, rows]);

  return (<main className="space-y-6">
   <CHighlight data={overView} role={role}/>
   <SearchBar totalRecords={totalRecords} setAdd={setAdd} handleSearchKeyDown={handleSearchKeyDown} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
    <main className="w-full relative">
      
       
        {campuses === " loading" ? (
          <div className="w-full h-40 bg-primary-50 border border-primary-200 rounded-xl"><LDRloader /></div>
        ) : campuses && totalRecords > 0 ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
           {campuses.map((team:any,index:number) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold line-clamp-2 md:line-clamp-1 text-gray-900">{team.name}</h3>
                    <p className="text-xs text-gray-500">{team.jamiaNo}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 bg-green-100 text-green-800 flex gap-2 text-xs rounded-full`}>{team.student_count}<FaUsers /></span>
              </div>
              {/* <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Groups:</span>
                  <span className="font-medium">{team.groups}</span>
                </div>
              </div> */}
              <div className="flex space-x-2">
                <button onClick={()=>setDetails(team)} className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                  View Details
                </button>
                <div
                                className="text-blue-600 bg-blue-50 rounded-md p-2"
                                onClick={() => setEdit(team)}
                              >
                                <IconNotesEdit className="text-lg cursor-pointer" />
                              </div>
                              <DeleteItem
                      id={team}
                      fetchCampuses={fetchCampuses}
                      root={role === "admin" ? "campuses" :role === "zoneAdmin"? "zonecampuses":"groups"}
                    />
              </div>
            </div>
          </div>
          ))}</div>
          {totalRecords > 10 && (
              <div className="rounded-lg border border-gray-200">
                <Paginator
                  first={(page - 1) * rows}
                  rows={rows}
                  totalRecords={totalRecords}
                  rowsPerPageOptions={[12, 18, 24]}
                  onPageChange={onPageChange}
                />
              </div>
            )}</>
        ) : (
          <div className="flex gap-5 w-full items-center justify-center flex-col p-10">
            <div className="p-5 rounded-full bg-red-50 text-red-600">
              <IconInfoHexagon size="50" />
            </div>
            No Data found
          </div>
        )}
      
      {/* <button
        className="shadow-xl fixed bottom-[5%] z-20 right-[10%] md:bottom-20 md:right-20 bg-gradient-to-r from-primary-400 to-primary-600 py-3 pl-4 pr-5 rounded-xl text-white font-bold flex items-center gap-2"
        onClick={() => setAdd(true)}
      >
        <MdOutlineAddCircle className="text-2xl" />
        Add <span className="hidden md:block">{role=="campusAdmin"?"Group":"Campus"}</span>
      </button> */}
      {(add || edit) && <AddCampus
      close={edit ? setEdit : setAdd}
      edit={edit}
      fetchCampuses={fetchCampuses}
    />}
      {/* <div className="col-span-2 ">
        <div className="grid gap-5">
        <div className="p-2 px-4 bg-white rounded-xl flex items-center border gap-3 w-full">
          <input
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="outline-none border-none w-full"
            type="search"
            placeholder="Search"
          />
          <div>
            <IoSearchOutline className="text-xl" />
          </div>
        </div>
        <Overview data={overView} role={role}/>
        <Students id={students}/>
        </div>
      </div> */}
    </main>
    <SideBar setVisibleRight={setDetails} visibleRight={details} data={details} />
    </main>
  );
}

export default CampusList;
