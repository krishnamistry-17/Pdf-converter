import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

interface PageEditorProps {
  file: File;
}

const PageEditor = ({ file }: PageEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textItems, setTextItems] = useState<TextItem[]>([]);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  const hasLoaded = useRef(false);
  // Load PDF and extract text
  useEffect(() => {
    if (hasLoaded.current) return;
    const loadPdf = async () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);

      const allTextItems: TextItem[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 1 });

        // Render canvas
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.display = "block";
        canvas.style.marginBottom = "10px";
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        containerRef.current.appendChild(canvas);

        // Extract text positions
        const content = await page.getTextContent();
        content.items.forEach((item: any) => {
          if (item.str.trim()) {
            allTextItems.push({
              str: item.str,
              x: item.transform[4],
              y: viewport.height - item.transform[5],
              width: item.width,
              height: item.height,
              page: i,
            });
          }
        });
      }

      setTextItems(allTextItems);
    };

    loadPdf();
  }, [file]);

  // Edit text in place
  const handleEditText = async (index: number) => {
    const newText = prompt("Enter new text:", textItems[index].str);
    if (!newText || !pdfDoc) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    const item = textItems[index];
    const page = pages[item.page - 1];

    // Cover old text
    page.drawRectangle({
      x: item.x,
      y: item.y - item.height,
      width: item.width,
      height: item.height,
      color: rgb(1, 1, 1),
    });

    // Draw new text
    page.drawText(newText, {
      x: item.x,
      y: item.y - item.height,
      size: item.height, // match original height
      font,
      color: rgb(0, 0, 0),
    });
    console.log("x", item.x);
    console.log("y", item.y);

    console.log("item", item);
    console.log("newText", newText);

    // Save updated PDF
    const pdfBytes = await pdf.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited.pdf";
    link.click();
  };

  const handleRemoveText = async (index: number) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    const item = textItems[index];
    const page = pages[item.page - 1];
    page.drawText("", {
      x: item.x,
      y: item.y - item.height,
      size: item.height,
      color: rgb(0, 0, 0),
    });
    const pdfBytes = await pdf.save();
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef}></div>

      <div style={{ marginTop: "10px" }}>
        <h3>Edit Text Items:</h3>
        {textItems.map((item, idx) => (
          <div
            key={idx}
            style={{ marginBottom: "4px" }}
            className="flex items-center gap-2"
          >
            <button
              onClick={() => handleEditText(idx)}
              className=" flex items-center gap-2 cursor-pointer"
            >
              <p> Edit: "{item.str}"</p>
              <span
                className="text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveText(idx);
                }}
              >
                Remove
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageEditor;
{
  /*// import { useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import { PDFDocument, rgb } from "pdf-lib";
// import "pdfjs-dist/web/pdf_viewer.css";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// interface Props {
//   file: File;
// }

// const PdfEditor = ({ file }: Props) => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   const hasLoadedRef = useRef(false);

//   useEffect(() => {
//     if (hasLoadedRef.current) return;
//     hasLoadedRef.current = true;

//     const loadPdf = async () => {
//       if (!containerRef.current) return;

//       containerRef.current.innerHTML = ""; // clear previous
//       const arrayBuffer = await file.arrayBuffer();
//       const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
//       const pdfDoc = await loadingTask.promise;

//       for (let i = 1; i <= pdfDoc.numPages; i++) {
//         const page = await pdfDoc.getPage(i);
//         const viewport = page.getViewport({ scale: 0.5 });

//         const canvas = document.createElement("canvas");
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         canvas.style.display = "block";
//         canvas.style.marginBottom = "10px";

//         const context = canvas.getContext("2d")!;
//         await page.render({ canvasContext: context, viewport }).promise;
//         containerRef.current.appendChild(canvas);
//       }
//     };

//     loadPdf();
//   }, [file]);

//   const handleSelectAllText = async () => {
//     const arrayBuffer = await file.arrayBuffer();
//     const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
//     const pdfDoc = await loadingTask.promise;
//     const allText: any[] = [];
//     for (let i = 1; i <= pdfDoc.numPages; i++) {
//       const page = await pdfDoc.getPage(i);
//       const content = await page.getTextContent();
//       const filteredContent = content.items.filter(
//         (item: any) => item.str !== "" && item.str !== "\n"
//       );
//       console.log("filteredContent---------", filteredContent);
//       allText.push(content);
//     }
//     console.log("allText---------", allText.join("\n"));
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <div
//         ref={containerRef}
//         className=" p-2 relative cursor-pointer rounded-md"
//       ></div>
//       <button onClick={handleSelectAllText}>Select All Text</button>
//     </div>
//   );
// };

// export default PdfEditor;
 */
}
