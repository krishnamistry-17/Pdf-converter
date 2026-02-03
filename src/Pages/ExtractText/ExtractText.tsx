import { useState } from "react";
import { toast } from "react-toastify";

import useFilesStore from "../../store/useSheetStore";
import ExtractedTextPreview from "../../components/ExtractedTextPreview";
import SelectFile from "../../components/SelectFile";
import CustomInputModal from "../../components/CustomInputModal";
import useExtractPdfStore from "../../store/useExtractPdf";
import { useOCR } from "../../hooks/useOCR";

const ExtractText = () => {
  const { extractText, loading, text: extractedText } = useOCR();
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);

  const { setResults } = useExtractPdfStore();
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setSelectedFile(file);
    setFileSelected(true);

    await extractText(file);

    setResults([extractedText || ""]);
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
            <CustomInputModal
              fileSelected={fileSelected}
              label="Select a PDF or Images"
              accept=".pdf,.jpg,.png,.jpeg"
              isDownloadCompleted={false}
              clearDownloadCompleted={() => {}}
              onFileUpload={handleFileUpload}
            />
            {!extractedText && (
              <p className="text-blue mt-8 text-center">
                Upload a PDF or Images to start
              </p>
            )}
            {loading && <p>Extracting text...</p>}
            {extractedText && <ExtractedTextPreview text={extractedText} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractText;
