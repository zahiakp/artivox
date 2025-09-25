import AdminLayout from "../../components/layout/AdminLayout";
import { getProgramsbyStatus } from "../programs/func";
import AnnounceList from "./AnnounceList";
export const dynamic = "force-dynamic";

async function page() {
  return (
    <AdminLayout active="announcement">
    <AnnounceList />
    </AdminLayout>
  );
}

export default page;
