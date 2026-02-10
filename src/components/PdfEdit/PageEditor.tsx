import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import * as fabric from "fabric";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
{/*pf view some error,window space reduce,  */}
interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  fabricObj?: fabric.Textbox;
}

interface PageEditorProps {
  file: File;
}

const PageEditor = ({ file }: PageEditorProps) => {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas>(null);
  const [textItems, setTextItems] = useState<TextItem[]>([]);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  // Load PDF and render first page
  useEffect(() => {
    const loadPdf = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(pdf);

      const page = await pdf.getPage(1); // for simplicity, first page
      const viewport = page.getViewport({ scale: 0.5 });

      // Render PDF to canvas
      const canvas = pdfCanvasRef.current!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;

      // Initialize Fabric.js
      const fCanvas = new fabric.Canvas("fabric-canvas", {
        width: viewport.width,
        height: viewport.height,
      });
      fabricCanvasRef.current = fCanvas;

      // Set PDF as background image
      const pdfImg = new fabric.Image(canvas, { selectable: false });
      fCanvas.backgroundImage = pdfImg;
      fCanvas.renderAll();

      // Extract text positions from PDF
      const content = await page.getTextContent();
      const items: TextItem[] = content.items
        .filter((item: any) => item.str.trim())
        .map((item: any) => {
          const x = item.transform[4];
          const y = viewport.height - item.transform[5];
          const width = item.width;
          const height = item.height;

          // Create Fabric Textbox for editable text
          const textObj = new fabric.Textbox(item.str, {
            left: x,
            top: y - height,
            width,
            height,
            fontSize: 12,
            fill: "black",
          });

          fCanvas.add(textObj);

          return {
            str: item.str,
            x,
            y,
            width,
            height,
            page: 1,
            fabricObj: textObj,
          };
        });

      setTextItems(items);
    };

    loadPdf();
  }, [file]);

  // Handle edit from sidebar
  const handleEditText = (index: number) => {
    const item = textItems[index];
    if (!item.fabricObj) return;

    const newText = prompt("Enter new text:", item.str);
    if (!newText) return;

    item.fabricObj.text = newText;
    textItems[index].str = newText;
    fabricCanvasRef.current?.renderAll();
  };

  // Handle remove text
  const handleRemoveText = (index: number) => {
    const item = textItems[index];
    if (item.fabricObj) {
      fabricCanvasRef.current?.remove(item.fabricObj);
    }
    const newItems = [...textItems];
    newItems.splice(index, 1);
    setTextItems(newItems);
  };

  // Download edited PDF
  const handleDownload = async () => {
    if (!pdfDoc) return;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const page = pdf.getPages()[0];

    // Export Fabric canvas as image
    const imgData = fabricCanvasRef.current?.toDataURL({
      multiplier: 1,
      format: "png",
    })!;
    const pngImage = await pdf.embedPng(imgData);

    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });

    const pdfBytes = await pdf.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* PDF + Fabric canvas */}
      <div style={{ position: "relative" }}>
        <canvas ref={pdfCanvasRef} style={{ display: "none" }} />
        <canvas id="fabric-canvas" style={{ border: "1px solid #ccc" }} />
        <button
          onClick={handleDownload}
          className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
        >
          Download PDF
        </button>
      </div>

      {/* Sidebar for edits */}
      <div className="w-[300px] border-l border-gray-300 p-4 h-[600px] overflow-y-auto">
        <h3 className="font-bold mb-2">Text Items</h3>
        {textItems.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center mb-2">
            <span className="text-sm">{item.str}</span>
            <div className="flex gap-2">
              <button
                className="text-blue-500 text-sm"
                onClick={() => handleEditText(idx)}
              >
                Edit
              </button>
              <button
                className="text-red-500 text-sm"
                onClick={() => handleRemoveText(idx)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageEditor;
