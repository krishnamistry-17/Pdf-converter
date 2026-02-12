import PreviewFile from "../../components/PreviewFile";
import SelectFile from "../../components/SelectFile";
import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useEffect, useState } from "react";
import { compressPdfOptions } from "../../constance/ConvertOptions";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import UploadModal from "../../components/UploadModal";
import type { CompressionLevel } from "../../types/pageResult";
import useMobileSize from "../../hooks/useMobileSize";
import CompressImageSide from "../../components/CompressImageSide";

const CompressImage = () => {
  const isMobile = useMobileSize();

  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(
    null
  );
  const results = useFilesStore((state) => state.results);
  const clearResults = useFilesStore((state) => state.clearResults);
  const setResults = useFilesStore((state) => state.setResults);
  const { compressImage } = useUploadData();

  const [fileSelected, setFileSelected] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("low");
  const [compressPercentage, setCompressPercentage] = useState<number | null>(
    null
  );
  console.log("compressPercentage", compressPercentage);

  const isSidebarVisible = fileSelected;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
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
    console.log("original file size-------", file.size / 1024, "KB");

    setPreviewFileDesign(URL.createObjectURL(file as File));
    e.target.value = "";
    setFileSelected(true);
  };

  const getCompressPercentage = (compressedFile: File) => {
    const originalSize = (results[0].blob as File).size;
    const compressedSize = compressedFile.size;
    const reduction = ((originalSize - compressedSize) / originalSize) * 100;
    setCompressPercentage(reduction);
    return reduction;
  };

  const handleCompress = async () => {
    try {
      if (!selectedSize)
        return toast.error("Please select a compression level");
      const compressedFile = await compressImage(
        results[0].blob as File,
        selectedSize as CompressionLevel
      );
      getCompressPercentage(compressedFile);

      console.log("Original:", (results[0].blob as File).size / 1024, "KB");

      console.log(
        "Compressed:",
        compressedFile.size / 1024,
        "KB",
        compressPdfOptions.find((option) => option.value === selectedSize)
          ?.label
      );
    } catch (error) {
      console.error(error);
      toast.error("Compression failed!");
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 100));
      const compressedFile = await compressImage(
        results[0].blob as File,
        selectedSize as CompressionLevel
      );
      const url = URL.createObjectURL(compressedFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${results[0].name}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Compression successful!");
      clearSelectedFile();
      setDownloadCompleted(true);
      setFileSelected(false);
      setResults([]);
    } catch (error) {
      console.error(error);
      toast.error("Compression failed!");
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    return () => {
      clearResults();
      clearSelectedFile();
    };
  }, []);
  return (
    <div className="relative flex lg:flex-row flex-col  px-4 lg:py-12 py-6 ">
      <div
        className={`flex-1 transition-all duration-300 
          
          ${fileSelected ? "md:mr-[320px]" : ""}`}
      >
        <div
          className={`mx-auto
          ${results.length > 0 ? "max-w-xl w-auto" : "max-w-xl"}
          `}
        >
          <SelectFile
            heading="Compress Image"
            description="Compress a image file to reduce its size."
          />
          <div
            className="bg-white/40 text-text-body rounded-2xl shadow-lg 
          border border-gray-100 p-4"
          >
            {results.length === 0 && (
              <UploadModal
                handleFileUpload={handleFileUpload}
                accept=".jpg,.jpeg,.png"
                label="Select a Image"
                fileSelected={fileSelected}
                isDownloadCompleted={downloadCompleted}
                clearDownloadCompleted={clearDownloadCompleted}
              />
            )}

            <PreviewFile previewFileDesign={previewFileDesign} />
            {isMobile && results.length > 0 && (
              <div className=" flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-text-body my-4 border-b border-gray-200 pb-4">
                  Compression Level
                </h2>
                <CompressImageSide
                  setSelectedSize={setSelectedSize}
                  selectedSize={selectedSize}
                  handleCompress={handleCompress}
                  handleDownload={handleDownload}
                  compressPercentage={compressPercentage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {!isMobile && isSidebarVisible && (
        <aside
          className={`
          fixed  top-0 right-0 h-full w-full md:w-[320px] z-50
          bg-bg-card  shadow-lg border-l border-border
          transform transition-transform duration-300
          ${fileSelected ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="p-6">
            <button className="absolute top-5 right-5">
              <IoMdClose
                onClick={() => {
                  setFileSelected(false);
                  clearResults();
                  clearSelectedFile();
                }}
              />
            </button>
            <h2 className="text-lg font-semibold text-text-body my-4 border-b border-gray-200 pb-4">
              Compression Level
            </h2>
            <CompressImageSide
              setSelectedSize={setSelectedSize}
              selectedSize={selectedSize}
              handleCompress={handleCompress}
              handleDownload={handleDownload}
              compressPercentage={compressPercentage}
            />
          </div>
        </aside>
      )}
    </div>
  );
};

export default CompressImage;
