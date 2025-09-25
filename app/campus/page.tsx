import dynamic from "next/dynamic";
import AdminLayout from "../../components/layout/AdminLayout";
import CHighlight from "./Highlight";

const CampusList = dynamic(() => import("./CampusList"), { ssr: false });

async function page() {
  return (
    <AdminLayout active="campus">
      
      <CampusList />
    </AdminLayout>
  );
}

export default page;
