
import SelectFile from "../../components/SelectFile";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Range from "../../components/split/Range";
import useSplitStore from "../../store/useSplitStore";
import SplitPreviewGrid from "../../components/split/SplitPreviewGrid";
import Pages from "../../components/split/Pages";
import Size from "../../components/split/Size";
import { PDFDocument } from "pdf-lib";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import CustomInputModal from "../../components/CustomInputModal";

const SplitPdfComponent = () => {
  const { selectedFile, setSelectedFile, clearSelectedFile } =
    useFileSessionStore();

  const fileSelected = !!selectedFile;

  const clearResults = useSplitStore((state) => state.clearResults);
  const results = useSplitStore((state) => state.results);
  const setResults = useSplitStore((state) => state.setResults);
  const setSplitRangeType = useSplitStore((state) => state.setSplitRangeType);
  const setTotalPages = useSplitStore((state) => state.setTotalPages);
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );
  const splitRangeType = useSplitStore((state) => state.splitRangeType);

  const [isTabChanged, setIsTabChanged] = useState(false);
  const [_isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const isSidebarVisible = results.length > 0;

  return (
    <div className=" relative lg:flex flex-col min-h-screen  px-4 py-12">
      <div
        className={` flex-1 transition-all duration-300 
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
        `}
      >
        <div className="max-w-4xl mx-auto">
          <SelectFile
            heading="Split PDF"
            description="Split a PDF file into multiple pages."
          />
          <div className="bg-white/40 text-blue rounded-2xl shadow-lg
           border border-gray-100 p-6 sm:pt-10 sm:pb-14">
            {results.length === 0 && (
              <CustomInputModal
                fileSelected={results.length > 0}
                label="Select a PDF"
                accept=".pdf"
                isDownloadCompleted={downloadCompleted}
                clearDownloadCompleted={clearDownloadCompleted}
                onFileUpload={handleFileUpload}
              />
            )}

            {results.length === 0 && (
              <p className="text-gray-500 mt-8 text-center">
                Upload a PDF to start
              </p>
            )}

            {results.length > 0 && <SplitPreviewGrid />}
          </div>
        </div>
      </div>

      {isMobile && results.length > 0 && (
        <div className=" flex flex-col gap-3 mt-3">
          <h2 className="text-xl font-semibold py-4">SelectedFiles</h2>
          <div className=" space-y-2">
            <div className="flex items-center justify-start sm:gap-0 gap-2">
              <>
                {["Range", "Pages", "Size"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setSplitRangeType(tab as "Range" | "Pages" | "Size");
                      setIsTabChanged(true);
                    }}
                    className={`
                      ${
                        splitRangeType === tab
                          ? "bg-gradient-to-r from-blue to-teal text-white"
                          : "bg-teal text-white"
                      }
                      px-6 py-2 rounded-md
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </>
            </div>

            {splitRangeType === "Range" && (
              <Range setIsSidebarOpen={setIsSidebarOpen} />
            )}
            {splitRangeType === "Pages" && (
              <Pages setIsSidebarOpen={setIsSidebarOpen} />
            )}
            {splitRangeType === "Size" && (
              <Size setIsSidebarOpen={setIsSidebarOpen} />
            )}
          </div>
        </div>
      )}

      {!isMobile && isSidebarVisible && (
        <aside
          className={` fixed top-0 right-0 h-full w-[380px] z-50
          bg-sea  shadow-lg border-l border-blue
          transform transition-transform duration-300
          ${isSidebarVisible ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="p-6">
            <button
              className="absolute top-5 right-5"
              onClick={() => {
                clearSelectedFile();
                clearResults();
              }}
            >
              <IoMdClose
                onClick={() => {
                  clearSelectedFile();
                  clearResults();
                }}
              />
            </button>
            <h2 className="text-lg font-semibold mb-4">Split PDF</h2>
            <div className=" space-y-2">
              <div className="flex items-center justify-between sm:gap-0 gap-2">
                <>
                  {["Range", "Pages", "Size"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setSplitRangeType(tab as "Range" | "Pages" | "Size");
                        setIsTabChanged(true);
                      }}
                      className={`
                      ${
                        splitRangeType === tab
                            ? "bg-gradient-to-r from-blue to-teal text-white"
                          : "bg-teal text-white"
                      }
                      px-6 py-2 rounded-md
                    `}
                    >
                      {tab}
                    </button>
                  ))}
                </>
              </div>

              {splitRangeType === "Range" && (
                <Range setIsSidebarOpen={setIsSidebarOpen} />
              )}
              {splitRangeType === "Pages" && (
                <Pages setIsSidebarOpen={setIsSidebarOpen} />
              )}
              {splitRangeType === "Size" && (
                <Size setIsSidebarOpen={setIsSidebarOpen} />
              )}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default SplitPdfComponent;
