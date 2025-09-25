import React, { useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md';
import DeleteItem from './Delete';
import IconInfoHexagon from '../../components/icon/icon-info-hexagon';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useCookies } from 'react-cookie';
import { getStudentsByteamId } from './func';

function Students({id}:{id:any}) {
    
    const [cookies] = useCookies(["access"]);
      const [role] = useState(cookies?.access?.role);
      const [students, setStudents] = useState<any>(null);
      const [totalRecords, setTotalRecords] = useState<number>(0);
      const [page, setPage] = useState<number>(1);
      const [rows, setRows] = useState<number>(10);
      const [searchQuery, setSearchQuery] = useState<string>("");
      const [loading, setLoading] = useState<boolean>(false);
    
    
      const fetchStudents = async () => {
        setLoading(true);
      
        const query = new URLSearchParams({
          page: page.toString(),
          limit: rows.toString(),
          search: searchQuery || "",
        }).toString();
      
        try {
                let response;
                if(id){
                  response = await getStudentsByteamId(id,query);
                }
                console.log(response);
                
                setStudents(response.data);
                setTotalRecords(response.total)
              } catch (error) {
                console.error("Error fetching students:", error);
              }
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
      }, [page, rows,id]);

      console.log("students",students);
      
  return (
    <div className="abq-card-p">
          
            <div className="z-[2] font-semibold flex bg-zinc-100 items-center px-5 py-3 rounded-t-xl justify-between">
              <h6 className="flex items-center">Students List</h6>
            </div>
            {students && totalRecords > 0 ? (
              <div className="w-full justify-center flex flex-col ">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>JamiaNo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((std: any, index: number) => (
                      <React.Fragment key={index}>
                        <tr key={std.jamiaNo}>
                            <td className="md:w-50 text-left">
                              {std.name.toUpperCase()}
                            </td>
                            <td className="font-bold">
                              {std.jamiaNo.toUpperCase()}
                            </td>
                            <td className="flex gap-3 items-center justify-end">
                              <div className="text-white bg-gradient-to-tr from-red-400 to-red-500 p-2 rounded-lg bg-red-50">
                                <MdDeleteOutline
                                  className="cursor-pointer text-xl"
                                  onClick={() => DeleteItem(std)}
                                />
                              </div>
                            </td>
                          </tr>
                       
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {totalRecords > 10 && (
                              <div className="abq-card-p">
                                <Paginator
                                  first={(page - 1) * rows}
                                  rows={rows}
                                  totalRecords={totalRecords}
                                  rowsPerPageOptions={[10, 20, 30]}
                                  onPageChange={onPageChange}
                                />
                              </div>
                            )}
              </div>
            ) : (
              <div className="flex gap-5 w-full items-center justify-center flex-col p-10">
                <div className="p-5 rounded-full bg-red-50 text-red-600">
                  <IconInfoHexagon size="50" />
                </div>
                Select {role=="campusAdmin"?"Group":"Campus"}
              </div>
            )}
          </div>
  )
}

export default Students
