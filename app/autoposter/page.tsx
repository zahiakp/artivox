import dynamic from "next/dynamic";
import AdminLayout from "../../components/layout/AdminLayout";
import Overview from "../results/Overview";
const Content = dynamic(() => import("./PosterMaker"), { ssr: false });

async function page() {

  return ( <AdminLayout active="poster">
    {/* <Overview/> */}
    <Content/>
  </AdminLayout> )
}

export default page;
