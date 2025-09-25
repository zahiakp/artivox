import React from "react";
import dynamic from "next/dynamic";
import AdminLayout from "../../components/layout/AdminLayout";

const ProgramList = dynamic(() => import("./ProgramList"), {
  ssr: false,
});

function page() {

  return (
    <AdminLayout active="programs">
    <ProgramList/>
    </AdminLayout>
  );
}

export default page;
