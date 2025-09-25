'use client';
import { useState } from 'react';
import { Sidebar } from "primereact/sidebar";
import { HiCheckCircle, HiOutlineEye, HiOutlineEyeOff} from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import LDRloader from '../../components/common/LDRloader';
import { FaUsers } from 'react-icons/fa';
import Categories from '../../components/Home/Categories';



export function SideBar({visibleRight,setVisibleRight,data}:{visibleRight:any,setVisibleRight:any,data:any}) {
    const router = useRouter();
      const [loading, setLoading] = useState(false);
      const [username, setUsername] = useState(false);
      const [password, setPassword] = useState(false);
    ;
  console.log("data", data);
  
  return (
    <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} className='prime-sidebar'>
        {loading ? <LDRloader /> :   
        <div className='flex flex-col gap-5 p-10 font-sora w-full'>
          {data && <div className="flex flex-col items-start justify-between mb-4">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                              </svg>
                            </div>
                            <div className='text-center'>
                              <h3 className="font-semibold text-2xl text-gray-900">{data.name}</h3>
                              <p className="text-gray-500 mt-3">{data.jamiaNo} . <span className='text-green-700'>{data.student_count} Students</span></p>
                            </div>
                            <div className='flex gap-1'>
                              {data.categories.split(',').map((category: string, index: number) => (
                                <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs uppercase font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                                  {category.trim()}
                                  </span>))}
                            </div>
                            <div className='bg-primary-50/50 border border-primary-200 text-primary-700 rounded-lg p-5 py-3 w-full'>
                              <div className='flex items-center justify-between'>
                                <p>username</p>
                                <div className='cursor-pointer' onClick={()=>setUsername(!username)}>{username ?<HiOutlineEyeOff /> :<HiOutlineEye />
}</div>
                              </div>
<div className='bg-primary-100 mt-1 p-1 rounded-md px-4'>{username?<p>{data.jamiaNo}</p>:<p>••••••••</p>}</div>
                              <div className='flex items-center my-2 justify-between'>
                                <p>password</p>
                                <div className='cursor-pointer' onClick={()=>setPassword(!password)}>{password ?<HiOutlineEyeOff /> :<HiOutlineEye />
}</div>
                              </div>
<div className='bg-primary-100 mt-1 p-1 rounded-md px-4'>{password?<p>{data.password}</p>:<p>••••••••</p>}</div>
                             
                            </div>
                          </div>
                        </div>}</div>}
            </Sidebar>
  )
}



export function SingleCell({label,data}:{label:any,data:any}) {
  return(
    <div className="flex items-center flex-wrap">
                      <HiCheckCircle className="text-green-500 mr-2 text-xl" />
                      <span className="font-semibold">{label}:</span>
                      <span className="ml-2">{data}</span>
                    </div>
  )
}