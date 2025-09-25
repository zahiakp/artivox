'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProfile } from './func';
import { showMessage } from '../../../components/common/CusToast';
import { generateCertificate } from './Cerificate';
import ResultCard from './ResultCard';
import { ProResult } from '../../judgement/func';

interface Program {
  id: number;
  program: string;
  status: string;
  rank:string;
  grade:string;
  category:string;
}

interface StudentData {
  name: string;
  partId: string;
  campus: string;
  category:string;
  programs: Program[];
}

export default function ParticipantPage() {
  const { id } = useParams();
  const [data, setData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading,setDownloading] = useState(false);
  const [result,setResult] = useState<any>(null)
  const fetchProfile = useCallback(async (id: string | string[]) => {
    setLoading(true);
    setData(null);

    try {
      if (!id || typeof id !== 'string') {
        showMessage("Invalid participant ID.");
        return;
      }

      const response = await getProfile(id);

      if (response?.success && response.data) {
        setData(response.data);
      } else {
        setData(null);
        showMessage("Participant data not found.");
        console.error("API response error:", response);
      }
    } catch (err: any) {
      console.error("Error fetching participant profile:", err);
      showMessage("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchProfile(id);
  }, [id, fetchProfile]);

  console.log(data);
  const fetchResultbyProgam = async (program: any) => {
      setDownloading(true);
      
      try {
        const response = await ProResult(program.id, 'results');
        console.log(response);
        if (response.success) {
          setResult({
            program: {...program, name: program.program, category: data?.category || ''},
            result: response.data.sort((a: any, b: any) => a.rank - b.rank),
          });
        }
      } catch (error) {
        console.error("Error fetching program result:", error);
      }
      setDownloading(false);
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded-lg w-64 mb-8"></div>
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Participant Not Found</h2>
          <p className="text-gray-600 mb-6">The requested participant profile could not be located.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex  flex-col items-center space-x-3 mb-1 mt-10">
              <div className="w-14 h-14 bg-primary-600 rounded-lg flex mb-2 items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Participant Profile</h1>
            </div>
            <p className="text-gray-500 text-center text-sm">View participant details and program participation history</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">{data.name}</h2>
              <p className="text-blue-100">Participant ID: {data.partId}</p>
            </div>
            <div className="px-8 py-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Full Name</p>
                      <p className="text-gray-900 font-semibold">{data.name}</p>
                    </div>
                  </div> */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Category</p>
                      <p className="text-gray-900 font-semibold font-mono">{data.category}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Team</p>
                      <p className="text-gray-900 font-semibold">{data.campus}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Programs Enrolled</p>
                      <p className="text-gray-900 font-semibold">{data.programs.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Programs Section */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Programs</h3>
                  {/* <p className="text-gray-600 mt-1">Track your participation and download certificates</p> */}
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-blue-700 font-semibold">{data.programs.length} Programs</span>
                </div>
              </div>
            </div>

            <div className="px-8 py-6">
              {data.programs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Programs Found</h4>
                  <p className="text-gray-500">This participant hasn't enrolled in any programs yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.programs.map((program:any, index:number) => (
                    <div
                      key={program.id}
                      className="border-b border-gray-200 py-2 transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{program.program}</h4>
                            {program.status === 'announced' && ["1","2","3"].includes(program.rank)
                             && <div className="flex text-sm items-center space-x-2">
                              {program.rank} Prize
                            </div>}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {program.status !== 'announced' ? <button
                              disabled
                              className="inline-flex items-center px-4 py-2 bg-red-50 text-red-500 font-medium rounded-lg cursor-not-allowed"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Result Not Declared
                            </button> : program.status === 'announced' && ["1","2","3"].includes(program.rank) ? (
                            <div 
                            onClick={() => fetchResultbyProgam(program)}
                              className="inline-flex cursor-pointer items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                              {/* <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg> */}
                            {downloading ? "Fetching..." : "View Result"}
                            </div>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Rank Pending
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start mt-5 gap-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg p-4 text-sm shadow-sm">
  <svg
    className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.366-.446.98-.552 1.45-.237a1 1 0 01.293 1.416L5.634 14.73a1 1 0 01-1.74 0L.707 10.6a1 1 0 01.707-1.707h2.586L8.257 3.1zM11 13h2v2h-2v-2zm0-4h2v3h-2V9z"
      clipRule="evenodd"
    />
  </svg>
  <p>
    <strong>Note:</strong> Group items certificate is only available on one participant’s portal.
  </p>
</div>

        </div>
      </div>
      {result && <ResultCard data={result} close={setResult} />}
    </div>
  );
}