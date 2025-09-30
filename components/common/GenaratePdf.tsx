import jsPDF from "jspdf";
import "jspdf-autotable";
import { DocHeader, DocHeaderSec } from "../../app/data/branding";

export const generatePDF = (
  participants: any[],
  group: any,
  programName: string,
  category: string
): Blob => {
  const doc = new jsPDF();

  const headerGap = 60;
  const footerGap = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  const templateBackground = DocHeader || "";   // first page
  const backgroundFrom2 = DocHeaderSec || "";    // second+ pages

  const addTemplateAsBackground = (pageNum: number) => {
    const bg = pageNum === 1 ? templateBackground : backgroundFrom2;
    doc.addImage(bg, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
  };

  // First page
  addTemplateAsBackground(1);

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const titleX = (pageWidth - doc.getTextWidth(programName.toUpperCase())) / 2;
  doc.text(programName.toUpperCase(), titleX, headerGap + 14);

  // Category
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const categoryX = (pageWidth - doc.getTextWidth(category.toUpperCase())) / 2;
  doc.text(category.toUpperCase(), categoryX, headerGap + 20);

  // Table
  const headers = [["No", "Name", "Chest No", "Team", "Code", "Sign"]];
  const rows =
    group > 0
      ? participants.map((participant: any, i: number) => [
          i + 1,
          participant?.students.map((std: any) => std?.name).join(", "),
          participant?.students.map((std: any) => std?.jamiaNo).join(", "),
          participant?.campusName,
          participant?.code,
          "",
        ])
      : participants.map((participant: any, i: number) => [
          i + 1,
          participant?.studentName?.toUpperCase(),
          participant?.jamiaNo,
          participant?.campusName,
          participant?.code,
          "",
        ]);

  (doc as any).autoTable({
    head: headers,
    body: rows,
    startY: headerGap + 25,
    margin: { bottom: footerGap },
    theme: "grid",
    styles: { fontSize: 11, cellPadding: 3.5 },
    headStyles: { fillColor: [33, 122, 74] },
    columnStyles: {
      1: { fontStyle: "bold" },
      4: { fontStyle: "bold" },
    },
    didDrawPage: (data: any) => {
      const pageNum = (doc as any).internal.getNumberOfPages();
      addTemplateAsBackground(pageNum);
    },
  });

  return doc.output("blob");
};
