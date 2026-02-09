import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { DrawTool, ImageTool, TextTool } from "../store/useEditPdfStore";

interface SavePdfParams {
  file: File;
  textElements: TextTool[];
  drawElements: DrawTool[];
  imageElements: ImageTool[];
}

export const saveEditedPdf = async ({
  file,
  textElements,
  drawElements,
  imageElements,
}: SavePdfParams) => {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const textEl of textElements) {
    const page = pages[textEl.pageIndex];
    if (!page || !textEl.text) continue;

    const pdfWidth = page.getWidth();
    const pdfHeight = page.getHeight();

    const pdfX = textEl.xRatio * pdfWidth;
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

  for (const draw of drawElements) {
    const page = pages[draw.pageIndex];
    if (!page) continue;

    const pdfWidth = page.getWidth();
    const pdfHeight = page.getHeight();

    // Convert path ratios to PDF coordinates
    const pathPoints = draw.path.map((p) => ({
      x: p.x * pdfWidth,
      y: pdfHeight - p.y * pdfHeight, // invert Y
    }));

    for (let i = 0; i < pathPoints.length - 1; i++) {
      const from = pathPoints[i];
      const to = pathPoints[i + 1];
      page.drawLine({
        start: { x: from.x, y: from.y },
        end: { x: to.x, y: to.y },
        thickness: draw.width,
        color: rgb(
          draw.color[0] / 255,
          draw.color[1] / 255,
          draw.color[2] / 255
        ),
      });
    }
  }

  for (const image of imageElements) {
    const page = pages[image.pageIndex];
    if (!page) continue;

    const pdfWidth = page.getWidth();
    const pdfHeight = page.getHeight();

    page.drawImage(await pdfDoc.embedPng(image.url), {
      x: image.x * pdfWidth,
      y: image.y * pdfHeight,
      width: image.width * pdfWidth,
      height: image.height * pdfHeight,
    });
  }

  return await pdfDoc.save();
};
