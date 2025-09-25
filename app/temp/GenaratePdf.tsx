// // pages/api/generate-pdf.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { PDFDocument, rgb } from 'pdf-lib';

// const generatePDF = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { cards } = req.body; // Expecting an array of card data

//   if (!cards || !Array.isArray(cards)) {
//     return res.status(400).json({ error: 'Invalid card data' });
//   }

//   // Create a new PDF document
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage([841.89, 1189.42]); // A3 size in points

//   const cardWidth = 200; // Width of each card
//   const cardHeight = 100; // Height of each card
//   const margin = 20; // Margin between cards

//   cards.forEach((card, index) => {
//     const x = (index % 4) * (cardWidth + margin) + margin; // Calculate x position
//     const y = Math.floor(index / 4) * (cardHeight + margin) + margin; // Calculate y position

//     // Draw a rectangle for the card
//     page.drawRectangle({
//       x,
//       y: page.getHeight() - y - cardHeight, // Invert y for PDF coordinates
//       width: cardWidth,
//       height: cardHeight,
//       color: rgb(0.95, 0.95, 0.95),
//       borderColor: rgb(0, 0, 0),
//       borderWidth: 1,
//     });

//     // Add text to the card
//     page.drawText(card.text, {
//       x: x + 10,
//       y: page.getHeight() - y - cardHeight + 10,
//       size: 12,
//       color: rgb(0, 0, 0),
//     });
//   });

//   // Serialize the PDFDocument to bytes (a Uint8Array)
//   const pdfBytes = await pdfDoc.save();

//   // Set the response headers and send the PDF
//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', 'attachment; filename=cards.pdf');
//   res.send(pdfBytes);
// };

// export default generatePDF;