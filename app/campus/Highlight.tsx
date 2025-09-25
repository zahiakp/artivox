import React from 'react'
import { BiSolidInstitution } from 'react-icons/bi';
import { HiUserGroup } from 'react-icons/hi';
import { TbClipboardList } from 'react-icons/tb';
import LDRloader from '../../components/common/LDRloader';
import { FaSchool } from 'react-icons/fa';

function CHighlight({ data,role }: { data: any,role:any }) {
  console.log(data);
  
  return (<>
  {data == "loading" ? <div className='bg-primary-50 border w-full h-20 flex border-primary-100 rounded-lg'>
<LDRloader/>
  </div> :
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
        {data && data.length > 0 ? data.map((item:any, index:number) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <div className="p-4 rounded-xl bg-primary-50 text-2xl text-primary-500 h-fit"><FaSchool/></div>
              <div>
                <p className="text-sm font-medium text-gray-600">{item.value}</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">{item.count?item.count:0}+</p>
              </div>
              <div className={`p-3 bg-${item.color}-100 text-lg text-${item.color}-500  rounded-full`}>
                {item.icon}
              </div>
            </div>
          </div>  
        )):""}
        </div>}</>
  )
}

export default CHighlight
