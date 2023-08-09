import { PDFDocument } from 'pdf-lib';
import download from "downloadjs";
import { readAsArrayBuffer } from "./asyncReader";

export async function save(pdfFile,objects,name) {
  let pdfDoc
  try {
    pdfDoc = await PDFDocument.load(
      (await readAsArrayBuffer(pdfFile))
    );
  } catch (e) {
    console.log("Failed to load PDF.");
    throw e;
  }

  const pagesProcesses = pdfDoc.getPages().map(async (page, pageIndex) => {
    const pageObjects = objects[pageIndex];

    const pageHeight = page.getHeight();
    const embedProcesses = pageObjects.map(async (object) => {
      if (object.type === "text") {
        const { x, y, placeholder, lineHeight, size, fontFamily, width } =
          object;

        if (placeholder && fontFamily) {
          const pdfFont = await pdfDoc.embedFont(fontFamily);
          return () =>
            page.drawText(placeholder, {
              maxWidth: width,
              font: pdfFont,
              size,
              lineHeight,
              x,
              y: pageHeight - size - y,
            });
        }
      }
    });
    const drawProcesses = await Promise.all(embedProcesses);
    drawProcesses.forEach((p) => p());
  });
  await Promise.all(pagesProcesses);
  try {
    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, name, "application/pdf");
  } catch (e) {
    console.log("Failed to save PDF.");
    throw e;
  }
}
