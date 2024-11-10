import { PDFDocument, StandardFonts } from 'pdf-lib';
import pdfTemplate from "../../../assets/Template.pdf";

// Extracted generatePdf function to reuse it elsewhere
export const generatePdf = async (babyNames,additionalBabyNames) => {
  try {
    const pdfTemplateBytes = await fetch(pdfTemplate).then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.arrayBuffer();
    });

    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 25;
    const lineSpacing = 40;
    const lineSpacing1=52;
    const firstPage = pdfDoc.getPage(0);
    let secondPage = pdfDoc.getPage(1);  // Initially assume second page
    let thirdPage = pdfDoc.getPageCount() > 2 ? pdfDoc.getPage(2) : null;  // Check if third page already exists
    let currentPage = secondPage; 
    // Static data
    const staticData = {
      gender: 'Girl',
      zodiacSign: 'Cancer',
      nakshatra: 'Punarvasu',
      gemstone: 'Pearl',
      destinyNumber: 6,
      luckyColour: 'White',
      birthDate: '02/08/2024',
      birthTime: '10:05 PM',
      numerology: 2,
      luckyDay: 'Sunday',
      luckyGod: 'Shiva',
      luckyMetal: 'Silver',
  };

    // Embed static data on the first page
    let textYPosition = 620;
    firstPage.drawText(staticData.gender, { x: 320, y: textYPosition, size: fontSize, font }); // Gender
        textYPosition -= lineSpacing;  // Move down for the next value

        firstPage.drawText(staticData.birthDate, { x: 320, y: textYPosition, size: fontSize, font }); // Birth Date
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.birthTime, { x: 320, y: textYPosition, size: fontSize, font }); // Birth Time
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.zodiacSign, { x: 320, y: textYPosition, size: fontSize, font }); // Zodiac Sign
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.nakshatra, { x: 320, y: textYPosition, size: fontSize, font }); // Nakshatra
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.destinyNumber.toString(), { x: 320, y: textYPosition, size: fontSize, font }); // Destiny Number
        textYPosition -= lineSpacing;

        firstPage.drawText(staticData.luckyDay, { x: 320, y: textYPosition, size: fontSize, font }); // Lucky Day
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.gemstone, { x: 320, y: textYPosition, size: fontSize, font }); // Gemstone
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.luckyGod, { x: 320, y: textYPosition, size: fontSize, font }); // Lucky God
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.luckyMetal, { x: 320, y: textYPosition, size: fontSize, font }); // Lucky Metal
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.luckyColour, { x: 320, y: textYPosition, size: fontSize, font }); // Lucky Colour
        textYPosition -= lineSpacing1;

        firstPage.drawText(staticData.numerology.toString(), { x: 320, y: textYPosition, size: fontSize, font }); // Numerology

        
    const mergedBabyNames = [...babyNames, ...additionalBabyNames];
    let yPosition = 600;
    const pageLimit=100;
    for (const { nameEnglish, meaning } of mergedBabyNames) {
      // If we reach the bottom of the current page, switch pages
      if (yPosition < pageLimit) {
        if (currentPage === secondPage && thirdPage) {
          // Move to third page if available
          currentPage = thirdPage;
          yPosition = 600;
        } else {
          // Clone the template's second page for further pages if both second and third pages are filled
          const [clonedPage] = await pdfDoc.copyPages(pdfDoc, [1]);
          pdfDoc.addPage(clonedPage);
          currentPage = clonedPage;
          yPosition = 600;
        }
      }

      // Draw the name and meaning on the current page
      currentPage.drawText(`Name: ${nameEnglish}`, { x: 50, y: yPosition, size: fontSize, font });
      yPosition -= 60;
      currentPage.drawText(`Meaning: ${meaning}`, { x: 50, y: yPosition, size: fontSize, font });
      yPosition -= 80;
    }
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl; // Return the generated PDF URL
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};