import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { TextTool } from "../store/useEditPdfStore";

interface SavePdfParams {
  file: File;
  textElements: TextTool[];
}

export const saveEditedPdf = async ({ file, textElements }: SavePdfParams) => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const textEl of textElements) {
    console.log("textEl----------saveEditPdf", textElements);
    const page = pages[textEl.pageIndex];
    if (!page || !textEl.text) continue;

    const pdfWidth = page.getWidth();
    const pdfHeight = page.getHeight();

    const pdfX = textEl.xRatio * pdfWidth;
    console.log("pdfX----------saveEditPdf", pdfX);
    const pdfFontSize = Number.isFinite(textEl.fontSizeRatio)
      ? textEl.fontSizeRatio * pdfHeight
      : 12; // fallback font size

    const pdfY = pdfHeight - textEl.yRatio * pdfHeight - pdfFontSize;

    page.drawText(textEl.text, {
      x: pdfX,
      y: pdfY,
      size: pdfFontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return await pdfDoc.save();
};
