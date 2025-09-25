import React, { useEffect, useState } from "react";
import { HiMiniUserGroup, HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaFileSignature, FaListCheck } from "react-icons/fa6";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { TbCheckupList } from "react-icons/tb";
import { GrAnnounce } from "react-icons/gr";
import IconMenuDashboard from "../icon/menu/icon-menu-dashboard";
import IconMenuComponents from "../icon/menu/icon-menu-components";
import IconUser from "../icon/icon-user";
import IconMenuDatatables from "../icon/menu/icon-menu-datatables";
import IconMenuNotes from "../icon/menu/icon-menu-notes";
import IconMenuForms from "../icon/menu/icon-menu-forms";
import { IconCertificate, IconPlayCircle, IconResutAtom } from "../icon/icon-play-circle";
import IconAirplay from "../icon/icon-airplay";

const Footer = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["access"]);
  const [role, setRole] = useState();

  useEffect(() => {
    setRole(cookies?.access?.role);
  }, []);

  const menuItems = [
    // {
    //   path: "/",
    //   label: "Dashbord",
    //   icon: <IconMenuDashboard />,
    //   adminOnly: true,zoneAdmin:true,campusAdmin:true,
    // },
    {
      path: "/campus",
      label:role === "campusAdmin"? "Groups": "Campuses",
      icon: <IconMenuComponents />,
      adminOnly: true,zoneAdmin:true,campusAdmin:true,
    },
    {
      path: "/students",
      label: "Students",
      icon: <IconUser fill={true}/>,
      campusOnly: true,
    },
    {
      path: "/programs",
      label: "Programs",
      icon: <IconMenuDatatables />,
      adminOnly: true,
      zoneAdmin:true,
      campusAdmin:true,
      campusOnly: true,
    },
    {
      path: "/topics",
      label: "Topics",
      icon: <IconMenuNotes />,
      adminOnly: true,
      // zoneAdmin:true,
      judgeOnly: true,
    },
    {
      path: "/registration",
      label: "Manage",
      icon: <IconMenuForms />,
      regOnly: true,
      adminOnly: true,
      zoneAdmin:true,
      campusAdmin:true,
    },
    {
      path: "/results",
      label: "Results",
      icon: <IconResutAtom fill={true} />,
      adminOnly: true,
      zoneAdmin:true,
      judgeOnly: true,
      campusGudge: true,
      campusAdmin:true,
    },
    {
      path: "/announcement",
      label: "Announce",
      icon: <IconPlayCircle fill={true}/>,
      adminOnly: true,
      zoneAdmin:true,
      announceOnly: true,
      campusAdmin:true,
    },
    {
      path: "/published",
      label: "Published",
      icon: <IconPlayCircle fill={true}/>,
      adminOnly: true,
      zoneAdmin:true,
      announceOnly: true,
      campusAdmin:true,
    },
    {
      path: "/autoposter",
      label: "Auto Poster",
      icon: <IconAirplay fill={true} />,
      adminOnly: true,
      // zoneAdmin:true,
      resultOnly: true,
      campusAdmin:cookies?.access?.campusId=='JM001',
    },
    {
      path: "/award",
      label: "Award",
      icon: <IconCertificate />,
      adminOnly: true,
      // zoneAdmin:true,
      awardOnly: true,
      resultOnly: true,
    },
  ];

  return (
    <div className="fixed bottom-0 w-full h-20 bg-white z-50 md:hidden flex items-center justify-around my-2">
      {menuItems.map((item) =>
          (role === "admin" && item.adminOnly) ||
          (role === "zoneAdmin" && item.zoneAdmin) ||
          (role === "campusAdmin" && item.campusAdmin) ||
          (role === "campus" && item.campusOnly) ||
          (role === "zonecampus" && item.campusOnly) ||
          (role === "Group" && item.campusOnly) ||
          (role === "judge" && item.judgeOnly) ||
          (role === "campusJudge" && item.campusGudge) ||
          (role === "result" && item.resultOnly) ||
          (role === "announce" && item.announceOnly) ||
          (role === "report" && item.regOnly) ||
          (role === "award" && item.awardOnly) ? (
            <Link key={item.path} href={item.path}>
            <div className="flex flex-col items-center justify-center">
              <span className="w-20 h-10  rounded-3xl flex items-center justify-center">
                {item.icon &&
                  React.cloneElement(item.icon, {
                    className: "text-2xl text-green-600",
                  })}
              </span>
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          </Link>
        ) : null
      )}
    </div>
  );
};

export default Footer;
