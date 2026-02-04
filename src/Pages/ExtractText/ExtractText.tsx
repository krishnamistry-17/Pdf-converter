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

const ExtractText = () => {
  const { extractText, ocrLoading, text: extractedText } = useOCR();
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const selectedFile = useFilesStore((state) => state.selectedFile);

  const { setResults } = useExtractPdfStore();
  const [fileSelected, setFileSelected] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

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
    // await extractText(file);
  };

  return (
    <div className="flex flex-col min-h-screen  px-4 py-12">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto">
          <SelectFile
            heading="Extract Text from PDF or Images"
            description="Extract text from a PDF file."
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
    </div>
  );
};

export default ExtractText;
