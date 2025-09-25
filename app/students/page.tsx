import React from "react";
import StudentList from "./StudentList";
import AdminLayout from "../../components/layout/AdminLayout";
import dynamic from "next/dynamic";
const StudentsContent = dynamic(() => import("./Content"), { ssr: false })

function page() {
  return (
    <AdminLayout active="students">
      <StudentsContent/>
  {/* <StudentList/> */}
  </AdminLayout>
);
}

export default page;
