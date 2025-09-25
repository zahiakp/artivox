'use client'
import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { encodeId } from "./decode";

function Card({data}:{data:any}) {
  const cardRef = useRef(null);
  const downloadRef = useRef(null);

  const [students, setStudents] = useState([]);
  // useEffect(() => {
  //   async function fetchData() {
  //     const studentsResponse = await fetch("/api/students", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ campusId: null }),
  //     });

  //     const studentsData = await studentsResponse.json();
  //     setStudents(studentsData.data.filter((item:any)=>item.campus=='JM021'));
  //   }

  //   fetchData();
  // }, []);
  
  const captureAndDownload = () => {
    const input:any = cardRef.current;

    try {
      const newWindow:any = window.open();
      newWindow.document.write(
        `<main class="grid grid-cols-5 justify-center items-center w-max mx-auto"><script src="https://cdn.tailwindcss.com"></script>${input.innerHTML}</main>`
      );
      setTimeout(() => {
        newWindow.print();
        newWindow.close();
      }, 200);
    } catch (error) {
      console.log(error);
    }
    // if (cardRef.current) {
    //   html2canvas(cardRef.current)
    //     .then((canvas) => {
    //       const imgData = canvas.toDataURL("image/png");
    //       const link = document.createElement("a");
    //       link.href = imgData;
    //       link.download = `card_${item.jamiaNo}_image.png`;
    //       link.click();
    //     })
    //     .catch((error) => {
    //       console.error("Error capturing and downloading image:", error);
    //     });
    // }
  };
  console.log(students.length);
  return (
    <div className="my-2 overflow-scroll">
      <button onClick={captureAndDownload}>download</button>
      <div className="grid grid-cols-3 w-full " ref={cardRef}>
        <style>
          {`
         
        @media print {
          .new-page {
            page-break-before: always;
        }
        }
        
         `}
        </style>
        {data.map((item:any, index:number) => (
          <div
            className={`bg-primary-50 border h-[341.25984252] px-3 py-2 w-[207.87401575] flex flex-col items-center relative overflow-hidden ${
              ((index + 1) % 20 == 1) && index+1!=1 ? "new-page" : ''
            }`}
            style={{background:"url('partcpnt card.jpg')",
              backgroundSize:"cover"
              , aspectRatio: "207.87401575/341.25984252" }}
            key={index}
          >
            <div className="absolute top-1/2 -translate-y-1/3">
              <div
                className="w-[100px] mx-auto p-2 bg-white -mt-4"
                style={{ aspectRatio: "1/1" }}
              >
                <QRCode
                  size={50}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={encodeId(item.jamiaNo)}
                  viewBox={`0 0 50 50`}
                />
              </div>

              <div className="text-center text-white uppercase my-[2px]">
                <h4 className="font-bold text-[16px]">{item.jamiaNo}</h4>
                <h6 className="text-white text-[8px] -mt-2">{item.name}</h6>
                <h6 className="text-[7px] text-primary-200 -mt-2">{item.campus}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
