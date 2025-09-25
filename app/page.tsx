import Actions from "../components/Home/Actions";
import Categories from "../components/Home/Categories";
import Highlight from "../components/Home/Highlight";
import Notifications from "../components/Home/Notifications";
import RecentEvents from "../components/Home/RecentEvents";
import AdminLayout from "../components/layout/AdminLayout";
import { brandName } from "./data/branding";

export default function Home() {
  return (
    <AdminLayout active="home">
     {/* <Highlight/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentEvents/>
        <Actions/>
        <Notifications/>
      </div>
      <Categories/> */}
      <div className="h-[80vh] w-full flex items-center justify-center">
      <p className="text-3xl font-semibold md:text-5xl text-primary-600">{brandName || "Event Pro"}</p></div>
    </AdminLayout>
  );
}
