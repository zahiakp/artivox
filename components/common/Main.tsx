"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SideMenu from "./SideMenu";
import TopHeader from "./TopHeader";
import { MdPhonelinkErase } from "react-icons/md";
import Footer from "./Footer";


function Main({ children }:{children:any}) {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/login" && pathname!=="/unauthorized" && <SideMenu/>}
      {pathname !== "/login" && pathname!=="/unauthorized" && <Footer/>}
      {/* <main className="m-0 p-0 h-screen font-public-sans flex-1 relative flex overflow-hidden w-full flex-col">{pathname !== "/login" && pathname!=="/unauthorized" && <TopHeader setLogOut={""} />}<div className="h-full overflow-auto w-full px-3 md:px-5">{children}</div></main> */}
      {/* <main className="block md:hidden min-h-screen flex flex-col justify-center items-center w-full"><MdPhonelinkErase className="text-5xl mb-4 text-green-600"/>
phone view not allowed</main> */}

    </>
  );
}

export default Main;
