import { useEffect, useState } from "react";
import { useCropPdfStore } from "../../store/useCropPdf";
import SelectFile from "../../components/SelectFile";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import useUploadData from "../../hooks/useUploadData";
import type { CropPdfResult } from "../../types/pageResult";
import CropPreviewGrid from "../../components/CropPdf/CropPreviewGrid";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import CropSideBar from "../../components/CropPdf/CropSideBar";
import UploadModal from "../../components/UploadModal";

const CropPdf = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { ConvertPdfToPng } = useUploadData();
  const { results, setResults, setCropResults, clearSelectCropPdfFile } =
    useCropPdfStore((state) => state);

  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );

  const isSidebarVisible = results.length > 0;
  const [activeCropIndex, setActiveCropIndex] = useState<number | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [showCropImage, setShowCropImage] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { previews } = await ConvertPdfToPng(file);
      setPreviewImages(previews);
      setResults(
        previews.map((preview, index) => ({
          name: `page-${index + 1}.png`,
          url: preview,
          blob: new Blob([preview]),
          pages: 1,
          fileName: file.name,
        })) as CropPdfResult[]
      );
    } catch (error) {
      toast.error("Failed to convert PDF");
    }
  };

  const handleReset = () => {
    setResults([]);
    clearSelectCropPdfFile();
    clearDownloadCompleted();
  };

  const handleCropComplete = async (base64: string) => {
    // Get the result as a data URL (Base64 string) or Blob
    const blob = await fetch(base64).then((res) => res.blob());
    const file = new File([blob], "cropped.png", { type: "image/png" });

    const fileUrl = URL.createObjectURL(file);

    setCropResults([
      {
        name: "cropped.png",
        url: fileUrl,
        blob: file,
        pages: 1,
        fileName: "cropped.png",
      } as CropPdfResult,
    ]);
    setActiveCropIndex(null);
    setPreviewImages([...previewImages, fileUrl]);
  };

  return (
    <>
      <div className="relative lg:flex lg:flex-col flex-col-reverse min-h-screen  px-4 py-12">
        <div
          className={`flex-1  transition-all duration-300
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
      `}
        >
          <div className="max-w-4xl mx-auto">
            <SelectFile
              heading="Crop PDF"
              description="Crop a PDF file by selecting the crop box."
            />
            <div className="bg-white/40 text-blue rounded-2xl shadow-lg border border-gray-100 p-6 sm:pt-10 sm:pb-14">
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
                <p className="text-blue mt-8 text-center">
                  Upload a PDF to start
                </p>
              )}
              {results.length > 0 && (
                <>
                  {isMobile && isSidebarVisible && (
                    <CropSideBar
                      handleCropComplete={handleCropComplete}
                      handleReset={handleReset}
                      activeCropIndex={activeCropIndex}
                      setShowCropImage={setShowCropImage}
                    />
                  )}
                  <CropPreviewGrid
                    showCropImage={showCropImage}
                    setActiveCropIndex={setActiveCropIndex}
                    images={previewImages}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {!isMobile && isSidebarVisible && (
          <aside className="fixed top-0 right-0 h-full w-[380px] bg-sea border-l border-blue shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
              <button className="absolute top-5 right-5" onClick={handleReset}>
                <IoMdClose />
              </button>
              <CropSideBar
                handleCropComplete={handleCropComplete}
                handleReset={handleReset}
                activeCropIndex={activeCropIndex}
                setShowCropImage={setShowCropImage}
              />
            </div>
          </aside>
        )}
      </div>
    </>
  );
};

export default CropPdf;
