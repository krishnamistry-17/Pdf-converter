import { useState } from "react";
import { toast } from "react-toastify";
import useFilesStore from "../../store/useSheetStore";
import ExtractedTextPreview from "../../components/OCR/ExtractedTextPreview";
import SelectFile from "../../components/SelectFile";
import useExtractPdfStore from "../../store/useExtractPdf";
import { useOCR } from "../../hooks/useOCR";
import UploadModal from "../../components/UploadModal";
import OCRLoader from "../../components/OCR/OCRLoader";
import OCRPreview from "../../components/OCR/OCRPreview";
import { FaMagic } from "react-icons/fa";
import useMobileSize from "../../hooks/useMobileSize";

const ExtractText = () => {
  const isMobile = useMobileSize();
  const { extractText, ocrLoading, text: extractedText } = useOCR();
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const selectedFile = useFilesStore((state) => state.selectedFile);

  const { setResults, results } = useExtractPdfStore();
  const [fileSelected, setFileSelected] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const isSidebarVisible = results.length > 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    console.log("file", file);

    setSelectedFile(file);
    setFileSelected(true);
    setPreviewFile(URL.createObjectURL(file));

    setResults([extractedText || ""]);
  };

  const handleStartOCR = async () => {
    await extractText(selectedFile as File);
  };

  return (
    <div className="flex flex-col min-h-screen  px-4 py-12 relative">
      <div
        className={`flex-1  transition-all duration-300 
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
      `}
      >
        <div className="max-w-4xl mx-auto">
          <SelectFile
            heading="OCR Pdf or Images"
            description="Extract text from a PDF or Images."
          />
          <div className="bg-white/40 text-blue rounded-2xl shadow-lg border border-gray-100 p-6 sm:pt-10 sm:pb-14">
            <UploadModal
              handleFileUpload={handleFileUpload}
              accept=".pdf,.jpg,.png,.jpeg"
              label="Select a PDF or Images"
              fileSelected={fileSelected}
              isDownloadCompleted={false}
              clearDownloadCompleted={() => {}}
            />
            {!fileSelected && (
              <p className="text-blue mt-8 text-center">
                Upload a PDF or Images to start
              </p>
            )}
            {ocrLoading && <OCRLoader />}
            {previewFile && (
              <div className="flex flex-col gap-3">
                <OCRPreview previewFileDesign={previewFile} />
                <div className="flex justify-center items-center mb-3">
                  <button
                    className="bg-blue text-white px-4 py-2 rounded-md"
                    onClick={handleStartOCR}
                  >
                    Start OCR
                  </button>
                </div>
              </div>
            )}
            {extractedText && <ExtractedTextPreview text={extractedText} />}
          </div>
        </div>
      </div>
      {fileSelected && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
          <button className="bg-blue text-white px-4 py-2 rounded-md flex items-center gap-2">
            <FaMagic />
            Summarize
          </button>
        </div>
      )}
    </div>
  );
};

export default ExtractText;
