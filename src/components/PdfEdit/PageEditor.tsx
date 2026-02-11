import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import * as fabric from "fabric";
import { FabricText } from "fabric";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PageEditorProps {
  file: File;
}

FabricText.ownDefaults.fontFamily = "inter";

const PageEditor = ({ file }: PageEditorProps) => {
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadPdf = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const scale = 1;
      const viewport = page.getViewport({ scale });

      // Create temp canvas for PDF render
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d")!;

      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;
      console.log("tempCanvas.width", tempCanvas.width);
      console.log("tempCanvas.height", tempCanvas.height);
      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      // Create Fabric canvas EXACT same size
      const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
        width: viewport.width,
        height: viewport.height,
      });

      fabricRef.current = fabricCanvas;

      console.log("viewport.width", viewport.width);
      console.log("viewport.height", viewport.height);

      // Add PDF as locked image
      const bgImage = new fabric.Image(tempCanvas, {
        left: 0,
        top: 0,
        width: viewport.width,
        height: viewport.height,
        originX: "left",
        originY: "top",
        selectable: false,
        evented: false,
        backgroundColor: "transparent",
      });
      console.log("bgImage.width", bgImage.width);
      console.log("bgImage.height", bgImage.height);

      fabricCanvas.add(bgImage);
      fabricCanvas.sendObjectToBack(bgImage);

      // Extract text
      const textContent = await page.getTextContent();

      textContent.items.forEach((item: any) => {
        if (!item.str.trim()) return;

        const [a, b, c, d, e, f] = item.transform;

        //e is the x position of the text
        const x = e;
        const y = viewport.height - f;

        const textbox = new fabric.IText(item.str, {
          left: x,
          top: viewport.height - f - item.height,
          fontSize: item.height,
          fill: "black",
          backgroundColor: "white", // hides original text
          editable: true,
        });

        fabricCanvas.add(textbox);
      });

      fabricCanvas.renderAll();
    };

    loadPdf();
  }, [file]);

  const handleDownload = async () => {
    if (!fabricRef.current) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const page = pdfDoc.getPages()[0];

    const png = fabricRef.current.toDataURL({
      format: "png",
      multiplier: 1,
    });

    const image = await pdfDoc.embedPng(png);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });

    const bytes = await pdfDoc.save();

    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited.pdf";
    link.click();
  };

  return (
    <div>
      <div className="w-full overflow-auto flex flex-col gap-4 justify-center">
        <canvas ref={canvasRef} className=" " />
        <button
          onClick={handleDownload}
          className="bg-primary text-white px-4 py-2 rounded-md transition w-full max-w-xs mx-auto"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PageEditor;
