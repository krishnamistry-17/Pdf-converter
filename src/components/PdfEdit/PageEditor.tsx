import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import * as fabric from "fabric";

import useMobileSize from "../../hooks/useMobileSize";
import type { TextBlock } from "../../types/pageResult";
import EditorSidebar from "./EditorSidebar";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { FaBars } from "react-icons/fa";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PageEditorProps {
  file: File;
  handleReset: () => void;
}

const PageEditor = ({ file, handleReset }: PageEditorProps) => {
  const isMobile = useMobileSize();

  const fabricCanvasesRef = useRef<Map<number, fabric.Canvas>>(new Map());
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBlockId, _setSelectedBlockId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const searchResults = textBlocks.filter(
    (block) =>
      searchQuery.trim() &&
      block.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPageBlocks = textBlocks.filter(
    (block) => block.page === currentPage
  );

  useEffect(() => {
    const loadPdf = async () => {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);

      const allBlocks: TextBlock[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        // Get original viewport
        const initialViewport = page.getViewport({ scale: 1 });

        //  Get container width
        const maxWidth = 900;
        const containerWidth = Math.min(
          containerRef.current?.clientWidth || initialViewport.width,
          maxWidth
        );

        //  Calculate responsive scale
        const scale = containerWidth / initialViewport.width;

        const viewport = page.getViewport({ scale });

        // Render PDF page to temp canvas
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d")!;
        tempCanvas.width = viewport.width;
        tempCanvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const canvasEl = canvasRefs.current.get(pageNumber);
        if (!canvasEl) continue;

        //  Create fabric canvas
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

        //  Extract text content
        const textContent = await page.getTextContent();

        textContent.items.forEach((item: any, idx: number) => {
          if (!item.str.trim()) return;

          const [_a, _b, _c, _d, e, f] = item.transform;

          allBlocks.push({
            id: `${pageNumber}-${idx}`,
            page: pageNumber,
            x: e * scale,
            y: viewport.height - f * scale,
            fontSize: item.height * scale,
            text: item.str,
            originalText: item.str,
          });
        });
      }

      setTextBlocks(allBlocks);
    };

    loadPdf();
  }, [file, isMobile]);

  useEffect(() => {
    textBlocks.forEach((block) => {
      const canvas = fabricCanvasesRef.current.get(block.page);
      if (!canvas) return;

      if (!block.text.trim()) {
        if (block.fabricObj) {
          canvas.remove(block.fabricObj);
          block.fabricObj = undefined;
          canvas.renderAll();
        }
        return;
      }

      if (block.fabricObj) {
        block.fabricObj.set("text", block.text);
        canvas.renderAll();
        return;
      }

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
    setTextBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, text: newText } : block
      )
    );
  };

  const handleDownload = async () => {
    const pdfDoc = await PDFDocument.create();

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const canvas = fabricCanvasesRef.current.get(pageNumber);
      if (!canvas) continue;

      const dataUrl = canvas.toDataURL({
        format: "png",
        multiplier: 2, // high quality export
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
    handleReset();
    toast.success("PDF downloaded successfully!");
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
            <button
              onClick={handleReset}
              className="text-sm font-medium text-gray-600"
            >
              Close
            </button>

            <span className="text-sm font-semibold">
              Page {currentPage}/{totalPages}
            </span>

            <button
              onClick={() => setShowSidebar(true)}
              className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg"
            >
              Edit
            </button>
          </div>
        )}

        <main
          className={`
        flex-1 overflow-auto
        ${isMobile ? "p-3 pt-16" : "p-6 lg:mr-[384px]"}
      `}
        >
          <div
            ref={containerRef}
            className="flex flex-col gap-6 items-center w-full"
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <canvas
                key={i + 1}
                ref={(el) => {
                  if (el) canvasRefs.current.set(i + 1, el);
                }}
                className="border"
              />
            ))}
          </div>
        </main>

        <aside className="fixed top-0 right-0 h-full w-[380px] z-50 py-3 px-6 bg-white border-l shadow-lg hidden lg:flex flex-col">
          <EditorSidebar
            handleReset={handleReset}
            handleDownload={handleDownload}
            handleSearch={setSearchQuery}
            clearSearch={() => setSearchQuery("")}
            setCurrentPage={setCurrentPage}
            currentPageBlocks={currentPageBlocks}
            searchQuery={searchQuery}
            currentPage={currentPage}
            totalPages={totalPages}
            searchResults={searchResults}
            selectedBlockId={selectedBlockId || ""}
            updateTextBlock={updateTextBlock}
          />
        </aside>
      </div>
      {isMobile && showSidebar && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
          <div className="bg-white w-full h-[85vh] rounded-t-2xl shadow-xl flex flex-col">
            <div className="flex items-center justify-center px-4 py-3 border-b cursor-grab">
              <FaBars />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold">Search & Edit</h3>
              <button onClick={() => setShowSidebar(false)}>
                <IoMdClose />
              </button>
            </div>

            {/* Content */}

            <div className="flex-1 overflow-y-auto">
              <EditorSidebar
                handleReset={handleReset}
                handleDownload={handleDownload}
                handleSearch={setSearchQuery}
                clearSearch={() => setSearchQuery("")}
                setCurrentPage={setCurrentPage}
                currentPageBlocks={currentPageBlocks}
                searchQuery={searchQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                searchResults={searchResults}
                selectedBlockId={selectedBlockId || ""}
                updateTextBlock={updateTextBlock}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageEditor;
