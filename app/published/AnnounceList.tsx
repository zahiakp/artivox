"use client";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaVolumeUp } from "react-icons/fa";
import { FcRating } from "react-icons/fc";
import { useCookies } from "react-cookie";
import { IoIosArrowDown } from "react-icons/io";
import GetResult from "../../components/common/GetResult";
import Confirm from "../../components/common/Confirm";
import { FaListCheck } from "react-icons/fa6";
import { RiLoader3Fill } from "react-icons/ri";
import { MdGroups2 } from "react-icons/md";
import { IoPerson, IoSearchOutline } from "react-icons/io5";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";
import IconSend from "../../components/icon/icon-send";
import IconAward from "../../components/icon/icon-award";
import IconVideo from "../../components/icon/icon-video";
import IconShare from "../../components/icon/icon-share";
import ResultCard from "../../components/common/ResultCard";
import IconMaximizeSquare from "../../components/icon/icon-maximize-square";
import { HiOutlineClipboardList } from "react-icons/hi";
import { LuSchool } from "react-icons/lu";
import { BiUserCircle } from "react-icons/bi";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import {
  getProgramsbyStatusandPagination,
  getProgramswithPagination,
} from "../programs/func";
import { generatePDF } from "./GenaratePdf";
import IconDownload2 from "../../components/icon/icon-download2";
import { CiMenuKebab } from "react-icons/ci";
import { ProResult } from "../judgement/func";

function AnnounceList() {
  // const [data, setData] = useState([]);
  const [participants, setParticipants] = useState();
  const [cookies] = useCookies(["access"]);
  const [role, setRole] = useState(cookies?.access?.role);
  const [drop, setDrop] = useState<any>();
  const [confirm, setConfirm] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("minor");
  const resultEndpoint =
    role === "admin" || role === "announce"
      ? "results"
      : role === "zoneAdmin" || role === "zonecampus"
      ? "zoneresults"
      : role === "campusAdmin" || role === "Group"
      ? "campusresults"
      : "";

  const fetchResultbyProgam = async (program: any) => {
    try {
      const response = await ProResult(program.id, resultEndpoint);

      if (response.success) {
        setDrop({
          program: program,
          result: response.data.sort((a: any, b: any) => a.rank - b.rank),
        });
      } else {
        console.error("No result returned");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };
  const TAb_NAV = [
    {
      label: "Program Results",
      path: "programs",
      icon: <HiOutlineClipboardList />,
    },
    { label: "Campus Points", path: "campus", icon: <LuSchool /> },
    { label: "Indivitual Points", path: "single", icon: <BiUserCircle /> },
  ];

  // ------------------pagination-------------

  const [userRole, setUserRole] = useState(cookies?.access?.role);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(18);
  const [first, setFirst] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [datas, setDatas] = useState<any>();
  const [list,setList] = useState(false);
  const fetchPrograms = async () => {
              setLoading(true);
              const query = new URLSearchParams({
                  page: page.toString(),
                  limit: rows.toString(),
                  search: searchQuery || '',
              }).toString();
          
              try {
                  const role = cookies?.access?.role;
                  const endpoint = (role === "admin" || role === "announce") ? "programs" : (role === "zoneAdmin" || role === "zonecampus") ? "zoneprograms" :(role === "campusAdmin" || role === "Group") ? "campusprograms" : "";
          
                  let Programs;
                        
                          Programs = await getProgramsbyStatusandPagination(
                            "announced",
                            query,
                            endpoint
                          );
                        
                  
          
                  if (Programs) {
                      setDatas(Programs.data || []);
                      setTotalRecords(Programs.total || 0);
                  } else {
                      console.error("No programs returned");
                  }
              } catch (error) {
                  console.error("Error fetching programs:", error);
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
  // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = e.target.value;
  //   setSelectedCategory(value);
  //   setFirst(0); // Reset pagination when changing category
  // };

  useEffect(() => {
    fetchPrograms();
  }, [page, rows]);

  const CAT_NAV = [
    { label: "Minor", value: "minor" },
    { label: "Premier", value: "premier" },
    { label: "Sub Junior", value: "subJunior" },
    { label: "Junior", value: "junior" },
  ];
const handleDownload = async (program:any) => {
    const endpoint = (userRole === "admin" || userRole === "announce") ? "participants" : (userRole === "zoneAdmin" || userRole === "zonecampus") ? "zoneparticipants" : "";
    try {
      
      const result = await ProResult(program.id, resultEndpoint);
      if (result) {
        console.log(result?.data);
        
        const pdfBlob = generatePDF(result?.data,program);

  // Create a URL for the Blob and download
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${`Result-${program.order&&program.order}_`+program.category.toUpperCase()+"_"+program.name.toUpperCase()}.pdf`;
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
      } else {
        console.error("No programs returned");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };
  return (
    <div className=" w-full mt-5 mb-24 my-5 md:my-20 md:px-[5%]">
      
      {<section className="abq-card">
            <div className="text-lg z-[2] -m-6 font-semibold flex bg-gradient-to-r text-white from-blue-500 to-purple-400 items-center px-5 py-2 rounded-t-xl justify-between">
              <h6 className="flex items-center">
                <FaCheckCircle className="mr-2 text-lg text-yellow-200" />
                Announced Programs
              </h6>
              <div className="p-[6px] px-4 bg-transparent rounded-xl flex items-center border gap-3 md:w-80">
                                                        <input
                                                            id="search-input"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            onKeyDown={handleSearchKeyDown}
                                                            className="outline-none border-none w-full placeholder:text-white bg-transparent"
                                                            type="search"
                                                            placeholder="Search"
                                                        />
                                                        <div>
                                                            <IoSearchOutline className="text-xl" />
                                                        </div>
                                                    </div>
              <p className="text-xl font-bold text-yellow-100">
                {totalRecords}
                <b className="text-white font-normal text-lg ml-2">Programs</b>
              </p>
            </div>
            {totalRecords > 0 ? (
              <><table className="table mt-8">
                <tbody>
                  {datas
                    .sort((a: any, b: any) => b.order - a.order)
                    .map((program: any, index: number) => (
                      <tr
                        className="hover:bg-gray-100 duration-300 rounded-lg"
                        key={program.id}
                      >
                        <th className="">{program.order && program.order}</th>
                        <td className="font-bold">{program?.name}</td>
                        <td className="uppercase">{program.category}</td>

                        <td className="flex items-center gap-3">
                          <button
                            onClick={() => fetchResultbyProgam(program)}
                            className="p-2 rounded-xl gap-2 px-3 pr-4 text-white flex bg-gradient-to-r from-green-500 to-primary-600"
                          >
                            <IconMaximizeSquare size="18" /> Result
                          </button>
                          <a
                          className="rounded-lg bg-gradient-to-r text-white from-red-400 to-red-500 p-[7px] cursor-pointer"
                          onClick={()=>handleDownload(program)}
                        >
                          <IconDownload2/>
                        </a>
                        
                        </td>
                      </tr>
                    ))}
                </tbody>
                
              </table>
              {totalRecords >  15 && <div className="abq-card-p col-span-3">
                <Paginator
                   first={(page - 1) * rows}
                   rows={rows}
                   totalRecords={totalRecords}
                   rowsPerPageOptions={[15, 20,30]}
                   onPageChange={onPageChange}
               />
           </div>}</>
            ) : (
              <div className="flex gap-5 w-full items-center justify-center flex-col p-10">
                <div className="p-5 rounded-full bg-red-50 text-red-600">
                  <IconInfoHexagon size="50" />
                </div>
                No Programs{" "}
              </div>
            )}
          </section>
      }
      {confirm && <Confirm {...confirm} close={setConfirm} fetch={fetchPrograms}/>}
      {drop && <ResultCard data={drop} close={setDrop} />}
    </div>
  );
}

export default AnnounceList;
