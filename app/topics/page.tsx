import dynamic from "next/dynamic";
import AdminLayout from "../../components/layout/AdminLayout";
const TopicList = dynamic(() => import("./TopicList"), { ssr: false });

async function page() {


  return (
    <AdminLayout active="topics">
   <TopicList/> 
   </AdminLayout>
  );
}

export default page;
