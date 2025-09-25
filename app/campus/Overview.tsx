'use client'
import React, { useState } from "react";
import { FaCheckCircle, FaSchool } from "react-icons/fa";
import { FcOk } from "react-icons/fc";
import LDRloader from "../../components/common/LDRloader";
import IconInfoHexagon from "../../components/icon/icon-info-hexagon";

function Overview({ data,role }: { data: any,role:any }) {
  const [view,setView] =useState()
  const CAT = [
    { value: "minor", label: "Minor" },
    { value: "premier", label: "Permier" },
    { value: "subJunior", label: "Sub Junior" },
    { value: "junior", label: "Junior" },
    { value: "senior", label: "Senior" },
  ];
  
  return (<>
  <section className="abq-card ">
  <div className="z-[2] -m-6 font-semibold flex bg-zinc-100 items-center px-5 py-3 rounded-t-xl justify-between">
            <h6 className="flex items-center">
              {/* <FaCheckCircle className="mr-2 text-lg text-yellow-200" /> */}
              {role=="campusAdmin"?"Group":"Campus"} Overview</h6>
          </div>
          <div className="grid grid-cols-2 gap-5 gap-y-8 mt-10 p-2">
  {data=="loading" ? <LDRloader/> : data && data.length > 0 ? data.map((items: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className="p-4 rounded-xl bg-primary-50 text-2xl text-primary-500 h-fit"><FaSchool/></div>
                        <h3 className="font-bold text-4xl flex flex-col justify-start">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> {
                items.count?items.count:0
              }+ </span>
                        <p className="text-[14px] font-medium text-gray-700 leading-4 uppercase">{items.value}</p>
                        </h3>
                    </div>
)): <div className="flex gap-5 w-full items-center justify-center flex-col p-10">
<div className="p-5 rounded-full bg-red-50 text-red-600"><IconInfoHexagon size="50"/></div>
Not Data</div>}
</div>
        </section>
    {/* <div className="grid grid-cols-1 gap-3 rounded-xl shadow-lg shadow-zinc-100 border border-primary-300">
      {CAT.map((items: any, index: number) => (
        <div
          key={index}
          className="h-fit p-3 px-10 bg-white text-xl font-semibold flex items-center justify-center text-center "
        >
          <p className="">
            <span className="font-barlow font-bold text-3xl text-primary-500 mr-5">
            {
                data?.filter((item: any) =>
                  item.categories.includes(items.value)
                )?.length
              }
            </span>
            {items.label} Campuses
          </p>
        </div>
      ))}
      <div>
      </div>
    </div> */}
    </>
  );
}

export default Overview;
