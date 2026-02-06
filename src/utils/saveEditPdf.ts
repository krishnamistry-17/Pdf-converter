import { PDFDocument, rgb } from "pdf-lib";
import type { TextTool } from "../store/useEditPdfStore";

interface SavePdfParams {
  file: File;
  textElements: TextTool[];
  pageImages: HTMLImageElement[]; 
}

export const saveEditedPdf = async ({
  file,
  textElements,
  pageImages,
}: SavePdfParams) => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pages = pdfDoc.getPages();

  for (const textEl of textElements) {
    const page = pages[textEl.pageIndex];
    const image = pageImages[textEl.pageIndex];

    if (!page || !image) continue;

    // DOM image size
    const imgWidth = image.clientWidth;
    const imgHeight = image.clientHeight;

    // PDF page size
    const pdfWidth = page.getWidth();
    const pdfHeight = page.getHeight();

    // DOM → PDF conversion
    const pdfX = (textEl.x / imgWidth) * pdfWidth;
    const pdfY =
      pdfHeight - (textEl.y / imgHeight) * pdfHeight - textEl.fontSize;

    page.drawText(textEl.text, {
      x: pdfX,
      y: pdfY,
      size: textEl.fontSize,
      color: rgb(0, 0, 0),
    });
  }

  const editedPdfBytes = await pdfDoc.save();
  return editedPdfBytes;
};
