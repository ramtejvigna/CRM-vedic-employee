import { PDFDocument, StandardFonts } from 'pdf-lib';
import pdfTemplate from "../../../assets/Template.pdf";

// Extracted generatePdf function to reuse it elsewhere
export const generatePdf = async (babyNames, additionalBabyNames) => {
  try {
    const pdfTemplateBytes = await fetch(pdfTemplate).then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.arrayBuffer();
    });

    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 25;
    const lineSpacing = 40;
    const lineSpacing1 = 52;
    const firstPage = pdfDoc.getPage(0);
    let secondPage = pdfDoc.getPage(1);
    let thirdPage = pdfDoc.getPageCount() > 2 ? pdfDoc.getPage(2) : null;

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
    firstPage.drawText(staticData.gender, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing;
    firstPage.drawText(staticData.birthDate, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing;
    firstPage.drawText(staticData.birthTime, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing;
    firstPage.drawText(staticData.zodiacSign, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing;
    firstPage.drawText(staticData.nakshatra, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing;
    firstPage.drawText(staticData.destinyNumber.toString(), { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing;
    firstPage.drawText(staticData.luckyDay, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing1;
    firstPage.drawText(staticData.gemstone, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing1;
    firstPage.drawText(staticData.luckyGod, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing1;
    firstPage.drawText(staticData.luckyMetal, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing1;
    firstPage.drawText(staticData.luckyColour, { x: 320, y: textYPosition, size: fontSize, font });
    textYPosition -= lineSpacing1;
    firstPage.drawText(staticData.numerology.toString(), { x: 320, y: textYPosition, size: fontSize, font });

    // Combine babyNames and AdditionalBabyNames
    const allBabyNames = [...babyNames, ...additionalBabyNames];
    
    
    // Embed allBabyNames on the second (or third) page
    let yPosition = 600;
    allBabyNames.forEach(({ name, meaning }, index) => {
      if (yPosition < 100 && !thirdPage) {
        // Move to third page if needed
        thirdPage = pdfDoc.addPage();
        yPosition = 600;
      } else if (yPosition < 100 && thirdPage) {
        // Use third page if it already exists
        secondPage = thirdPage;
        yPosition = 600;
      }

      // Draw text on the current page (either second or third)
      secondPage.drawText(`Name: ${name}`, { x: 50, y: yPosition, size: fontSize, font });
      yPosition -= 60;
      secondPage.drawText(`Meaning: ${meaning}`, { x: 50, y: yPosition, size: fontSize, font });
      yPosition -= 80;
    });

    // Save the PDF and return Blob URL
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl; // Return the generated PDF URL
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
