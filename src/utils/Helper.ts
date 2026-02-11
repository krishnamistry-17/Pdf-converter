import { PDFDocument } from "pdf-lib";

export const parsePdf = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const pages = pdfDoc.getPages().map((_page, index) => ({
    pageNumber: index + 1,
    text: "", // We'll keep text empty for now (pdf-lib doesn’t extract easily)
  }));

  return pages;
};

export const saveEditedPdf = async (
  pages: { pageNumber: number; text: string }[]
) => {
  const pdfDoc = await PDFDocument.create();

  pages.forEach((page) => {
    const pdfPage = pdfDoc.addPage();
    pdfPage.drawText(page.text || "", { x: 50, y: 700, size: 12 });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
  return blob;
};


