import jsPDF from "jspdf";
import "jspdf-autotable";
import { DocHeader } from "../data/branding";

export const generatePDF = 
  (result: any[],programs:any
): Blob => {
  const doc = new jsPDF();

  // --- Configuration for Gaps ---
  const headerGap = 60; // 20mm gap from the top
  const footerGap = 20; // 20mm gap from the bottom
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  // --- Path to your template background image ---
  const templateBackground = DocHeader || ""; // **Action Required:** Replace with your actual image path or Base64 string

  // --- Add Template as Background to All Pages ---
  const addTemplateAsBackground = () => {
doc.addImage(templateBackground, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  };

  // Add background to the first page
  addTemplateAsBackground();

  // Add program name (heading)
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const titleX = (pageWidth - doc.getTextWidth(programs.name.toUpperCase())) / 2;
  doc.text(programs.name.toUpperCase(), titleX, 75); // Centered horizontally

  // Add category (description)
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const categoryX = (pageWidth - doc.getTextWidth(programs.category.toUpperCase())) / 2;
  doc.text(programs.category.toUpperCase(), categoryX, 82); // Centered horizontally

  // Prepare table headers and rows
  const headers = [["Rank", "Code", "Name", "Team", "Grade", "Point"]];
  const rows = result.sort((a:any,b:any)=>a.rank-b.rank).map((res: any, i: any) => [
        res.rank,
        res.code,
        res.student.toUpperCase(),
        res.campus.toUpperCase(),
        res.grade,
        res.point,
      ]);

  // Add the table with custom styles
  (doc as any).autoTable({
    head: headers,
    body: rows,
    startY: 88, // Start the table below the program name and category (adjust as needed)
    theme: "grid", // Options: "striped", "grid", "plain"
    styles: { fontSize: 11, cellPadding: 3 },
    headStyles: { fillColor: [100, 100, 100] }, // Custom header colors
    // columnStyles: {
    //   1: { // Column 2 (Name)
    //     fontStyle: "bold", // Set the "Name" column to bold
    //   }
    // },
  });

  return doc.output("blob");
};
