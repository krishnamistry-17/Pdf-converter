import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useFilesStore from "../../store/useSheetStore";
import ExtractedTextPreview from "../../components/OCR/ExtractedTextPreview";
import SelectFile from "../../components/SelectFile";
import useExtractPdfStore from "../../store/useExtractPdf";
import { useOCR } from "../../hooks/useOCR";
import UploadModal from "../../components/UploadModal";
import OCRLoader from "../../components/OCR/OCRLoader";
import OCRPreview from "../../components/OCR/OCRPreview";
import useMobileSize from "../../hooks/useMobileSize";
import mockSummarize from "../../utils/mockSummarize";
import OCRSidebar from "../../components/OCR/OCRSidebar";
import { IoMdClose } from "react-icons/io";

const ExtractText = () => {
  const isMobile = useMobileSize();
  //calling a custome hook islike -> call a object for twice it craetes 2 times
  const { extractText, ocrLoading, text: extractedText } = useOCR();
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);

  const {
    setResults,
    clearResults,
    summaryType,
    summaryStatus,
    setSummaryStatus,
    setSummaryResult,
  } = useExtractPdfStore();

  const [fileSelected, setFileSelected] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const isSidebarVisible = fileSelected;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setSelectedFile(file);
    setFileSelected(true);
    setPreviewFile(URL.createObjectURL(file));
  };

  const handleStartOCR = async () => {
    await extractText(selectedFile as File);
  };

  const handleReset = () => {
    clearSelectedFile();
    setFileSelected(false);
    setPreviewFile(null);
    clearResults();
  };

  const handleDeleteSelectedFile = () => {
    if (!selectedFile) return;
    clearSelectedFile();
    setFileSelected(false);
    setPreviewFile(null);
    clearResults();
  };

  useEffect(() => {
    if (extractedText) {
      setSummaryStatus("idle");
      setResults([extractedText]);
    }
  }, [extractedText]);

  useEffect(() => {
    if (summaryStatus === "loading") {
      mockSummarize(extractedText, summaryType).then((res) => {
        setSummaryResult(res);
        setSummaryStatus("done");
      });
    }
  }, [summaryStatus]);

  useEffect(() => {
    return () => {
      clearSelectedFile();
      clearResults();
      setPreviewFile(null);
      setFileSelected(false);
    };
  }, []);

  return (
    <div className="flex flex-col   px-4 py-12 relative">
      {ocrLoading && <OCRLoader />}
      <div
        className={`flex-1  transition-all duration-300 
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
      `}
      >
        <div
          className={`mx-auto
          ${fileSelected ? "max-w-xl w-auto" : "max-w-xl"}
          `}
        >
          <SelectFile
            heading="OCR Pdf or Images"
            description="Extract text from a PDF or Images."
          />
          <div className="bg-white/40 text-text-body rounded-2xl shadow-lg 
          border border-gray-100 p-4">
            <UploadModal
              handleFileUpload={handleFileUpload}
              accept=".pdf,.jpg,.png,.jpeg"
              label="Select a PDF or Images"
              fileSelected={fileSelected}
              isDownloadCompleted={false}
              clearDownloadCompleted={() => {}}
            />

            {previewFile && (
              <div className="flex flex-col gap-3 my-3">
                <OCRPreview previewFileDesign={previewFile} />
                <div className="my-5">
                  {isMobile && fileSelected && (
                    <OCRSidebar
                      handleReset={handleReset}
                      handleDeleteSelectedFile={handleDeleteSelectedFile}
                      previewFile={previewFile}
                      handleStartOCR={handleStartOCR}
                    />
                  )}
                </div>
              </div>
            )}
            {extractedText && selectedFile && (
              <ExtractedTextPreview text={extractedText} />
            )}
          </div>
        </div>
      </div>
      {!isMobile && isSidebarVisible && (
        <aside
          className="fixed top-0 right-0 h-full w-[380px] bg-bg-card border-l border-border shadow-lg z-50 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <button className="absolute top-5 right-5" onClick={handleReset}>
            <IoMdClose />
          </button>
          <OCRSidebar
            handleReset={handleReset}
            handleDeleteSelectedFile={handleDeleteSelectedFile}
            previewFile={previewFile}
            handleStartOCR={handleStartOCR}
          />
        </aside>
      )}
    </div>
  );
};

export default ExtractText;
