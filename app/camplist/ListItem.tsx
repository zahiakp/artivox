'use client';
import React, { useState } from 'react'
import { getProgramListforPdf } from './func';
import { generatePDF } from './GenaratePdf';

function ListItem() {
const [data,setData] =useState([]);


const fetchProgramsByRole = async () => {
    const categories = 'minor,premier,subjunior,junior';
    const campus = 'jmi001';

try{


        const data = await getProgramListforPdf(
            categories,
            campus
        );
        if (data) {
            console.log(data.data[0].programs[0].participants[0].campusName);
            
                const pdfBlob = generatePDF(
                    data?.data,
                    data.data[0].programs[0].participants[0].campusName
                );
        
                
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${data.data[0].programs[0].participants[0].campusName}.pdf`;
                link.click();
        

                // URL.revokeObjectURL(url);
              } else {
                console.error("No programs returned");
              }

  } catch (error) {
    console.error("Error:", error);
  }
}

  return (
    <div>
      <button onClick={fetchProgramsByRole}>Download</button>
    </div>
  )
}

export default ListItem;
