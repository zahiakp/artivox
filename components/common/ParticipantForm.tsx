'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function ParticipantForm() {
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // const scanner= new Html5QrcodeScanner('reader', {
    //   qrbox: {
    //     width: 30,
    //     height: 30,
    //   },
    //   fps: 5,
    //   aspectRatio: 1.0, // Set the aspect ratio of the QR code scanner
    //   disableFlip: false, // Allow flipping of the camera (true or false)
    //   disable: false, // Disable the QR code scanner (true or false)
    //   color: '#000000', // Set the color of the laser line and box border
    //   backgroundScan: true, // Enable scanning continuously in the background
    //   refractoryPeriod: 5000, // Set the refractory period in milliseconds
    //   reactivate: true, // Reactivate the QR code scanner after scanning
    //   singleScan: false, // Allow only a single scan (true or false)
    //   playSound: true, // Play a sound when a QR code is scanned (true or false)
    //   successCallback: (decodedText, decodedResult) => {
    //     // Callback function when a QR code is successfully scanned
    //     console.log(`Scanned QR code: ${decodedText}`);
    //   },
    //   errorCallback: (errorMessage) => {
    //     // Callback function when an error occurs during scanning
    //     console.error(`Error during QR code scanning: ${errorMessage}`);
    //   },
    // });

    // Set the scanner reference for cleanup
    

    // scanner.render(success, error);

    // // Cleanup function
    // return () => {
    //   if (scannerRef.current) {
    //     scanner.clear()
    //   }
    // };

    // function success(result:any) {
    //   scanner.clear();
    //   setScanResult(result);
    // }

    function error(err:any) {
      console.warn(err);
    }
  }, []);

  return (
    <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 '>
      <h6>QR Code Scanner</h6>
      {scanResult ? (
        <div>
          Success: <a href={'http://' + scanResult}>{scanResult}</a>
        </div>
      ) : (
        <div id="reader"></div>
      )}
    </div>
  );
}

export default ParticipantForm;
