import React from 'react'

function Categories() {
  return (
    <div className="bg-white rounded-lg mt-4 border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-red-600">P</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Premier</p>
                <p className="text-xs text-gray-500">245 participants</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-blue-600">SJ</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Sub-Junior</p>
                <p className="text-xs text-gray-500">189 participants</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-green-600">J</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Junior</p>
                <p className="text-xs text-gray-500">312 participants</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-purple-600">S</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Senior</p>
                <p className="text-xs text-gray-500">278 participants</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-yellow-600">G</span>
                </div>
                <p className="text-sm font-medium text-gray-900">General</p>
                <p className="text-xs text-gray-500">223 participants</p>
              </div>
            </div>
          </div>
        </div>
  )
}

export default Categories
