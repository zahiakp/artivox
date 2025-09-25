import AdminLayout from "../../components/layout/AdminLayout";
import { getProgramsbyStatus } from "../programs/func";
import ResultList from "./ResultList";
export const dynamic = "force-dynamic";

async function page() {
  return (
    <AdminLayout active="results">
    <ResultList/>
   </AdminLayout>
  );
}

export default page;
