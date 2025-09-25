'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { showMessage } from '../../components/common/CusToast';
import { decodeId } from '../../components/common/decode';

export default function ParticipantsScanner() {
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [lastScannedId, setLastScannedId] = useState('');
  const [scanCount, setScanCount] = useState(0);
  const router = useRouter();

  const handleScan = (text: string) => {
    const decodedId = decodeId(text);
    console.log(decodedId);
    
    if (/^COG\d{3}$/.test(decodedId)) {
      setError('');
      setScanSuccess(true);
      setLastScannedId(decodedId);
      setScanCount(prev => prev + 1);
      setIsScanning(false);
      
      // Show success message
      showMessage(`Participant ${decodedId} found! Redirecting...`, "success");
      
      // Redirect after a short delay to show success state
      setTimeout(() => {
        router.push(`/participant/${decodedId}`);
      }, 1500);
    } else {
      setError('Invalid QR code format. Please scan a valid participant ID.');
      showMessage('Not a valid participant ID', "error");
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetScanner = () => {
    setIsScanning(true);
    setScanSuccess(false);
    setError('');
    setLastScannedId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Participant Scanner
            </h1>
            <p className="text-gray-500 text-sm">
              Scan participant ID cards to access their profiles
            </p>
          </div>

          {/* Scanner Status Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Scans Today</p>
                  <p className="text-xl font-bold text-gray-900">{scanCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isScanning ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Scanner Status</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {isScanning ? 'Active' : 'Standby'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Last Scanned</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {lastScannedId || 'None'}
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          {/* Scanner Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Scanner Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">QR Code Scanner</h3>
                    <p className="text-blue-100 text-sm">Position QR code within the frame</p>
                  </div>
                </div>
                
                {scanSuccess && (
                  <div className="flex items-center space-x-2 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Scan Successful!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Scanner Area */}
            <div className="relative p-8">
              {scanSuccess ? (
                // Success State
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Scan Successful!</h3>
                  <p className="text-gray-600 mb-4">
                    Participant ID: <span className="font-semibold text-blue-600">{lastScannedId}</span>
                  </p>
                  <p className="text-sm text-gray-500 mb-6">Redirecting to participant profile...</p>
                  
                  <button
                    onClick={resetScanner}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Scan Another
                  </button>
                </div>
              ) : (
                // Scanner State
                <div className="relative">
                  {/* Scanner Frame Overlay */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative w-64 h-64 md:w-80 md:h-80">
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>
                        
                        {/* Scanning line animation */}
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Scanner Component */}
                  <div className="flex justify-center">
                    <div className="w-72 h-72 md:w-96 md:h-96 rounded-xl overflow-hidden bg-gray-900">
                      <BarcodeScannerComponent
                        width={400}
                        height={400}
                        stopStream={false}
                        onUpdate={(err: any, result: any) => {
                          if (result && isScanning) {
                            handleScan(result.text.trim());
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Hold QR code steady</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Ensure good lighting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Keep within frame</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-red-800 font-medium">Scan Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Scan</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Position</h4>
                <p className="text-sm text-gray-600">Hold the QR code within the scanning frame</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Focus</h4>
                <p className="text-sm text-gray-600">Keep the code steady and well-lit</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Scan</h4>
                <p className="text-sm text-gray-600">Wait for automatic detection and redirection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}