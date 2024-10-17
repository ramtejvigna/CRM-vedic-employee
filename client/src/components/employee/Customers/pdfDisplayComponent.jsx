import { PDFDocument, StandardFonts } from 'pdf-lib';
import pdfTemplate from "../../../assets/Template.pdf";

// Extracted generatePdf function to reuse it elsewhere
export const generatePdf = async (babyNames) => {
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


    // Embed babyNames on the second (or third) page
    let yPosition = 600;
    babyNames.forEach(({ name, meaning }, index) => {
      if (yPosition < 100 && !thirdPage) {
        // Move to third page, check if it's already present
        thirdPage = pdfDoc.addPage();  // Add third page if it doesn't exist
        yPosition = 600;
      } else if (yPosition < 100 && thirdPage) {
        // If we already have the third page, use it
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
