import React from 'react'
import AdminLayout from '../../../components/layout/AdminLayout'
import Reporting from './Reporting'
export const dynamic = "force-dynamic"

function page() {
  return (
    <AdminLayout active="config">
      <Reporting/>
    </AdminLayout>
  )
}

export default page
