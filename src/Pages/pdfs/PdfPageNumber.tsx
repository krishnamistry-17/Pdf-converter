import SelectFile from "../../components/SelectFile";
import { usePdfPageNumbersStore } from "../../store/usePdfPageNumbers";
import PageNumberPreviewGrid from "../../components/pagenumber/PageNumberPreviewGrid";
import { IoMdClose } from "react-icons/io";
import useUploadData from "../../hooks/useUploadData";
import PageSidebar from "../../components/pagenumber/PageSidebar";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import UploadModal from "../../components/UploadModal";
import useMobileSize from "../../hooks/useMobileSize";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";

const PdfPageNumber = () => {
  const isMobile = useMobileSize();
  const [_isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pdfPageNumberClicked, setPdfPageNumberClicked] = useState(false);
  const { results, setResults, setSelectPdfPageNumberFile, clearResults } =
    usePdfPageNumbersStore();
  const { extractAllPages } = useUploadData();
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectPdfPageNumberFile(file);

    const pages = await extractAllPages(file);
    setResults(
      pages.map((page, index) => ({
        ...page,
        rotation: 0,
        pages: index + 1,
        fileName: file.name,
      }))
    );
  };

  const isSidebarVisible = results.length > 0;

  useEffect(() => {
    return () => {
      clearResults();
    };
  }, []);

  const handleReset = () => {
    clearResults();
  };

  const containerWidth = results.length > 1 ? "max-w-2xl" : "max-w-xl";

  return (
    <>
      <div className="relative lg:flex lg:flex-col flex-col-reverse  px-4 lg:py-12 py-6">
        {/**Moible header */}
        {isMobile && isSidebarVisible && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
            <button
              onClick={handleReset}
              className="text-sm font-medium text-gray-600"
            >
              Close
            </button>

            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setPdfPageNumberClicked(true);
              }}
              className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg"
            >
              Add Page Number
            </button>
          </div>
        )}
        <div
          className={`flex-1  transition-all duration-300
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
      `}
        >
          <div
            className={`mx-auto ${containerWidth} w-auto
          `}
          >
            <SelectFile
              heading="Add Page Number"
              description="Add page numbers to a PDF file. This tool will add page numbers to a PDF file."
            />
            <div
              className="bg-white/40 text-text-body rounded-2xl shadow-lg 
            border border-gray-100 p-4"
            >
              {results.length === 0 && (
                <UploadModal
                  handleFileUpload={handleFileUpload}
                  accept=".pdf"
                  label="Select a PDF"
                  fileSelected={results.length > 0}
                  isDownloadCompleted={downloadCompleted}
                  clearDownloadCompleted={clearDownloadCompleted}
                />
              )}

              {results.length > 0 && (
                <>
                  <PageNumberPreviewGrid
                    images={results.map((result) => result.url)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {!isMobile && isSidebarVisible && (
          <aside
            className="fixed top-0 right-0 h-full w-[380px] 
           bg-bg-card border-l border-border shadow-lg z-50 
           overflow-y-auto"
          >
            <div className="p-6">
              <button
                className="absolute top-5 right-5"
                onClick={() => {
                  clearResults();
                }}
              >
                <IoMdClose />
              </button>
              <PageSidebar setPdfPageNumberClicked={setPdfPageNumberClicked} />
            </div>
          </aside>
        )}

        {isMobile && pdfPageNumberClicked && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
            <div className="bg-white w-full h-[85vh] rounded-t-2xl shadow-xl flex flex-col mx-2">
              <div className="flex items-center justify-center px-4 py-3 border-b cursor-grab">
                <FaBars />
              </div>
              {/*Header */}
              <div className="flex items-center justify-end px-4 py-3 border-b">
                <button onClick={() => setPdfPageNumberClicked(false)}>
                  <IoMdClose />
                </button>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-y-auto mx-4 mt-4">
                <PageSidebar setPdfPageNumberClicked={setPdfPageNumberClicked} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PdfPageNumber;
