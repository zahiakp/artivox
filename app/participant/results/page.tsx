'use client'; 

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { ProResult } from '../../judgement/func';
import { MdListAlt, MdSearch } from 'react-icons/md';
import { getProgramswithPagination } from '../../programs/func';
import ResultCard from '../[id]/ResultCard';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';

const categories = ['All', 'hizone', 'dzone', 'pzone', 'general'];

export default function ResultPage() {
  // --- State Management ---
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [downloading, setDownloading] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<number[]>([]);
const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(12);
  // --- API Data Fetching ---
  const fetchPrograms = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: rows.toString(),
        search: searchTerm, // Use the final search term directly
      });

      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }

      const response = await getProgramswithPagination(params.toString());
      if (response.success) {
        setPrograms(response.data || []);
        setTotalRecords(response.total || 0);
      } else {
        setPrograms([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error("Failed to fetch programs:", err);
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory,page,rows]); // Dependencies for the callback

  // --- Effects ---
  // Fetch programs on initial load and when the category changes.
  useEffect(() => {
    // We don't fetch based on searchTerm here anymore.
    // That's handled by the user submitting the form.
    fetchPrograms();
  }, [selectedCategory,page,rows]); // Now only depends on the category

  const fetchResultbyProgam = async (program: any) => {
    setDownloading(program.id);
    try {
      const response = await ProResult(program.id, 'results');
      if (response.success) {
        setResult({
          program: { ...program, name: program.name, category: program.category || '' },
          result: response.data.sort((a: any, b: any) => a.rank - b.rank),
        });
      } else {
        setError(prev => [...new Set([...prev, program.id])]);
      }
    } catch (err) {
      setError(prev => [...new Set([...prev, program.id])]);
      console.error("Error fetching program result:", err);
    } finally {
      setDownloading(null);
    }
  };

  const onPageChange = (e: PaginatorPageChangeEvent) => {
          setPage(e.page + 1);
          setRows(e.rows);
      };

  // --- Handler for search submission ---
  const handleSearch = (e: FormEvent) => {
    e.preventDefault(); // Prevent the page from reloading
    fetchPrograms(); // Manually trigger the API call
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Program Results
          </h1>
        </div>

        {/* --- Filter and Search Controls --- */}
        <div className="md:flex gap-4 mb-8 p-6 bg-white rounded-xl shadow-md">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-grow gap-2 mb-4 md:mb-0">
            <input
              type="text"
              id="search"
              placeholder="e.g., Madh Song"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
            >
              <MdSearch className="h-5 w-5" />
            </button>
          </form>

          {/* Category Filter Dropdown */}
          <div className="flex-shrink-0 md:w-1/4">
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Results Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {isLoading ? (
            <p className="col-span-full text-center text-gray-500">Loading programs...</p>
          ) : programs.length > 0 ? (
          <>
            {programs.map(program => (
              <div key={program.id} className="bg-white flex justify-between items-center rounded-xl p-4 gap-4 border border-gray-200">
                <div className="inline-block bg-indigo-100 text-indigo-800 text-sm w-fit font-semibold px-2.5 py-0.5 rounded-full">
                  {program.category}
                </div>
                <h3 className="text-xl font-bold flex-1 text-gray-900">
                  {program.name}
                </h3>
                {program.status !=="announced" ? (
                   <p className="inline-flex items-center px-4 py-2 gap-2 bg-red-50 text-red-500 font-medium rounded-lg cursor-not-allowed">
                     Not Declared
                   </p>
                ) : (
                  <div 
                    onClick={() => fetchResultbyProgam(program)}
                    className="inline-flex cursor-pointer items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                  >
                  {downloading === program.id ? "Fetching..." : <p className='flex items-center gap-2'><MdListAlt /> Result</p>}
                  </div>
                )}
              </div>
              
))}
            <div className='md:col-span-2 lg:col-span-3'><Paginator
                                        first={(page - 1) * rows}
                                        rows={rows}
                                        totalRecords={totalRecords}
                                        rowsPerPageOptions={[12, 18, 24]}
                                        onPageChange={onPageChange}
                                    /></div>
                      </>              
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg mt-8">
              No programs found.
            </p>
          )}
        </div>
      </main>
      {result && <ResultCard data={result} close={() => setResult(null)} />}
    </div>
  );
}