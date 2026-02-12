import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import * as fabric from "fabric";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TextBlock {
  id: string;
  page: number;
  x: number;
  y: number;
  fontSize: number;
  text: string;
  fabricObj?: fabric.IText;
  originalText: string;
}
interface PageEditorProps {
  file: File;
}

const PageEditor = ({ file }: PageEditorProps) => {
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Derived search results from textBlocks
  const searchResults = textBlocks.filter(
    (block) =>
      searchQuery.trim() &&
      block.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadPdf = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const scale = 1;
      const viewport = page.getViewport({ scale });

      // Temp canvas to render PDF image
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d")!;
      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;

      console.log("viewport width", viewport.width);
      console.log("viewport height", viewport.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      // Create Fabric canvas same size
      const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
        width: viewport.width,
        height: viewport.height,
        preserveObjectStacking: true,
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

      // Extract text for sidebar
      const textContent = await page.getTextContent();
      const blocks: TextBlock[] = textContent.items
        .filter((item: any) => item.str.trim())
        .map((item: any, idx: number) => {
          const [_a, _b, _c, _d, e, f] = item.transform;
          const x = e;
          const y = viewport.height - f;

          return {
            id: `${idx}`,
            page: 1,
            x,
            y,
            fontSize: item.height,
            text: item.str,
            originalText: item.str,
          };
        });
      setTextBlocks(blocks);
      fabricCanvas.renderAll();
    };

    loadPdf();
  }, [file]);

  const updateTextBlock = (id: string, newText: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    setTextBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id !== id) return block;

        // If text is empty → remove from canvas
        if (!newText.trim()) {
          if (block.fabricObj) {
            canvas.remove(block.fabricObj);
            canvas.renderAll();
          }

          return { ...block, text: newText, fabricObj: undefined };
        }

        // If object already exists → update it
        if (block.fabricObj) {
          block.fabricObj.set("text", newText);
          canvas.renderAll();
          return { ...block, text: newText };
        }

        // If first time editing → create it
        const textbox = new fabric.IText(newText, {
          left: block.x,
          top: block.y - block.fontSize,
          fontSize: block.fontSize,
          fill: "black",
          originX: "left",
          originY: "top",
          backgroundColor: "white",
          editable: false,
        });

        canvas.add(textbox);
        canvas.renderAll();

        return { ...block, text: newText, fabricObj: textbox };
      })
    );
  };

  // Search functionality - now just sets the query, results are derived
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSelectedBlockId(null);
  };

  // Navigate to search result on canvas
  const scrollToResult = (block: TextBlock) => {
    setSelectedBlockId(block.id);
    const canvas = fabricRef.current;
    if (canvas && block.fabricObj) {
      // First clear previous highlights
      canvas.getObjects().forEach((obj: any) => {
        if (obj.backgroundColor && obj.backgroundColor !== "transparent") {
          obj.set({ backgroundColor: "white" });
        }
      });
      // Highlight the selected object
      block.fabricObj.set({ backgroundColor: "#e2e8f0" });
      canvas.setActiveObject(block.fabricObj);
      canvas.renderAll();

      // Scroll the canvas container to show the object
      const canvasEl = canvas.upperCanvasEl;
      canvasEl.scrollIntoView({ behavior: "instant", block: "center" });
    }
  };

  const handleDownload = async () => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;

    // Export canvas exactly as shown
    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 2,
    });

    const pdfDoc = await PDFDocument.create();
    const pngImage = await pdfDoc.embedPng(dataUrl);

    const page = pdfDoc.addPage([pngImage.width, pngImage.height]);

    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: pngImage.width,
      height: pngImage.height,
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited.pdf";
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main editor */}
      <div className="lg:flex-1 border rounded shadow overflow-auto flex justify-center">
        <canvas ref={canvasRef} className="border" />
      </div>

      {/* Sidebar */}
      <aside className="w-80 border-l p-4 overflow-auto">
        <h3 className="font-bold mb-2">Editable Text</h3>

        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Search Text</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search text..."
              className="flex-1 border p-2 rounded"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Results Count */}
        {searchQuery && (
          <div className="mb-2 text-sm text-gray-600">
            Found {searchResults.length} match
            {searchResults.length !== 1 ? "es" : ""}
          </div>
        )}

        {/* Search Results List */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-1">Search Results</h4>
            <div className="max-h-[200px] overflow-y-auto">
              {searchResults.map((block) => (
                <div
                  key={block.id}
                  onClick={() => scrollToResult(block)}
                  className={`p-2 border rounded mb-1 cursor-pointer hover:bg-blue-200 ${
                    selectedBlockId === block.id ? "bg-blue-200" : "bg-blue-50"
                  }`}
                >
                  <p className="text-sm truncate">{block.text}</p>
                  <p className="text-xs text-gray-500">Page {block.page}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Text Blocks */}

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto my-4">
          <h4 className="font-semibold text-sm mb-2">
            All Text Blocks ({textBlocks.length})
          </h4>
          {textBlocks

            .filter((block) => block.text.trim() !== "")
            .map((block) => (
              <div
                key={block.id}
                className={`mb-2 ${
                  selectedBlockId === block.id
                    ? "bg-blue-100 border-blue-400"
                    : ""
                } border rounded p-2`}
              >
                <textarea
                  value={block.text}
                  onChange={(e) => updateTextBlock(block.id, e.target.value)}
                  className={`w-full border p-1 rounded ${
                    searchQuery &&
                    block.text.toLowerCase().includes(searchQuery.toLowerCase())
                      ? "bg-yellow-50"
                      : ""
                  }`}
                  placeholder="Edit text..."
                />
              </div>
            ))}
        </div>

        <button
          onClick={handleDownload}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Download PDF
        </button>
      </aside>
    </div>
  );
};

export default PageEditor;
