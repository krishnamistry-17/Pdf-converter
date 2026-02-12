import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import * as fabric from "fabric";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

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
  const fabricCanvasesRef = useRef<Map<number, fabric.Canvas>>(new Map());
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const originalPdfBytesRef = useRef<ArrayBuffer | null>(null);

  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Derived search results from textBlocks
  const searchResults = textBlocks.filter(
    (block) =>
      searchQuery.trim() &&
      block.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter blocks by current page
  const currentPageBlocks = textBlocks.filter(
    (block) => block.page === currentPage
  );

  useEffect(() => {
    const loadPdf = async () => {
      const arrayBuffer = await file.arrayBuffer();
      originalPdfBytesRef.current = arrayBuffer;

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);

      const allBlocks: TextBlock[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1 });

        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d")!;
        tempCanvas.width = viewport.width;
        tempCanvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const canvasEl = canvasRefs.current.get(pageNumber);
        if (!canvasEl) continue;

        const fabricCanvas = new fabric.Canvas(canvasEl, {
          width: viewport.width,
          height: viewport.height,
          preserveObjectStacking: true,
        });

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

        fabricCanvasesRef.current.set(pageNumber, fabricCanvas);

        const textContent = await page.getTextContent();

        textContent.items.forEach((item: any, idx: number) => {
          if (!item.str.trim()) return;

          const [_a, _b, _c, _d, e, f] = item.transform;

          allBlocks.push({
            id: `${pageNumber}-${idx}`,
            page: pageNumber,
            x: e,
            y: viewport.height - f,
            fontSize: item.height,
            text: item.str,
            originalText: item.str,
          });
        });
      }
      setTextBlocks(allBlocks);
    };

    loadPdf();
  }, [file]);

  useEffect(() => {
    textBlocks.forEach((block) => {
      const canvas = fabricCanvasesRef.current.get(block.page);
      if (!canvas) return;

      // remove if empty
      if (!block.text.trim()) {
        if (block.fabricObj) {
          canvas.remove(block.fabricObj);
          block.fabricObj = undefined;
          canvas.renderAll();
        }
        return;
      }

      // update existing
      if (block.fabricObj) {
        block.fabricObj.set("text", block.text);
        canvas.renderAll();
        return;
      }

      // create only if edited
      if (block.text !== block.originalText) {
        const textbox = new fabric.IText(block.text, {
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
        block.fabricObj = textbox;
        canvas.renderAll();
      }
    });
  }, [textBlocks]);

  const updateTextBlock = (id: string, newText: string) => {
    setTextBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, text: newText } : block
      )
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedBlockId(null);
  };

  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create();

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const canvas = fabricCanvasesRef.current.get(pageNumber);
      if (!canvas) continue;
      //created png image from canvas
      const dataUrl = canvas.toDataURL({
        format: "png",
        multiplier: 2,
      });

      const pngImage = await pdfDoc.embedPng(dataUrl);

      const page = pdfDoc.addPage([pngImage.width, pngImage.height]);

      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngImage.width,
        height: pngImage.height,
      });
    }

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
    <>
      <div className="flex flex-col h-screen bg-white">
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Main editor area */}
          <main
            className="flex-1 overflow-auto p-6"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex flex-col gap-6 items-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <canvas
                  key={i + 1}
                  ref={(el) => {
                    if (el) canvasRefs.current.set(i + 1, el);
                  }}
                  className="border"
                  style={{ maxWidth: "100%", marginBottom: "1rem" }}
                />
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:  border-l shadow-lg flex flex-col">
            {/* Search Section */}
            <div className="p-4 border-b ">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Search & Edit
                </h3>
                <button onClick={handleDownload}>
                  <FaDownload />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search text..."
                  className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Page Navigation */}
            {totalPages > 1 && (
              <div className="p-3 border-b flex items-center justify-between ">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}

            {/* Text Blocks List */}
            <div
              className="flex-1 max-h-[calc(100vh-200px)] overflow-y-auto p-4"
              style={{ scrollbarWidth: "thin" }}
            >
              <h4 className="font-medium text-gray-700 mb-3">
                Text Blocks
                {searchQuery && (
                  <span className="ml-2 text-sm text-gray-400">(filtered)</span>
                )}
              </h4>
              <div className="space-y-3">
                {(searchQuery ? searchResults : currentPageBlocks)
                  .filter((block) => block.text.trim() !== "")
                  .map((block) => (
                    <div
                      key={block.id}
                      className={`rounded-lg border transition-all ${
                        selectedBlockId === block.id
                          ? "border-indigo-500 bg-indigo-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="p-3">
                        <textarea
                          value={block.text}
                          onChange={(e) =>
                            updateTextBlock(block.id, e.target.value)
                          }
                          className={`w-full p-2 text-sm border rounded resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                            searchQuery &&
                            block.text
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                              ? "bg-blue-100 border-blue-400"
                              : ""
                          }`}
                          rows={Math.max(2, Math.ceil(block.text.length / 40))}
                          placeholder="Edit text..."
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            Page {block.page}
                          </span>
                          {block.text !== block.originalText && (
                            <span className="text-xs text-indigo-600 font-medium">
                              Modified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {searchQuery &&
                  searchResults.filter((b) => b.text.trim()).length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <svg
                        className="w-12 h-12 mx-auto mb-2 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm">No results found</p>
                    </div>
                  )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default PageEditor;
