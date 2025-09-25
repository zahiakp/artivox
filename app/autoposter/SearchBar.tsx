import { classNames } from "primereact/utils";
import React from "react";
import { showMessage } from "../../components/common/CusToast";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

function SearchBar({
  inputValue,
  handleSearchInputChange,
  handleKeyDown,
}: {
  inputValue: string;
  handleSearchInputChange: any;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex gap-6 w-full">
      <div className="bg-white flex-1 w-full p-4 rounded-lg border border-gray-200">
        <div className="flex sm:flex-row sm:space-y-0 sm:space-x-4 flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 w-full">
            <input
              value={inputValue}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Search institutions..."
              className="pl-10 flex-1 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 md:w-full"
            />
            <IoSearchOutline className="text-xl text-gray-400 absolute left-3 top-2.5" />
          </div>
          {/* <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
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
      </div>
    </div>
  );
} 
// 
export default SearchBar;
