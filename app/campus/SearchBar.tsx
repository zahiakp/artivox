import { classNames } from "primereact/utils";
import React from "react";
import { showMessage } from "../../components/common/CusToast";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearchKeyDown,
  setAdd,totalRecords
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  totalRecords:any
}) {
  return (
    <div className="flex gap-6 w-full">
      <div className="bg-white flex-1 w-full p-4 rounded-lg border border-gray-200">
        <div className="flex sm:flex-row sm:space-y-0 sm:space-x-4 flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 w-full">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              type="text"
              placeholder="Search Team..."
              className="pl-10 flex-1 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:w-full"
            />
            <IoSearchOutline className="text-xl text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div className="p-2 px-5 border border-gray-200 rounded-lg">{totalRecords} Teams</div>
          {/* <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Categories</option>
            <option>Premier</option>
            <option>Senior</option>
            <option>Junior</option>
            <option>Sub-Junior</option>
          </select> */}
        </div>
      </div>
      <div className="flex space-x-2 bg-white p-4 rounded-lg border border-gray-200">
        <button
          onClick={() =>
            showMessage(
              "Exporting has been disabled due to a security concern ",
              "info"
            )
          }
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Export
        </button>
        <button
          onClick={() =>
            showMessage(
              "Importing has been disabled due to a security concern ",
              "info"
            )
          }
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Import
        </button>
        <button
          onClick={() => setAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <MdOutlineAddCircle className="text-xl" />
          <span>Add Team</span>
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
