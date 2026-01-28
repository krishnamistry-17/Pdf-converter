import SelectFile from "../../components/SelectFile";
import InputField from "../../components/InputField";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Range from "../../components/split/Range";
import useSplitStore from "../../store/useSplitStore";
import PreviewFile from "../../components/PreviewFile";
import SplitPreviewGrid from "../../components/split/SplitPreviewGrid";
import Pages from "../../components/split/Pages";
import Size from "../../components/split/Size";
import { PDFDocument } from "pdf-lib";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import useFilesStore from "../../store/useSheetStore";

const SplitPdfComponent = () => {
  const { selectedFile, setSelectedFile, clearSelectedFile } =
    useFileSessionStore();
  const fileSelected = !!selectedFile;

  const clearResults = useSplitStore((state) => state.clearResults);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);

  const results = useSplitStore((state) => state.results);

  const splitRangeType = useSplitStore((state) => state.splitRangeType);

  const [isTabChanged, setIsTabChanged] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const setSplitRangeType = useSplitStore((state) => state.setSplitRangeType);
  const setTotalPages = useSplitStore((state) => state.setTotalPages);
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setSelectedFile(file);

    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const totalPages = pdf.getPageCount();
    setTotalPages(totalPages);

    setPreviewFile(URL.createObjectURL(file));
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

  return (
    <div className=" relative flex min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div
        className={` flex-1 transition-all duration-300
           bg-white rounded-2xl shadow-lg border border-gray-100 sm:p-10
        ${isSidebarOpen ? "md:mr-[320px]" : ""}
        `}
      >
        <div className="flex flex-col items-center justify-center w-full sm:px-0 px-4">
          <SelectFile
            heading="Split PDF"
            description="Split a PDF file into multiple pages."
          />
          <div className="w-full flex items-center justify-center">
            <InputField
              handleFileUpload={handleFileUpload}
              accept=".pdf"
              label="Select a file"
            />
          </div>

          {!fileSelected && (
            <p className="text-gray-500 mt-8">Upload a PDF to start</p>
          )}

          {fileSelected && results.length === 0 && (
            <PreviewFile previewFileDesign={null} />
          )}

          {selectedFile && results.length > 0 && <SplitPreviewGrid />}
        </div>
      </div>

      <aside
        className={` fixed top-0 right-0 h-full w-full md:w-[380px] z-50
          bg-white  shadow-lg border-l border-gray-200
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
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
                      clearResults();
                    }}
                    className={`
                      ${
                        splitRangeType === tab
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-800"
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
    </div>
  );
};

export default SplitPdfComponent;
