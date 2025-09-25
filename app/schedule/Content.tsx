'use client'
import React, { useState } from 'react'

function Content() {
    const [status,setStatus] = useState<any>(1);
    const statusOptions = [
        {label:"Day 1 - August 01",value:1},
        {label:"Day 2 - August 02",value:2},
        {label:"Day 3 - August 03",value:3}
    ]
  return (
    <div>
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 border border-pink-200 rounded-lg p-4 mb-6" id="el-t4ivhbx5">
          <div className="flex items-center justify-between" id="el-ve6mgodp">
            <div className="flex items-center space-x-3" id="el-fbl3ke9y">
              <div className="p-2 bg-pink-100 rounded-full" id="el-ec3iynaf">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="el-tptgr605">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" id="el-g71ztml4"></path>
                </svg>
              </div>
              <div id="el-4xjkf8c7">
                <h3 className="font-semibold text-gray-900" id="el-s32zui8r">AI Scheduling Suggestions</h3>
                <p className="text-sm text-gray-600" id="el-ie60zlnp">Optimize your schedule for conflict-free events</p>
              </div>
            </div>
            {/* <div className="flex space-x-2" id="el-vio2wndt">
              <button className="px-3 py-1 bg-white text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm" id="el-hs1zt51c">
                View All
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm" id="el-iaqfigbn">
                Apply Best
              </button>
            </div> */}
          </div>
          {/* <div className="mt-3 flex flex-wrap gap-2" id="el-h2elzy3z">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm cursor-pointer hover:bg-green-200 transition-colors" id="el-tdxi1hkx">
              ✓ Move Dance to Hall A (saves 30 min)
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors" id="el-peoz98o6">
              ⚡ Batch similar events together
            </div>
            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm cursor-pointer hover:bg-yellow-200 transition-colors" id="el-vw2m2prd">
              ⚠ Judge conflict at 2:00 PM
            </div>
          </div> */}
        </div>
      {/* <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatus(option.value)}
                className={`px-4 py-2 ${status === option.value ? "bg-violet-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"} rounded-lg text-sm transition-colors font-medium`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Content
