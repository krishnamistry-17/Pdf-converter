import { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import SelectFile from "../../components/SelectFile";
import { usePdfPageNumbersStore } from "../../store/usePdfPageNumbers";
import PageNumberPreviewGrid from "../../components/pagenumber/PageNumberPreviewGrid";
import { IoMdClose } from "react-icons/io";
import useUploadData from "../../hooks/useUploadData";
import PageSidebar from "../../components/pagenumber/PageSidebar";

const PdfPageNumber = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { results, setResults, setSelectPdfPageNumberFile, clearResults } =
    usePdfPageNumbersStore();
  const { extractAllPages } = useUploadData();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <div className="relative lg:flex lg:flex-col flex-col-reverse min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
        <div
          className={`flex-1 bg-white rounded-2xl shadow-lg border
           border-gray-100 transition-all duration-300 sm:p-10
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
      `}
        >
          <div className="flex flex-col items-center px-4 sm:px-10 lg:py-0 py-4">
            <div className="max-w-lg">
              <SelectFile
                heading="Add Page Number"
                description="Add page numbers to a PDF file. This tool will add page numbers to a PDF file."
              />
            </div>
            {results.length === 0 && (
              <div className="w-full flex justify-center">
                <InputField
                  handleFileUpload={handleFileUpload}
                  accept=".pdf"
                  label="Select a file"
                />
              </div>
            )}

            {results.length === 0 && (
              <p className="text-gray-500 mt-8">Upload a PDF to start</p>
            )}
            {results.length > 0 && (
              <PageNumberPreviewGrid
                images={results.map((result) => result.url)}
              />
            )}
          </div>
        </div>
        {isMobile && results.length > 0 && (
          <div className=" flex flex-col gap-3 mt-3">
            <PageSidebar />
          </div>
        )}
        {!isMobile && isSidebarVisible && (
          <aside className="fixed top-0 right-0 h-full w-[380px] bg-white border-l shadow-lg z-50 overflow-y-auto">
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
