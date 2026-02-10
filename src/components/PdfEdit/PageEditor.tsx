import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb } from "pdf-lib";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface WordSelection {
  pageIndex: number;
  text: string;
  rects: { x: number; y: number; width: number; height: number }[];
}

interface PdfEditorProps {
  file: File;
}

const PdfEditor = ({ file }: PdfEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [selections, setSelections] = useState<WordSelection[]>([]);
  const [replacementText, setReplacementText] = useState("");

  // Load and render PDF pages
  useEffect(() => {
    const loadPdf = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      setPdf(pdfDoc);

      if (!containerRef.current) return;

      containerRef.current.innerHTML = ""; // clear previous render

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });

        // Canvas
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.display = "block";
        canvas.style.marginBottom = "10px";
        const context = canvas.getContext("2d")!;
        await page.render({ canvasContext: context, viewport }).promise;
        containerRef.current.appendChild(canvas);

        // Text Layer
        const textContent = await page.getTextContent();
        const textLayerDiv = document.createElement("div");
        textLayerDiv.style.position = "absolute";
        textLayerDiv.style.top = `${canvas.offsetTop}px`;
        textLayerDiv.style.left = `${canvas.offsetLeft}px`;
        textLayerDiv.style.height = `${viewport.height}px`;
        textLayerDiv.style.width = `${viewport.width}px`;
        textLayerDiv.style.pointerEvents = "auto";
        containerRef.current.appendChild(textLayerDiv);

        pdfjsLib.renderTextLayer({
          textContent,
          container: textLayerDiv,
          viewport,
          textDivs: [],
        } as any);

      
        textLayerDiv.addEventListener("click", () => {
          const selection = window.getSelection();
          if (!selection || selection.toString().trim() === "") return;

          const range = selection.getRangeAt(0);
          const rects = Array.from(range.getClientRects()).map((r) => ({
            x: r.x - canvas.offsetLeft,
            y: r.y - canvas.offsetTop,
            width: r.width,
            height: r.height,
          }));

          setSelections((prev) => [
            ...prev,
            { pageIndex: i - 1, text: selection.toString(), rects },
          ]);

          selection.removeAllRanges();
        });
      }
    };

    loadPdf();
  }, [file]);

  // Save edited PDF
  const saveEditedPdf = async () => {
    if (!pdf) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    for (const sel of selections) {
      const page = pdfDoc.getPages()[sel.pageIndex];

      // Cover original text
      sel.rects.forEach((r) => {
        page.drawRectangle({
          x: r.x,
          y: page.getHeight() - r.y - r.height,
          width: r.width,
          height: r.height,
          color: rgb(1, 1, 1),
        });
      });

      // Draw replacement
      page.drawText(replacementText || sel.text, {
        x: sel.rects[0].x,
        y: page.getHeight() - sel.rects[0].y - sel.rects[0].height,
        size: 12,
        color: rgb(0, 0, 0),
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} className="border p-2 relative"></div>

      {selections.length > 0 && (
        <div className="mt-8">
          <input
            type="text"
            placeholder="Replacement text"
            value={replacementText}
            onChange={(e) => setReplacementText(e.target.value)}
            className="border p-1 mr-2 bg-white z-30"
          />
          <button
            onClick={saveEditedPdf}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            Save PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfEditor;
