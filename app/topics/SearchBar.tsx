import React from 'react'
import { showMessage } from '../../components/common/CusToast'

function SearchBar({searchQuery, setSearchQuery, handleSearchKeyDown}:{searchQuery:string, setSearchQuery:React.Dispatch<React.SetStateAction<string>>, handleSearchKeyDown:any}) {
  return (
   <div className="bg-white rounded-lg border border-purple-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className='col-span-1 md:col-span-2'>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Centers</label>
            <input
              type="text"
              placeholder="Search by name or location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            //   value={typeFilter}
            //   onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Types</option>
              <option>stage</option>
              <option>Off</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              onClick={()=>showMessage("Filters has been disabled due to a security concern", "info")}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
  )
}

export default SearchBar
