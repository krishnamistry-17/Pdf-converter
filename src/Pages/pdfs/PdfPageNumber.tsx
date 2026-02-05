import SelectFile from "../../components/SelectFile";
import { usePdfPageNumbersStore } from "../../store/usePdfPageNumbers";
import PageNumberPreviewGrid from "../../components/pagenumber/PageNumberPreviewGrid";
import { IoMdClose } from "react-icons/io";
import useUploadData from "../../hooks/useUploadData";
import PageSidebar from "../../components/pagenumber/PageSidebar";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import UploadModal from "../../components/UploadModal";
import useMobileSize from "../../hooks/useMobileSize";

const PdfPageNumber = () => {
  const isMobile = useMobileSize();
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

  return (
    <>
      <div className="relative lg:flex lg:flex-col flex-col-reverse min-h-screen  px-4 py-12">
        <div
          className={`flex-1  transition-all duration-300
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
      `}
        >
          <div
            className={`mx-auto
            ${results.length > 0 ? "max-w-xl w-auto" : "max-w-xl"}
          `}
          >
            <SelectFile
              heading="Add Page Number"
              description="Add page numbers to a PDF file. This tool will add page numbers to a PDF file."
            />
            <div className="bg-white/40 text-text-body rounded-2xl shadow-lg border border-gray-100 p-6 sm:pt-10 sm:pb-14">
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

              {results.length === 0 && (
                <p className="text-text-body mt-8 text-center">
                  Upload a PDF to start
                </p>
              )}
              {results.length > 0 && (
                <>
                  {isMobile && results.length > 0 && (
                    <div className=" flex flex-col gap-3 mt-3">
                      <PageSidebar />
                    </div>
                  )}
                  <PageNumberPreviewGrid
                    images={results.map((result) => result.url)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {!isMobile && isSidebarVisible && (
          <aside className="fixed top-0 right-0 h-full w-[380px] bg-bg-card border-l border-border shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
              <button
                className="absolute top-5 right-5"
                onClick={() => {
                  clearResults();
                }}
              >
                <IoMdClose />
              </button>
              <PageSidebar />
            </div>
          </aside>
        )}
      </div>
    </>
  );
};

export default PdfPageNumber;
