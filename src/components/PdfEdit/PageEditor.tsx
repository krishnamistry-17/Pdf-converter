import { useEffect, useRef, useState, useMemo } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fabric from "fabric";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TextBlock {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  text: string;
  fabricObj?: fabric.Textbox;
  pageWidth: number;
  pageHeight: number;
  originalItems: string[];
}

interface PageEditorProps {
  file: File;
}

const PageEditor = ({ file }: PageEditorProps) => {
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  console.log("textBlocks :", textBlocks);

  const [searchText, setSearchText] = useState("");

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [scale, _setScale] = useState(1);
  const [_pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });

  // Group text items into paragraphs based on vertical proximity
  const groupTextItemsIntoParagraphs = (
    items: any[],
    viewportWidth: number,
    viewportHeight: number
  ): TextBlock[] => {
    if (items.length === 0) return [];

    // Sort items by Y position (top to bottom), then by X position
    const sortedItems = [...items].sort((b, a) => {
      const yDiff = a.transform[5] - b.transform[5];
      if (Math.abs(yDiff) < 10) {
        // Same line
        return a.transform[4] - b.transform[4];
      }
      return yDiff;
    });

    const paragraphs: TextBlock[] = [];
    let currentParagraph: any[] = [];
    let lastY = sortedItems[0]?.transform[5] || 0;

    sortedItems.forEach((item, _index) => {
      const currentY = item.transform[5];
      const yDiff = Math.abs(lastY - currentY);
      const isSameLine = yDiff < 5;

      if (!isSameLine && currentParagraph.length > 0) {
        // Create paragraph from current items
        const paragraph = createParagraphBlock(
          currentParagraph,
          viewportWidth,
          viewportHeight
        );
        if (paragraph) paragraphs.push(paragraph);
        currentParagraph = [];
      }

      currentParagraph.push(item);
      lastY = currentY;
    });

    // Don't forget the last paragraph
    if (currentParagraph.length > 0) {
      const paragraph = createParagraphBlock(
        currentParagraph,
        viewportWidth,
        viewportHeight
      );
      if (paragraph) paragraphs.push(paragraph);
    }

    return paragraphs;
  };

  const createParagraphBlock = (
    items: any[],
    viewportWidth: number,
    viewportHeight: number
  ): TextBlock | null => {
    if (items.length === 0) return null;

    const combinedText = items
      .map((item) => item.str)
      .join(" ")
      .trim();
    if (!combinedText) return null;

    // Calculate bounding box
    const minX = Math.min(...items.map((item) => item.transform[4]));
    const maxX = Math.max(
      ...items.map((item) => item.transform[4] + item.width)
    );
    const minY = Math.min(...items.map((item) => item.transform[5]));
    const maxY = Math.max(
      ...items.map((item) => item.transform[5] + item.height)
    );

    const x = minX;
    const y = viewportHeight - maxY; // Convert to canvas coordinates
    const width = maxX - minX;
    const height = maxY - minY;
    const fontSize = items.reduce(
      (max, item) => Math.max(max, item.height || 12),
      12
    );

    return {
      id: `paragraph-${fontSize}-${Date.now()}`,
      page: 1,
      x,
      y,
      width,
      height,
      fontSize,
      text: combinedText,
      pageWidth: viewportWidth,
      pageHeight: viewportHeight,
      originalItems: items.map((item) => item.str),
    };
  };

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale });

        // Update PDF dimensions
        setPdfDimensions({ width: viewport.width, height: viewport.height });

        // Temp canvas to render PDF image
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d")!;
        tempCanvas.width = viewport.width;
        tempCanvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Create Fabric canvas
        const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
          width: viewport.width,
          height: viewport.height,
          preserveObjectStacking: true,
          selection: true,
        });

        fabricRef.current = fabricCanvas;

        // Set PDF image as background
        const bgImage = new fabric.Image(tempCanvas, {
          left: 0,
          top: 0,
          width: viewport.width,
          height: viewport.height,
          originX: "left",
          originY: "top",
          selectable: false,
          evented: false,
        });
        fabricCanvas.backgroundImage = bgImage;
        fabricCanvas.renderAll();

        // Extract text and group into paragraphs
        const textContent = await page.getTextContent();
        const items = textContent.items.filter((item: any) => item.str?.trim());

        const blocks = groupTextItemsIntoParagraphs(
          items,
          viewport.width,
          viewport.height
        );

        // Create Fabric.Textbox objects for each paragraph
        blocks.forEach((block) => {
          const textbox = new fabric.Textbox(block.text, {
            left: block.x,
            top: block.y,
            width: block.width,
            fontSize: block.fontSize,
            fill: "black",
            originX: "left",
            originY: "top",
            backgroundColor: "rgba(255, 255, 0, 0.1)",
            editable: true,
            splitByGrapheme: false,
            textAlign: "left",
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            hasControls: false,
            hasBorders: false,
            hoverCursor: "text",
          });

          // Add event listeners
          textbox.on("editing:exited", () => {
            const blockIndex = textBlocks.findIndex((b) => b.id === block.id);
            if (blockIndex !== -1) {
              updateTextBlock(blockIndex, textbox.text);
            }
          });

          textbox.on("selected", () => {
            setSelectedBlockId(block.id);
          });

          textbox.on("deselected", () => {
            setSelectedBlockId(null);
          });

          block.fabricObj = textbox;
        });

        setTextBlocks(blocks);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, [file]);

  // Filter blocks based on search text
  const filteredBlocks = useMemo(() => {
    if (!searchText.trim()) return textBlocks;
    const searchLower = searchText.toLowerCase();
    return textBlocks.filter((block) =>
      block.text.toLowerCase().includes(searchLower)
    );
  }, [textBlocks, searchText]);

  // Update text block and sync with canvas
  const updateTextBlock = (index: number, newText: string) => {
    const blocks = [...textBlocks];
    const block = blocks[index];

    if (!block) return;

    block.text = newText;

    const fabricCanvas = fabricRef.current;
    const obj = block.fabricObj;

    if (obj) {
      obj.set({ text: newText });
      obj.setCoords();
      fabricCanvas?.renderAll();
    }

    setTextBlocks(blocks);
  };

  // Handle click on search result to highlight on canvas
  const handleResultClick = (blockId: string) => {
    const fabricCanvas = fabricRef.current;
    const block = textBlocks.find((b) => b.id === blockId);

    if (block?.fabricObj && fabricCanvas) {
      fabricCanvas.setActiveObject(block.fabricObj);
      fabricCanvas.renderAll();
      setSelectedBlockId(blockId);

      // Highlight the selected block with a border
      block.fabricObj.set({ stroke: "blue", strokeWidth: 2 });
      fabricCanvas.renderAll();
    }
  };

  // Handle canvas selection change
  useEffect(() => {
    const fabricCanvas = fabricRef.current;
    if (!fabricCanvas) return;

    const handleSelection = () => {
      const activeObj = fabricCanvas.getActiveObject();
      if (activeObj && activeObj instanceof fabric.Textbox) {
        const block = textBlocks.find((b) => b.fabricObj === activeObj);
        if (block) {
          setSelectedBlockId(block.id);
        }
      } else {
        setSelectedBlockId(null);
      }
    };

    fabricCanvas.on("selection:created", handleSelection);
    fabricCanvas.on("selection:updated", handleSelection);
    fabricCanvas.on("selection:cleared", handleSelection);

    return () => {
      fabricCanvas.off("selection:created", handleSelection);
      fabricCanvas.off("selection:updated", handleSelection);
      fabricCanvas.off("selection:cleared", handleSelection);
    };
  }, [textBlocks]);

  // Highlight search matches on canvas
  useEffect(() => {
    const fabricCanvas = fabricRef.current;
    if (!fabricCanvas) return;

    // Get all textbox objects from canvas
    const textboxObjects = fabricCanvas
      .getObjects()
      .filter((obj) => obj instanceof fabric.Textbox) as fabric.Textbox[];

    if (textboxObjects.length === 0) {
      // Canvas objects not ready yet, try again shortly
      const timeoutId = setTimeout(() => {
        fabricCanvas.renderAll();
      }, 100);
      return () => clearTimeout(timeoutId);
    }

    textboxObjects.forEach((obj) => {
      if (searchText.trim()) {
        const searchLower = searchText.toLowerCase();
        const text = (obj.text || "").toLowerCase();
        if (text.includes(searchLower)) {
          obj.set({ backgroundColor: "rgba(255, 255, 0, 0.3)" });
        } else {
          obj.set({ backgroundColor: "rgba(255, 255, 255, 0.1)" });
        }
      } else {
        obj.set({ backgroundColor: "rgba(255, 255, 255, 0.1)" });
      }
    });

    fabricCanvas.renderAll();
  }, [searchText, textBlocks.length]); // Only depend on length to avoid reference issues

  const handleDownload = async () => {
    if (!fabricRef.current) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const page = pdfDoc.getPages()[0];
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const { width: _pageWidth, height: pageHeight } = page.getSize();

      // Draw updated text blocks
      textBlocks.forEach((block) => {
        if (block.fabricObj) {
          // Get the actual rendered text with proper wrapping
          const text = block.fabricObj.text || block.text;

          // Convert canvas y-coordinate back to PDF y-coordinate
          const pdfY =
            block.fabricObj.top !== undefined
              ? pageHeight -
                block.fabricObj.top -
                (block.fabricObj.height || block.fontSize)
              : block.pageHeight - block.y - block.fontSize;

          page.drawText(text, {
            x:
              block.fabricObj.left !== undefined
                ? block.fabricObj.left
                : block.x,
            y: pdfY > 0 ? pdfY : 0,
            size: block.fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: block.fabricObj.width || block.width,
          });
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "edited.pdf";
      link.click();
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  };

  // Calculate textarea rows based on text length
  const getTextareaRows = (text: string): number => {
    const avgCharsPerLine = 40;
    const lines = Math.ceil(text.length / avgCharsPerLine);
    return Math.min(Math.max(lines, 2), 20); // Min 2 rows, max 20 rows
  };

  // Highlight search text in sidebar
  const highlightSearchText = (text: string): React.ReactNode => {
    if (!searchText.trim()) return text;

    const parts = text.split(new RegExp(`(${searchText})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchText.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Main editor */}
      <div
        ref={containerRef}
        className="flex-1 border rounded shadow overflow-auto flex justify-center bg-gray-100 p-4"
      >
        <canvas ref={canvasRef} className="border shadow-lg" />
      </div>

      {/* Sidebar */}
      <aside className="w-80 border-l p-4 overflow-auto bg-white">
        <h3 className="font-bold mb-2 text-lg">Editable Text</h3>

        {/* Search input */}
        <div className="my-2">
          <input
            type="search"
            placeholder="Search by text..."
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <p className="text-xs text-gray-500 mt-1">
            {searchText
              ? `Found ${filteredBlocks.length} matches`
              : `Total ${textBlocks.length} paragraphs`}
          </p>
        </div>

        {/* Results */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto my-4">
          {filteredBlocks.length > 0 ? (
            <div className="space-y-3">
              {filteredBlocks.map((block, idx) => (
                <div
                  key={block.id}
                  className={`border rounded p-2 transition-colors ${
                    selectedBlockId === block.id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  } ${searchText ? "cursor-pointer" : ""}`}
                  onClick={() => searchText && handleResultClick(block.id)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">
                      Paragraph {idx + 1}
                    </span>
                    <span className="text-xs text-gray-400">
                      {block.text.length} chars
                    </span>
                  </div>

                  {/* Show highlighted search text */}
                  <div className="text-sm text-gray-700 mb-2 break-words">
                    {highlightSearchText(block.text)}
                  </div>

                  {/* Editable textarea */}
                  <textarea
                    value={block.text}
                    onChange={(e) => {
                      const originalIndex = textBlocks.findIndex(
                        (b) => b.id === block.id
                      );
                      if (originalIndex !== -1) {
                        updateTextBlock(originalIndex, e.target.value);
                      }
                    }}
                    className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={getTextareaRows(block.text)}
                    placeholder="Edit text here..."
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {searchText ? (
                <>
                  <p>No matches found</p>
                  <p className="text-sm">Try a different search term</p>
                </>
              ) : (
                <p>No text found in PDF</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
            disabled={textBlocks.length === 0}
          >
            Download Edited PDF
          </button>
        </div>
      </aside>
    </div>
  );
};

export default PageEditor;

// Generate a React component for a PDF editor with the following features:

// 1. Load a PDF file and render the first page on a Fabric.js canvas.
// 2. Extract all text blocks from the PDF using pdfjs-dist.
// 3. Display the text blocks in a sidebar with a search input.
// 4. When the user types in the search box, filter the text blocks.
// 5. On the canvas, highlight only the filtered text blocks:
//    - Black text color
//    - White background (hiding the original PDF text underneath)
//    - Maintain the original position and font size.
// 6. Support multi-line paragraphs: split long text into words and wrap properly inside Fabric Textbox.
// 7. Update the canvas live as the user edits text in the sidebar.
// 8. Include a "Download PDF" button that:
//    - Draws the updated text blocks with proper wrapping using pdf-lib
//    - Embeds any Fabric annotations as PNG
//    - Saves the PDF for download.
// 9. Use React functional components with hooks (`useState`, `useEffect`, `useRef`).
// 10. Ensure proper cleanup so that switching routes resets the state.

// Provide the complete component code with all imports, type definitions, and Fabric.js integration.

// import { useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import * as fabric from "fabric";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// interface TextBlock {
//   id: string;
//   page: number;
//   x: number;
//   y: number;
//   fontSize: number;
//   text: string;
//   fabricObj?: fabric.IText;
// }

// interface PageEditorProps {
//   file: File;
// }

// const PageEditor = ({ file }: PageEditorProps) => {
//   const fabricRef = useRef<fabric.Canvas | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);

//   useEffect(() => {
//     const loadPdf = async () => {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//       const page = await pdf.getPage(1);

//       const scale = 1;
//       const viewport = page.getViewport({ scale });

//       // Temp canvas to render PDF image
//       const tempCanvas = document.createElement("canvas");
//       const ctx = tempCanvas.getContext("2d")!;
//       tempCanvas.width = viewport.width;
//       tempCanvas.height = viewport.height;

//       await page.render({ canvasContext: ctx, viewport }).promise;

//       // Create Fabric canvas same size
//       const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
//         width: viewport.width,
//         height: viewport.height,
//         preserveObjectStacking: true,
//       });

//       fabricRef.current = fabricCanvas;

//       // Set PDF image as background
//       const bgImage = new fabric.Image(tempCanvas, {
//         left: 0,
//         top: 0,
//         width: viewport.width,
//         height: viewport.height,
//         originX: "left",
//         originY: "top",
//         selectable: false,
//         evented: false,
//       });
//       fabricCanvas.backgroundImage = bgImage;
//       fabricCanvas.renderAll();

//       // Extract text for sidebar
//       const textContent = await page.getTextContent();
//       const blocks: TextBlock[] = textContent.items
//         .filter((item: any) => item.str.trim())
//         .map((item: any, idx: number) => {
//           const [a, b, c, d, e, f] = item.transform;
//           const x = e;
//           const y = viewport.height - f;

//           // Create IText but only show updated text later
//           const textbox = new fabric.IText(item.str, {
//             left: x,
//             top: y - item.height, // adjust to top-left
//             fontSize: item.height,
//             fill: "black",
//             originX: "left",
//             originY: "top",
//             backgroundColor: "white",
//             editable: false,
//           });
//           // Don't add original text yet
//           return {
//             id: `${idx}`,
//             page: 1,
//             x,
//             y,
//             fontSize: item.height,
//             text: item.str,
//             fabricObj: textbox,
//           };
//         });

//       setTextBlocks(blocks);
//     };

//     loadPdf();
//   }, [file]);

//   // Update sidebar text and reflect on canvas
//   const updateTextBlock = (index: number, newText: string) => {
//     const blocks = [...textBlocks];
//     blocks[index].text = newText;

//     const fabricCanvas = fabricRef.current;
//     const obj = blocks[index].fabricObj;

//     if (obj) {
//       obj.text = newText;
//       if (!fabricCanvas?.getObjects().includes(obj)) {
//         fabricCanvas?.add(obj);
//       }
//       fabricCanvas?.renderAll();
//     }

//     setTextBlocks(blocks);
//   };

//   const handleDownload = async () => {
//     if (!fabricRef.current) return;

//     const arrayBuffer = await file.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(arrayBuffer);
//     const page = pdfDoc.getPages()[0];
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     // Draw updated text blocks
//     textBlocks.forEach((block) => {
//       const pdfY = page.getHeight() - block.y - block.fontSize; // Convert top-left to bottom-left
//       page.drawText(block.text, {
//         x: block.x,
//         y: pdfY,
//         size: block.fontSize,
//         font,
//         color: rgb(0, 0, 0),
//       });
//     });

//     const pdfBytes = await pdfDoc.save();
//     const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "edited.pdf";
//     link.click();
//   };

//   return (
//     <div className="flex gap-6">
//       {/* Main editor */}
//       <div className="flex-1 border rounded shadow overflow-auto flex justify-center">
//         <canvas ref={canvasRef} className="border" />
//       </div>

//       {/* Sidebar */}
//       <aside className="w-80 border-l p-4 overflow-auto">
//         <h3 className="font-bold mb-2">Editable Text</h3>
//         {textBlocks.map((block, idx) => (
//           <div key={block.id} className="mb-2">
//             <textarea
//               value={block.text}
//               onChange={(e) => updateTextBlock(idx, e.target.value)}
//               className="w-full border p-1 rounded"
//             />
//           </div>
//         ))}
//         <button
//           onClick={handleDownload}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Download PDF
//         </button>
//       </aside>
//     </div>
//   );
// };

// export default PageEditor;

//-----------
// import { useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import { PDFDocument, StandardFonts, rgb, PDFPage } from "pdf-lib";
// import * as fabric from "fabric";
// import { FabricText } from "fabric";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// FabricText.ownDefaults.fontFamily = "inter";
// interface TextBlock {
//   id: string;
//   page: number;
//   x: number;
//   y: number;
//   fontSize: number;
//   text: string;
//   width?: number; // optional wrap width for long paragraphs
// }

// interface PageEditorProps {
//   file: File;
// }

// const PageEditor = ({ file }: PageEditorProps) => {
//   const fabricRef = useRef<fabric.Canvas | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
//   const [searchText, setSearchText] = useState("");

//   console.log(searchText);

//   useEffect(() => {
//     const loadPdf = async () => {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//       const page = await pdf.getPage(1);

//       const scale = 1;
//       const viewport = page.getViewport({ scale });

//       // Temp canvas to render PDF page
//       const tempCanvas = document.createElement("canvas");
//       const ctx = tempCanvas.getContext("2d")!;
//       tempCanvas.width = viewport.width;
//       tempCanvas.height = viewport.height;
//       await page.render({ canvasContext: ctx, viewport }).promise;

//       // Fabric canvas
//       const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
//         width: viewport.width,
//         height: viewport.height,
//         preserveObjectStacking: true,
//       });
//       fabricRef.current = fabricCanvas;

//       // Set PDF as Fabric background
//       const bgImage = new fabric.Image(tempCanvas, {
//         left: 0,
//         top: 0,
//         width: viewport.width,
//         height: viewport.height,
//         selectable: false,
//         evented: false,
//         originX: "left",
//         originY: "top",
//       });
//       fabricCanvas.backgroundImage = bgImage;
//       fabricCanvas.renderAll();

//       // Extract text for sidebar
//       const textContent = await page.getTextContent();
//       const blocks: TextBlock[] = textContent.items
//         .filter((item: any) => item.str.trim())
//         .map((item: any, idx: number) => {
//           const [a, b, c, d, e, f] = item.transform;
//           return {
//             id: `${idx}`,
//             page: 1,
//             x: e,
//             y: viewport.height - f - item.height,
//             fontSize: item.height,
//             fill: "black",
//             backgroundColor: "white",
//             text: item.str,
//             width: 500, // default wrap width
//           };
//         });
//       setTextBlocks(blocks);
//     };

//     loadPdf();
//   }, [file]);

//   const updateTextBlock = (index: number, newText: string) => {
//     const blocks = [...textBlocks];
//     blocks[index].text = newText;
//     setTextBlocks(blocks);
//     console.log("blocks", blocks);
//     console.log("newText", newText);
//     console.log(textBlocks.length);
//     // Update Fabric canvas
//     const fCanvas = fabricRef.current;
//     if (!fCanvas) return;

//     // Remove existing object with same ID
//     const existing = fCanvas
//       .getObjects()
//       .find((obj: any) => obj.id === blocks[index].id);
//     if (existing) fCanvas.remove(existing);
//     // Add new Fabric textbox
//     const textbox = new fabric.Textbox(newText, {
//       left: blocks[index].x,
//       top: blocks[index].y,
//       width: blocks[index].width,
//       fontSize: blocks[index].fontSize,
//       fill: "black",
//       backgroundColor: "white",
//       id: blocks[index].id,
//       editable: true,
//     });
//     fCanvas.add(textbox);
//     fCanvas.renderAll();
//   };

//   const drawWrappedText = (
//     page: PDFPage,
//     text: string,
//     x: number,
//     y: number,
//     fontSize: number,
//     font: any,
//     maxWidth: number
//   ) => {
//     const words = text.split(" ");
//     let line = "";
//     let currentY = y;
//     console.log("words", words);

//     for (let n = 0; n < words.length; n++) {
//       const testLine = line ? line + " " + words[n] : words[n];
//       const testWidth = font.widthOfTextAtSize(testLine, fontSize);
//       if (testWidth > maxWidth && line) {
//         page.drawText(line, {
//           x,
//           y: currentY,
//           size: fontSize,
//           font,
//           color: rgb(0, 0, 0),
//         });
//         line = words[n];
//         currentY -= fontSize * 1.2;
//       } else {
//         line = testLine;
//       }
//     }
//   };

//   const handleDownload = async () => {
//     if (!fabricRef.current) return;
//     const arrayBuffer = await file.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(arrayBuffer);
//     const pages = pdfDoc.getPages();
//     const page = pages[0];
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     // Draw textBlocks (sidebar edits) with wrapping
//     textBlocks.forEach((block) => {
//       const pdfY = page.getHeight() - block.y - block.fontSize;
//       drawWrappedText(
//         page,
//         block.text,
//         block.x,
//         pdfY,
//         block.fontSize,
//         font,
//         block.width || 300
//       );
//     });

//     // Add Fabric annotations (drawn on canvas)
//     const fCanvas = fabricRef.current;
//     const dataUrl = fCanvas.toDataURL({ format: "png", multiplier: 1 });
//     const pngImage = await pdfDoc.embedPng(dataUrl);

//     page.drawImage(pngImage, {
//       x: 0,
//       y: 0,
//       width: page.getWidth(),
//       height: page.getHeight(),
//     });

//     const pdfBytes = await pdfDoc.save();
//     const blob = new Blob([new Uint8Array(pdfBytes)], {
//       type: "application/pdf",
//     });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "edited.pdf";
//     link.click();
//     setSearchText("");
//   };

//   return (
//     <div className="flex gap-6">
//       {/* Main editor */}
//       <div className="flex-1 border rounded shadow overflow-auto flex justify-center">
//         <canvas ref={canvasRef} className="border" />
//       </div>

//       {/* Sidebar */}
//       <aside className="w-80 border-l p-4 overflow-auto">
//         <h3 className="font-bold mb-2">Editable Text</h3>
//         <div className="my-2">
//           <input
//             type="search"
//             placeholder="Search by text"
//             className="w-full border p-2 rounded"
//             onChange={(e) => setSearchText(e.target.value)}
//             value={searchText}
//           />
//         </div>

//         {searchText.length > 0 ? (
//           <>
//             <div className="max-h-[500px] overflow-y-auto my-4 border rounded p-2">
//               {textBlocks
//                 .filter((block) =>
//                   block.text.toLowerCase().includes(searchText.toLowerCase())
//                 )
//                 .map((block, idx) => (
//                   <div key={block.id} className="mb-2">
//                     <textarea
//                       value={block.text}
//                       onChange={(e) => updateTextBlock(idx, e.target.value)}
//                       className="w-full border p-1 rounded"
//                       rows={Math.ceil(block.text.length / 40)}
//                     />
//                   </div>
//                 ))}
//             </div>
//           </>
//         ) : (
//           <>
//             <p>No text found</p>
//           </>
//         )}

//         <button
//           onClick={handleDownload}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Download PDF
//         </button>
//       </aside>
//     </div>
//   );
// };

// export default PageEditor;

// //search

///-------------
// //second search
// import { useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import * as fabric from "fabric";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// interface TextBlock {
//   id: string;
//   page: number;
//   x: number;
//   y: number;
//   fontSize: number;
//   text: string;
//   fabricObj?: fabric.IText;
// }

// interface PageEditorProps {
//   file: File;
// }

// const PageEditor = ({ file }: PageEditorProps) => {
//   const fabricRef = useRef<fabric.Canvas | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     const loadPdf = async () => {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//       const page = await pdf.getPage(1);

//       const scale = 1;
//       const viewport = page.getViewport({ scale });

//       // Temp canvas to render PDF image
//       const tempCanvas = document.createElement("canvas");
//       const ctx = tempCanvas.getContext("2d")!;
//       tempCanvas.width = viewport.width;
//       tempCanvas.height = viewport.height;

//       await page.render({ canvasContext: ctx, viewport }).promise;

//       // Create Fabric canvas same size
//       const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
//         width: viewport.width,
//         height: viewport.height,
//         preserveObjectStacking: true,
//       });

//       fabricRef.current = fabricCanvas;

//       // Set PDF image as background
//       const bgImage = new fabric.Image(tempCanvas, {
//         left: 0,
//         top: 0,
//         width: viewport.width,
//         height: viewport.height,
//         originX: "left",
//         originY: "top",
//         selectable: false,
//         evented: false,
//       });
//       fabricCanvas.backgroundImage = bgImage;
//       fabricCanvas.renderAll();

//       // Extract text for sidebar
//       const textContent = await page.getTextContent();
//       const blocks: TextBlock[] = textContent.items
//         .filter((item: any) => item.str.trim())
//         .map((item: any, idx: number) => {
//           const [a, b, c, d, e, f] = item.transform;
//           const x = e;
//           const y = viewport.height - f;

//           // Create IText but only show updated text later
//           const textbox = new fabric.IText(item.str, {
//             left: x,
//             top: y - item.height, // adjust to top-left
//             fontSize: item.height,
//             fill: "black",
//             originX: "left",
//             originY: "top",
//             backgroundColor: "white",
//             editable: false,
//           });
//           // Don't add original text yet
//           return {
//             id: `${idx}`,
//             page: 1,
//             x,
//             y,
//             fontSize: item.height,
//             text: item.str,
//             fabricObj: textbox,
//           };
//         });

//       setTextBlocks(blocks);
//     };

//     loadPdf();
//   }, [file]);

//   // Update sidebar text and reflect on canvas
//   const updateTextBlock = (index: number, newText: string) => {
//     const blocks = [...textBlocks];
//     blocks[index].text = newText;

//     const fabricCanvas = fabricRef.current;
//     const obj = blocks[index].fabricObj;

//     if (obj) {
//       obj.text = newText;
//       if (!fabricCanvas?.getObjects().includes(obj)) {
//         fabricCanvas?.add(obj);
//       }
//       fabricCanvas?.renderAll();
//     }

//     setTextBlocks(blocks);
//   };

//   const handleDownload = async () => {
//     if (!fabricRef.current) return;

//     const arrayBuffer = await file.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(arrayBuffer);
//     const page = pdfDoc.getPages()[0];
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     // Draw updated text blocks
//     textBlocks.forEach((block) => {
//       const pdfY = page.getHeight() - block.y - block.fontSize; // Convert top-left to bottom-left
//       page.drawText(block.text, {
//         x: block.x,
//         y: pdfY,
//         size: block.fontSize,
//         font,
//         color: rgb(0, 0, 0),
//       });
//     });

//     const pdfBytes = await pdfDoc.save();
//     const blob = new Blob([new Uint8Array(pdfBytes)], {
//       type: "application/pdf",
//     });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "edited.pdf";
//     link.click();
//   };

//   return (
//     <div className="flex gap-6">
//       {/* Main editor */}
//       <div className="flex-1 border rounded shadow overflow-auto flex justify-center">
//         <canvas ref={canvasRef} className="border" />
//       </div>

//       {/* Sidebar */}
//       <aside className="w-80 border-l p-4 overflow-auto">
//         <h3 className="font-bold mb-2">Editable Text</h3>
//         <div className="my-2">
//           <input
//             type="search"
//             placeholder="Search by text"
//             className="w-full border p-2 rounded"
//             onChange={(e) => setSearchText(e.target.value)}
//             value={searchText}
//           />
//         </div>

//         {searchText.length > 0 ? (
//           <>
//             <div className="max-h-[500px] overflow-y-auto my-4 border rounded p-2">
//               {textBlocks
//                 .filter((block) =>
//                   block.text.toLowerCase().includes(searchText.toLowerCase())
//                 )
//                 .map((block, idx) => (
//                   <div key={block.id} className="mb-2">
//                     <textarea
//                       value={block.text}
//                       onChange={(e) => updateTextBlock(idx, e.target.value)}
//                       className="w-full border p-1 rounded"
//                       rows={Math.ceil(block.text.length / 40)}
//                     />
//                   </div>
//                 ))}
//             </div>
//           </>
//         ) : (
//           <>
//             <p>No text found</p>
//           </>
//         )}

//         <button
//           onClick={handleDownload}
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Download PDF
//         </button>
//       </aside>
//     </div>
//   );
// };

// export default PageEditor;
