import React from "react";
import RegistrationList from "./RegistrationList";
import { getProgramsbyStatus, getProgramsbyStatuswithCategoryBased } from "../programs/func";
import AdminLayout from "../../components/layout/AdminLayout";
export const dynamic = "force-dynamic";

async function page() {
  

  return (
    <AdminLayout active="registration">
    <RegistrationList/>
    </AdminLayout>
  );
}

export default page;
