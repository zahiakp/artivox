'use client';;
import { useEffect, useState } from "react";
import Logout from "./Logout";
import { useCookies } from "react-cookie";
import IconMenuDashboard from "../icon/menu/icon-menu-dashboard";
import IconMenuDatatables from "../icon/menu/icon-menu-datatables";
import IconUser from "../icon/icon-user";
import IconMenuComponents from "../icon/menu/icon-menu-components";
import IconMenuForms from "../icon/menu/icon-menu-forms";
import IconAirplay from "../icon/icon-airplay";
import {IconPlayCircle,  IconCertificate, IconResutAtom } from "../icon/icon-play-circle";
import { usePathname } from "next/navigation";
import FooterSide from "./TopHeader";
import Image from "next/image";
import { TbLogout } from "react-icons/tb";
import { brandLogo, brandName } from "../../app/data/branding";
import IconSettings from "../icon/icon-settings";

const SideMenu = () => {
  const pathname = usePathname();
  const [logOut, setLogOut] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([`${brandName}-access`]);
  const [role, setRole] = useState();

  useEffect(() => {
    setRole(cookies[`${brandName}-access`].role);
  }, []);

  const menuItems = [
    {
      path: "/",
      label: "Dashbord",
      icon: <IconMenuDashboard />,
      adminOnly: true,
    },
    {
      path: "/campus",
      label:"Teams",
      icon: <IconMenuComponents />,
      adminOnly: true,
    },
    {
      path: "/students",
      label: "Participants",
      icon: <IconUser fill={true}/>,
      campusOnly: true,
    },
    {
      path: "/programs",
      label: "Programs",
      icon: <IconMenuDatatables />,
      adminOnly: true,
      campusOnly: true,
    },
    // {
    //   path: "/schedule",
    //   label: "Schedule",
    //   icon: <IconPlayCircle fill={true}/>,
    //   adminOnly: true,
    //   announceOnly: true,
    // },
    // {
    //   path: "/topics",
    //   label: "Topics",
    //   icon: <IconMenuNotes />,
    //   adminOnly: true,
    //   // zoneAdmin:true,
    //   judgeOnly: true,
    // },
    {
      path: "/manage",
      label: "Manage",
      icon: <IconMenuForms />,
      regOnly: true,
      adminOnly: true,
    },
    {
      path: "/judgement",
      label: "Judgement",
      icon: <IconResutAtom fill={true} />,
      adminOnly: true,
      judgeOnly: true,
    },
    {
      path: "/results",
      label: "Results",
      icon: <IconPlayCircle fill={true}/>,
      adminOnly: true,
      announceOnly: true,
    },
    {
      path: "/autoposter",
      label: "Published",
      icon: <IconAirplay fill={true} />,
      adminOnly: true,
      resultOnly: true,
    },
    {
      path: "/award",
      label: "Award",
      icon: <IconCertificate />,
      adminOnly: true,
      awardOnly: true,
      resultOnly: true,
    },
    {
      path: "/config",
      label: "Config",
      icon: <IconSettings />,
      adminOnly: true,
    },
  ];

  return (
    <>
    {/* Desktop Sidebar */}
    <div className="hidden md:flex md:w-72 md:flex-col">
      <div className="flex flex-col flex-grow overflow-y-auto bg-white md:w-72 fixed h-screen">
        <div className="p-6 border-b border-gray-200">
          <div className="mt-5 select-none text-xl text-white flex flex-col items-center justify-center">
            <div className="h-28 w-28 bg-primary-50 rounded-full flex items-center justify-center">
              <Image alt='' src={brandLogo || '/eventpro-logo.png'} width={90} height={90}/>
            </div>
            <b className="text-3xl text-primary-800 mt-3">{brandName || "Event Pro"}</b>
            <p className="text-[12px] text-right text-zinc-500">eventpro v1.0</p>
          </div>
        </div>

        <div className="p-4 px-5">
          <ul className="space-y-2">
            {menuItems.map((item: any, index: number) =>
              (role === "admin" && item.adminOnly) ||
              (role === "campus" && item.campusOnly) ||
              (role === "judge" && item.judgeOnly) ||
              (role === "result" && item.resultOnly) ||
              (role === "announce" && item.announceOnly) ||
              (role === "report" && item.regOnly) ||
              (role === "award" && item.awardOnly) ? (
                <li key={index}>
                  <a
                    href={item.path}
                    className={`flex items-center px-4 py-[10px] ${
                      pathname === item.path
                        ? "bg-primary-600 text-white"
                        : "hover:bg-gray-100"
                    } text-gray-700 rounded-lg transition-colors duration-200`}
                  >
                    <span className="w-fit">{item.icon && item.icon}</span>
                    <span className="ml-3 whitespace-nowrap">{item.label}</span>
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </div>
        <FooterSide setLogOut={setLogOut} />
      </div>
      
    </div>

    {/* Mobile Top Header */}
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow z-10 h-16 flex items-center justify-between px-4">
      <b className="text-xl text-primary-800">{brandName || "Event Pro"}</b>
     <button onClick={()=>setLogOut(true)} type="button" className="text-gray-700 hover:text-red-600 p-3 rounded-lg bg-gray-100 hover:bg-red-100 transition-colors duration-200">
                 <TbLogout />
               </button>
    </div>

    {/* Mobile Footer Navigation */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner z-10 h-16 flex justify-around items-center">
      {/* Show menuItems that match mobile role */}
      {menuItems
        .filter((item: any) =>
          (role === "admin" && item.adminOnly) ||
              (role === "campus" && item.campusOnly) ||
              (role === "judge" && item.judgeOnly) ||
              (role === "result" && item.resultOnly) ||
              (role === "announce" && item.announceOnly) ||
              (role === "report" && item.regOnly) ||
              (role === "award" && item.awardOnly)
        )
        .slice(0, 4) // limit to first 4 for mobile layout
        .map((item: any, index: number) => (
          <a
            key={index}
            href={item.path}
            className={`flex flex-col items-center text-[11px] ${
              pathname === item.path ? "text-primary-600 font-bold" : "text-gray-500"
            }`}
          >
            <div className="text-xl">{item.icon}</div>
            {item.label}
          </a>
        ))}
    </div>
    {logOut && <Logout close={() => setLogOut(false)} />}
  </>
  );
};

export default SideMenu;
