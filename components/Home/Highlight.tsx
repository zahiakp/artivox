import React from 'react'
import { BiSolidInstitution } from 'react-icons/bi';
import { HiUserGroup } from 'react-icons/hi';
import { TbClipboardList } from 'react-icons/tb';

function Highlight() {
    const highlightData = [
        {
            title: "Total Participants",
            value: "2,847",
            icon: <HiUserGroup />,
            color: "blue",
        },
        {
            title: "Active Programs",
            value: "223",
            icon: <TbClipboardList />,
            color: "green",

        },
        {
            title: "Teams",
            value: "15",
            icon: <BiSolidInstitution />,
            color: "purple",
        },
        {
            title: "Result Announced",
            value: "134",
            icon: "M9",
            color: "orange",

        }
    ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {highlightData.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              </div>
              <div className={`p-3 bg-${item.color}-100 text-lg text-${item.color}-500  rounded-full`}>
                {item.icon}
              </div>
            </div>
          </div>  
        ))}
        </div>
  )
}

export default Highlight
