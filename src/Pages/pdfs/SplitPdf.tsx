import SelectFile from "../../components/SelectFile";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import useSplitStore from "../../store/useSplitStore";
import SplitPreviewGrid from "../../components/split/SplitPreviewGrid";
import { PDFDocument } from "pdf-lib";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import UploadModal from "../../components/UploadModal";
import useMobileSize from "../../hooks/useMobileSize";
import SplitSidebar from "../../components/split/SplitSidebar";

const SplitPdfComponent = () => {
  const isMobile = useMobileSize();
  const { selectedFile, setSelectedFile, clearSelectedFile } =
    useFileSessionStore();

  const fileSelected = !!selectedFile;

  const clearResults = useSplitStore((state) => state.clearResults);
  const results = useSplitStore((state) => state.results);
  const setResults = useSplitStore((state) => state.setResults);
  const setTotalPages = useSplitStore((state) => state.setTotalPages);
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );

  const [isTabChanged, setIsTabChanged] = useState(false);
  const [_isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setSelectedFile(file);

    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const totalPages = pdf.getPageCount();
    setTotalPages(totalPages);

    setResults([
      {
        name: file.name,
        blob: file,
        url: URL.createObjectURL(file),
        rotation: 0,
        fileName: file.name,
        pages: 1,
      },
    ]);
  };

  useEffect(() => {
    if (!selectedFile) {
      clearResults();
      setIsSidebarOpen(false);
    } else if (fileSelected) {
      setIsSidebarOpen(true);
    } else if (isTabChanged) {
      clearResults();
      setIsTabChanged(false);
    }
  }, [selectedFile, clearResults]);

  //clear results when split page route change
  useEffect(() => {
    return () => {
      handleReset();
    };
  }, []);

  const handleReset = () => {
    clearResults();
    clearSelectedFile();
  };

  const isSidebarVisible = results.length > 0;

  return (
    <div className=" relative lg:flex flex-col   px-4 py-12">
      <div
        className={` flex-1 transition-all duration-300 
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
        `}
      >
        <div
          className={`mx-auto
          ${results.length > 0 ? "max-w-xl w-auto" : "max-w-xl"}
          `}
        >
          <SelectFile
            heading="Split PDF"
            description="Split a PDF file into multiple pages."
          />
          <div
            className="bg-white/40 text-text-body rounded-2xl shadow-lg
           border border-gray-100   p-4"
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
                {isMobile && results.length > 0 && (
                  <div className=" flex flex-col gap-3 mt-3">
                    <h2 className="text-xl font-semibold py-4">
                      SelectedFiles
                    </h2>
                    <SplitSidebar
                      setIsSidebarOpen={setIsSidebarOpen}
                      setIsTabChanged={setIsTabChanged}
                    />
                  </div>
                )}
                <SplitPreviewGrid />
              </>
            )}
          </div>
        </div>
      </div>

      {!isMobile && isSidebarVisible && (
        <aside
          className={` fixed top-0 right-0 h-full w-[380px] z-50
          bg-bg-card  shadow-lg border-l border-border
          transform transition-transform duration-300
          ${isSidebarVisible ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="p-6">
            <button className="absolute top-5 right-5" onClick={handleReset}>
              <IoMdClose onClick={handleReset} />
            </button>
            <h2 className="text-lg font-semibold text-text-heading mb-4">
              Split PDF
            </h2>
            <SplitSidebar
              setIsSidebarOpen={setIsSidebarOpen}
              setIsTabChanged={setIsTabChanged}
            />
          </div>
        </aside>
      )}
    </div>
  );
};

export default SplitPdfComponent;
