import React from 'react'

function Actions() {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span className="text-sm font-medium text-blue-900">Create New Event</span>
              </button>
              
              <button className="w-full flex items-center px-4 py-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                <span className="text-sm font-medium text-green-900">Add Participants</span>
              </button>
              
              <button className="w-full flex items-center px-4 py-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
                <span className="text-sm font-medium text-purple-900">Assign Judges</span>
              </button>
              
              <button className="w-full flex items-center px-4 py-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200">
                <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="text-sm font-medium text-yellow-900">Generate Reports</span>
              </button>
            </div>
          </div>
  )
}

export default Actions
