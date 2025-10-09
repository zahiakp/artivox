import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { RxLetterCaseCapitalize } from 'react-icons/rx';

function page() {
    const Items = [
        { icon : <RxLetterCaseCapitalize />,name: 'Code Letter', href: '/codeletter' },
        // { icon : <RxLetterCaseCapitalize />,name: 'Reset Program', href: '/reset' },
        // { icon : <RxLetterCaseCapitalize />,name: 'Reverse', href: '/reverse' },
    ]
  return (
    <AdminLayout active="config">
      <div className="py-5 w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Items.map((item, i) => (
          <a
            key={i}
            href={`/config${item.href}`}
            className="flex items-center justify-start gap-3 bg-white font-semibold p-6 border hover:shadow-md hover:-translate-y-1 duration-200 border-gray-200 rounded-xl text-gray-700"
          >
            <span className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary-50 text-primary-500 text-xl">
              {item.icon}
            </span>
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </AdminLayout>
  );
}

export default page
