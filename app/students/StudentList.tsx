"use client";;
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { MdOutlineAddCircle } from 'react-icons/md';
import AddStudent from '../../components/common/AddStudent';
import { LuFileEdit } from 'react-icons/lu';
import { getStudentsByteamId } from '../campus/func';
import DeleteItem from './Delete';
import { AnimatedCircularProgressBar } from '../../components/ui/AnimatedCircularProgressBar';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { FaCheckCircle } from 'react-icons/fa';
import { IoSearchOutline } from 'react-icons/io5';

function StudentList() {
  const [cookies] = useCookies(["access"]);
    const [role] = useState(cookies?.access?.role);
    const {jamiaNo} = cookies?.access||'';
    const [students, setStudents] = useState<any>(null);
    const [edit, setEdit] = useState<any>(null);
    const [add, setAdd] = useState<any>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(15);
    const [searchQuery, setSearchQuery] = useState<string>("");
  const [strength, setStrength] = useState<any>();
  const [loading, setLoading] = useState<any>(false);
  

  // const fetchAllStudents = async () => {
  //   try {
  //       const StudentsData = await getStudentsByGroupId(cookies.access?.groupId);
  //     if(StudentsData){
  //       setData(StudentsData?.data)
  //       setTotal(StudentsData?.total)
  //       setStrength(cookies.access?.strength)
  //     }
  //   } catch (error) {
  //     console.error("Error fetching courses:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchAllStudents()
  // }, [add]);


  const [value, setValue] = useState(0);
 
  useEffect(() => {
    const handleIncrement = (prev: number) => {
      if (prev >= totalRecords) {
        return prev;
      }else{
        const count = totalRecords/10;
        return prev + count;
      }
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 800);
    return () => clearInterval(interval);
  }, [totalRecords]);

  const fetchStudents = async () => {
      setLoading(true);
    
      // Construct the query parameters
      const query = new URLSearchParams({
        page: page.toString(),
        limit: rows.toString(),
        search: searchQuery || "",
      }).toString();
  console.log(cookies.access?.groupId);
  
      // try {
      //   let StudentsData;
        
      //     StudentsData = await getStudentsByteamId(cookies.access?.teamId,query);
      //     console.log(StudentsData);
        
    
      //   if (StudentsData?.success) {
      //     setStudents(StudentsData.data || []);
      //     setTotalRecords(StudentsData.total);
      //     setStrength(cookies.access?.strength)
      //   } else {
      //     resetData();
      //   }
      // } catch (error) {
      //   console.error("Error fetching campuses:", error);
      //   resetData();
      // } finally {
      //   setLoading(false);
      // }
    };
    
  
    const resetData = () => {
      setStudents([]);
      setTotalRecords(0);
    };
  
    const onPageChange = (e: PaginatorPageChangeEvent) => {
      setPage(e.page + 1);
      setRows(e.rows);
    };
  
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setPage(1);
        fetchStudents();
      }
    };
  
    useEffect(() => {
      fetchStudents();
    }, [page, rows]);

  return (
    <div className=" w-full relative grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className='col-span-3'>
      
      <div className='abq-card'>
      <div className="text-lg z-[2] -m-6 font-semibold flex bg-gradient-to-r text-white from-blue-500 to-purple-400 items-center px-5 py-3 rounded-t-xl justify-between">
                  <h6 className="flex items-center"><FaCheckCircle className="mr-2 text-lg text-yellow-200" />
                  Students List</h6> 
                  <p className="text-xl font-bold text-yellow-100">
                  {totalRecords}
                    <b className="text-white font-normal text-lg ml-2"></b>
                  </p><div className="p-[6px] px-4 bg-transparent rounded-xl flex items-center border gap-3 md:w-60">
                                                            <input
                                                                id="search-input"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                onKeyDown={handleSearchKeyDown}
                                                                className="outline-none border-none w-full bg-transparent placeholder:text-white"
                                                                type="search"
                                                                placeholder="Search"
                                                            />
                                                            <div>
                                                                <IoSearchOutline className="text-xl" />
                                                            </div>
                                                        </div>
                  
                </div>

      {students&&totalRecords ? (
          <><section className="my-2  mt-8"><div className="bg-white rounded-xl mt-2">
              <table className="table">
                <tbody>
                  {students.map((student:any, index:number) => (
                    <React.Fragment key={index}>
                    <tr
                      key={student.jamiaNo}
                      className=""
                    >
                      <th><span className="w-7 h-7 flex items-center justify-center bg-violet-50 rounded-lg text-violet-600 mr-2">{student.category=="minor"?"M":student.category=="premier"?"P":student.category=="subJunior"?"SJ"
                        :student.category=="junior"?"J":student.category=="senior"?"S":""}</span></th>
                      <td className="md:w-50 text-left">{student.name.toUpperCase()}</td>
                      <td className="font-bold ">{student.jamiaNo.toUpperCase()}</td>
                      <td className="flex gap-3 items-center justify-end">
                      <div className=" text-lg font-bold flex justify-end gap-2">
               {jamiaNo && jamiaNo =='JMI001'&& <><div className="text-blue-500 bg-blue-50 rounded-md p-2"><LuFileEdit 
                  className="text-lg cursor-pointer"
                  onClick={() => setEdit(student)}
                /></div>
                <DeleteItem id={student.id} fetchAllStudents={fetchStudents}/></>}
              </div>
                      </td>
                    </tr></React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {totalRecords >  15 && <div className="col-span-3">
                          <Paginator
                             first={(page - 1) * rows}
                             rows={rows}
                             totalRecords={totalRecords}
                             rowsPerPageOptions={[15, 20,30]}
                             onPageChange={onPageChange}
                         />
                     </div>}</>
        ) : (
        <div className="text-xl font-semibold text-center py-10 mt-14">No students</div>
      )}
</div>
      {/* {jamiaNo && jamiaNo =='JMI001'&&<button
        className="shadow-xl fixed bottom-[5%] z-20 right-[10%] md:bottom-20 md:right-20 bg-gradient-to-r from-violet-400 to-violet-600 py-3 pl-4 pr-5 rounded-xl text-white font-bold flex items-center gap-2"
        onClick={() => {
          setAdd(true);
        }}
      >
        <MdOutlineAddCircle className="text-2xl" />
        Add <span className="hidden md:block">Student</span>
      </button>}
      {(add || edit) && (
        <AddStudent close={edit ? setEdit : setAdd} edit={edit} fetch={fetchStudents}/>
      )} */}

      {/* {deleteItem && (
        <DeleteItem
          close={setDeleteItem}
          {...deleteItem}
          collectionName="students"
        />
      )} */}
    </div><div className='col-span-2'>
    
    <div className="rounded-2xl bg-white p-3 px-7 w-full mb-4 abq-card">
        <div className="font-semibold flex items-center justify-between w-full">
          Performance
          <span className="font-bold">
            {strength && totalRecords + "/" + strength}
          </span>
        </div>
        <div className="flex justify-center gap-10 w-full rounded-2xl mt-3">
        <AnimatedCircularProgressBar
      max={(totalRecords / strength) * 100}
      min={0}
      value={value}
      gaugePrimaryColor="rgb(139, 92, 246)"
      gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
    />
    <AnimatedCircularProgressBar
      max={(totalRecords / strength) * 270}
      min={0}
      value={value}
      gaugePrimaryColor="rgb(79 70 229)"
      gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      // className='duration-500 delay-200'
    />
    
        </div>
      </div></div></div>
  )
}

export default StudentList
