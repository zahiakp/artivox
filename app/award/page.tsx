import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import dynamic from 'next/dynamic'
const AwardList = dynamic(()=>import("./AwardList"),{ssr:false})

function page() {
  return (
    <AdminLayout active="award">
      <AwardList/>
    </AdminLayout>
  )
}

export default page
