'use client'
import React, { useMemo, useState } from "react";
import Pending from "./Pending";
import Reporting from "./Reporting";
import Ongoing from "./Ongoing";
import Overview from "./Overview";
import Finished from "./Finished";

function RegistrationList() {
const [status, setStatus] = useState<any>("pending");
const statusOptions = useMemo(() => [
    { label: "Pending", value: "pending" },
    { label: "Reporting", value: "reporting" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Finished", value: "finished" },
  ], []);
  return (<main className="space-y-6">
  {/* <Overview/> */}
  <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatus(option.value)}
                className={`px-4 py-2 ${status === option.value ? "bg-primary-600 text-white" : "hover:bg-gray-50 border border-gray-300 text-gray-700"} rounded-lg text-sm  transition-colors font-medium`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
  </div>
    <div className="w-full relative grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="col-span-2">
      {status === "pending" && <Pending/>}
       {status === "reporting" && <Reporting/>}
        {status === "ongoing" && <Ongoing/>}
        {status === "finished" && <Finished/>}
      </div>
      <div className="space-y-6 blur-[2px]">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4" id="el-k0vm7b33">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" id="el-063iukkl">Session Stats</h3>
            
            <div className="space-y-3" id="el-mvvibfri">
              <div className="flex justify-between items-center" id="el-frkae09d">
                <span className="text-sm text-gray-600" id="el-utcdyti4">Total Participants</span>
                <span className="font-semibold text-gray-900" id="el-m5pav8eq">45</span>
              </div>
              <div className="flex justify-between items-center" id="el-8ofds2u4">
                <span className="text-sm text-gray-600" id="el-9i4bgps8">Completed</span>
                <span className="font-semibold text-green-600" id="el-qeo6dm92">12</span>
              </div>
              <div className="flex justify-between items-center" id="el-a0fx7ux1">
                <span className="text-sm text-gray-600" id="el-5map9w5t">In Progress</span>
                <span className="font-semibold text-blue-600" id="el-lbzu6znu">1</span>
              </div>
              <div className="flex justify-between items-center" id="el-tsx1lbrn">
                <span className="text-sm text-gray-600" id="el-42akplj1">Waiting</span>
                <span className="font-semibold text-yellow-600" id="el-h53iddy0">32</span>
              </div>
              <div className="flex justify-between items-center" id="el-6pptl02w">
                <span className="text-sm text-gray-600" id="el-hc04cwty">Average Time</span>
                <span className="font-semibold text-gray-900" id="el-w6chxcvc">6:45</span>
              </div>
            </div>
          </div>

          {/* <!-- Notifications --> */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4" id="el-41gujc86">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" id="el-y17vy1nd">Quick Notifications</h3>
            
            <div className="space-y-3" id="el-heqw911r">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm" id="el-xwas1goe">
                Notify Next 3 Participants
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm" id="el-uvxllw4d">
                Send Break Announcement
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm" id="el-cn92qtii">
                Technical Difficulty Alert
              </button>
            </div>
          </div>
      </div>
    </div></main>
  );
}

export default RegistrationList;
