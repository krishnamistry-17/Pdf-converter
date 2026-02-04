import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import JSZip from "jszip";
import useImageStore from "../../store/useImageStore";
import SelectFile from "../../components/SelectFile";
import ImagePreviewGrid from "../../components/ImagePreviewGrid";
import CustomInputModal from "../../components/CustomInputModal";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import type { ImageResult } from "../../types/pageResult";
import { IoMdClose } from "react-icons/io";
import Zipsidebar from "../../components/Zipsidebar";
import UploadModal from "../../components/UploadModal";

const PdfToJpg = () => {
  const zip = new JSZip();

  const setSelectedFile = useFilesStore((s) => s.setSelectedFile);
  const selectedFile = useFilesStore((s) => s.selectedFile);
  const setLoading = useFilesStore((s) => s.setLoading);
  const clearResults = useImageStore((s) => s.clearResults);
  const setDownloadCompleted = useFileSessionStore(
    (s) => s.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore((s) => s.downloadCompleted);
  const clearDownloadCompleted = useFileSessionStore(
    (s) => s.clearDownloadCompleted
  );

  const setResults = useImageStore((s) => s.setResults);
  const results = useImageStore((s) => s.results);

  const { ConvertPdfToPng, downloadBlob } = useUploadData();

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [_fileSelected, setFileSelected] = useState(false);
  const [_showAllImages, setShowAllImages] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSidebarVisible = results.length > 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("Please select a file");

    setSelectedFile(file);
    setFileSelected(true);

    setResults([
      {
        name: file.name,
        blob: file,
        url: URL.createObjectURL(file),
        fileName: file.name,
        pages: 1,
      } as ImageResult,
    ]);

    try {
      setLoading(true);
      const { previews } = await ConvertPdfToPng(file);

      setPreviewImages(previews);
      setShowAllImages(true);
    } catch (err) {
      toast.error("Failed to generate previews");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!results.length) return toast.error("No images to download");

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 100));
      const { previews, blobs } = await ConvertPdfToPng(selectedFile as File);
      previews.forEach((_preview, index) => {
        downloadBlob(blobs[index], `page-${index + 1}.png`);
      });
      toast.success("Download successful!");
      clearResults();
      setDownloadCompleted(true);
      setFileSelected(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download JPG images");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    const { blobs } = await ConvertPdfToPng(selectedFile as File);

    blobs.forEach((blob, index) => {
      zip.file(`page-${index + 1}.png`, blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, `${selectedFile?.name}.zip`);
    toast.success("Zip Download successful!");
    clearResults();
    setDownloadCompleted(true);
    setFileSelected(false);
  };

  const handleReset = () => {
    clearResults();
    setFileSelected(false);
    setDownloadCompleted(false);
    setPreviewImages([]);
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
              heading="PDF to JPG"
              description="Convert a PDF file to JPG images."
            />
            <div className="bg-white/40 text-blue rounded-2xl shadow-lg border border-gray-100 p-6 sm:pt-10 sm:pb-14">
              {results.length === 0 && (
                <UploadModal
                  fileSelected={results.length > 0}
                  isDownloadCompleted={downloadCompleted}
                  clearDownloadCompleted={clearDownloadCompleted}
                  handleFileUpload={handleFileUpload}
                  accept=".pdf"
                  label="Select a PDF"
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
                    <Zipsidebar
                      handleReset={handleReset}
                      handleDownloadZip={handleDownloadZip}
                      handleDownloadAll={handleDownloadAll}
                    />
                  )}
                  <ImagePreviewGrid images={previewImages} />
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
              <Zipsidebar
                handleReset={handleReset}
                handleDownloadZip={handleDownloadZip}
                handleDownloadAll={handleDownloadAll}
              />
            </div>
          </aside>
        )}
      </div>
    </>
  );
};

export default PdfToJpg;
