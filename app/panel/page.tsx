import React from "react";
import { MdGroups } from "react-icons/md";

function page() {
  const NAVS = [{ icon: <MdGroups />, label: "Groups", url: "/panel/groups" }];
  return (
    <main className="w-full mt-5 mb-24 relative my-5 md:my-10 md:px-[5%] grid md:grid-cols-5 gap-2 md:gap-7">
        {NAVS.map((item:any,i:number)=>(
            <a href={item.url} key={i} className="abq-card flex items-center justify-center gap-4 text-lg"><span className="text-3xl">{item.icon}</span>{item.label}</a>
        ))}
    </main>
  );
}

export default page;
