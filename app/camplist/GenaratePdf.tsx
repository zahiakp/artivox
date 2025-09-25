import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (data: any[], campus: string): Blob => {
  const doc = new jsPDF();

  // Path to your image (Base64 encoded or URL)
  const imageUrl = "/HEADER1.png"; // Example image URL (you can replace this with your own image URL or base64 string)

  // Add the image to replace header text
  doc.addImage(imageUrl, 'PNG', 15, 10, 180, 45); // Adjust the x, y, width, and height as needed

  // Add campus name (heading)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const pageWidth = doc.internal.pageSize.width;
  const titleX = (pageWidth - doc.getTextWidth(campus.toUpperCase())) / 2;
  doc.text(campus.toUpperCase(), titleX, 65); // Centered horizontally

  // Prepare to add tables for each category
  let startY = 77; // Start position for the first table

  // Iterate through each category
  data.forEach(categoryData => {
    const category = categoryData.category;
    const programs = categoryData.programs;

    // Add category header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const pageWidth = doc.internal.pageSize.width;
    const titleX = (pageWidth - doc.getTextWidth(category.toUpperCase())) / 2;
    // Draw a box around the category header
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    const textWidth = doc.getTextWidth(category.toUpperCase());
    const padding = 2;
    const boxX = 15; // Start from the left edge of the page
    const boxY = startY; // Use startY for the box Y position
    const boxWidth = pageWidth - 30; // Full page width
    const boxHeight = 10;
    doc.setFillColor(204, 204, 204); // Set background color to red
    doc.rect(boxX, boxY, boxWidth, boxHeight, 'F'); // 'F' for filled rectangle

    // Add category header text inside the box
    doc.text(category.toUpperCase(), titleX, startY + 7); // Centered horizontally

    // Prepare table headers
    const headers = [["Program", "Jamia No", "Participants"]];
    const rows: any[] = [];

    // Iterate through each program in the category
    programs.forEach((program: any) => {
      const programName = program.name;
      const participants = program.participants;

      // If there are participants, create rows for them
      if (participants.length > 0) {
        // Add the first participant with rowSpan
        rows.push([
          { content: programName, rowSpan: participants.length }, // Merge cells for the program name
          participants[0].jamiaNo,
          participants[0].participantName,
        ]);

        // Add subsequent participants without the program name
        for (let i = 1; i < participants.length; i++) {
          rows.push([
            participants[i].jamiaNo,
            participants[i].participantName,
          ]);
        }
      } else {
        // If no participants, still add the program name with empty fields
        rows.push([programName, "", ""]);
      }
    });

    // Add the table for the current category
    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: startY + 15, // Start the table below the category header with some gap
      theme: "grid", // Options: "striped", "grid", "plain"
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [220, 38, 38] }, // Custom header colors
      columnStyles: {
        0: { // Program column
          fontStyle: "bold", // Set the "Program" column to bold
        },
        1: { // Jamia No column
          fontStyle: "normal",
        },
        2: { // Participants column
          fontStyle: "normal",
        }
      },
    });

    // Update startY for the next category
    startY = (doc as any).lastAutoTable.finalY + 20; // Add some space after the table
  });

  // Convert to blob
  const pdfBlob = doc.output("blob");
  return pdfBlob;
};