import { useEffect, useState } from "react";
import useWaterMarkStore from "../../store/useWaterMarkStore";
import SelectFile from "../../components/SelectFile";
import CustomInputModal from "../../components/CustomInputModal";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import { IoMdClose } from "react-icons/io";
import WaterMarkPreviewGrid from "../../components/WatermarkPdf/WaterMarkPreviewGrid";
import useUploadData from "../../hooks/useUploadData";
import PlaceText from "../../components/WatermarkPdf/PlaceText";
import PlaceImage from "../../components/WatermarkPdf/PlaceImage";

const WaterMarkPdfComponent = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { results, setResults, clearResults, setSelectedFile, selectedFile } =
    useWaterMarkStore();
  const { extractAllPages } = useUploadData();
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );
  const setWatermarkType = useWaterMarkStore((state) => state.setWatermarkType);
  const watermarkType = useWaterMarkStore((state) => state.watermarkType);

  const [_isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isSidebarVisible = results.length > 0;
  const fileSelected = !!selectedFile;

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

  useEffect(() => {
    if (!selectedFile) {
      clearResults();
      setIsSidebarOpen(false);
    } else if (fileSelected) {
      setIsSidebarOpen(true);
    }
  }, [selectedFile, clearResults]);

  return (
    <div className=" relative lg:flex flex-col min-h-screen px-4 py-12">
      <div
        className={`flex-1 transition-all duration-300 ${
          !isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <SelectFile
            heading="WaterMark PDF"
            description="Add a watermark to a PDF file."
          />
          <div className="bg-white/40 text-blue rounded-2xl shadow-lg border border-gray-100 p-6 sm:pt-10 sm:pb-14">
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
            {results.length > 0 && (
              <WaterMarkPreviewGrid
                images={results.map((result) => result.url)}
              />
            )}
          </div>
        </div>
      </div>

      {!isMobile && isSidebarVisible && (
        <aside
          className={` fixed top-0 right-0 h-full w-[380px] z-50
         bg-sea shadow-lg border-l border-blue
          transform transition-transform duration-300
          ${isSidebarVisible ? "translate-x-0" : "translate-x-full"}
        `}
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
            <div className="flex flex-col ">
              <h2 className="text-xl text-center font-semibold text-blue border-b border-blue/30 pb-4">
                Watermark Options
              </h2>
              <div className=" space-y-2">
                <div className="flex items-center justify-between w-full  gap-2 my-4">
                  <>
                    {["Place Text", "Place Image"].map((tab) => {
                      return (
                        <button
                          key={tab}
                          onClick={() => {
                            setWatermarkType(
                              tab as "Place Text" | "Place Image"
                            );
                          }}
                          className={`px-6 py-2 rounded-md text-white w-full ${
                            watermarkType === tab
                              ? "bg-gradient-to-r from-blue to-teal"
                              : "bg-teal"
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </>
                </div>
                {watermarkType === "Place Text" && (
                  <PlaceText setIsSidebarOpen={setIsSidebarOpen} />
                )}
                {watermarkType === "Place Image" && <PlaceImage />}
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default WaterMarkPdfComponent;
