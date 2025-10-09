import React from 'react'
import AdminLayout from '../../../components/layout/AdminLayout'
import Content from './Content'
export const dynamic = "force-dynamic"

function page() {
  return (
    <AdminLayout active="congif">
      <Content/>
    </AdminLayout>
  )
}

export default page
