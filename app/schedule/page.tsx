import AdminLayout from "../../components/layout/AdminLayout";
import Content from "./Content";
import ScheduleViewer from "./Schedule";

async function page() {
  return (
    <AdminLayout active="schedule">
      <div className="w-full box-border">
        <Content/>
        <ScheduleViewer/>
        </div>
    </AdminLayout>
  );
}

export default page;
