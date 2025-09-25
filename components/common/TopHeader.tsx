import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbLogout } from "react-icons/tb";
import Logout from "./Logout";

function FooterSide({setLogOut}:{setLogOut:any}) {
  const [cookies] = useCookies(["access"]);
  const [name, setName] = useState();
  const [role, setRole] = useState();
  const [list, setList] = useState(false);

  const [jamiaNo, setJamiaNo] = useState();
  useEffect(() => {
    setName(
      cookies.access?.role == "campus"
        ? cookies.access?.name
        : cookies?.access?.role == "admin"
        ? cookies.access?.username
        : cookies?.access?.role == "report"
        ? "Reporting Point"
        : cookies?.access?.role == "judge"
        ? "Judgement"
        : cookies?.access?.role == "announce" && "Announcement"
    );
    setJamiaNo(cookies.access?.jamiaNo);
    setRole(cookies.access?.role);
  }, []);
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <img src="https://avatar.iran.liara.run/public/boy?username=admin" alt="User Avatar" className="w-10 h-10 rounded-full"/>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            <p className="text-[10px] text-gray-500 uppercase truncate">{role=="campus"?"Team":role}{jamiaNo && " • " + jamiaNo}</p>
          </div>
          <button onClick={()=>setLogOut(true)} type="button" className="text-gray-700 hover:text-red-600 p-3 rounded-lg bg-gray-100 hover:bg-red-100 transition-colors duration-200">
            <TbLogout />
          </button>
        </div>
      </div>
  );
}

export default FooterSide;
