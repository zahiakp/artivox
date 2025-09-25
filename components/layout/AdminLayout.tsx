import React, { PropsWithChildren } from 'react';
import SideMenu from '../common/SideMenu';

interface AdminLayoutProps {
    active: string;
}



const AdminLayout: React.FC<PropsWithChildren<AdminLayoutProps>> = (props:any) => {
  return (
    <main className="flex min-h-screen bg-gray-50 overflow-x-hidden">
  {/* Fixed Sidebar */}
  <div className="w-0 md:w-72 fixed h-full bg-white shadow-md !z-10">
    <SideMenu />
  </div>

  {/* Main Content with margin to accommodate fixed sidebar */}
  <div className="md:ml-72 flex-1 pt-14 pb-16 md:py-0"> {/* 14 for header, 16 for footer */}
    <div className="p-4 md:p-16 md:px-20 w-full">
      {props.children}
    </div>
  </div>

</main>

  );
};

export default AdminLayout;