import { lazy, Suspense } from "react";
const PreviewFile = lazy(() => import("../PreviewFile"));

import { useFileSessionStore } from "../../store/useFileSessionStore";
import GlobalLoader from "../GlobalLoader";
import ExtractedTextPreview from "../OCR/ExtractedTextPreview";
import UploadModal from "../UploadModal";
interface PdfFileProps {
  previewFileDesign?: React.ReactNode;
  heading: string;
  para: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileSelected: boolean;
  handleConvert: () => void;
  PreviewFileType:
    | "pdf"
    | "json"
    | "csv"
    | "xlsx"
    | "pptx"
    | "doc"
    | "docx"
    | "html"
    | "txt";
  accept: string;
  label: string;
  btnText: string;
  isDownloadCompleted: boolean;
  extractedText?: string;
}
const PdfFile = ({
  previewFileDesign,
  heading,
  para,
  onFileUpload,
  fileSelected,
  handleConvert,
  accept,
  label,
  btnText,
  isDownloadCompleted,
  extractedText,
}: PdfFileProps) => {
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );

  return (
    <div className="min-h-screen px-4 py-12">
      <div
        className={`mx-auto
        ${fileSelected ? "max-w-4xl" : "max-w-xl"}
        `}
      >
        <div className="text-center mb-10">
          <h1
            className="text-3xl sm:text-4xl font-semibold
           text-black leading-tight tracking-tight  mb-3"
          >
            {heading}
          </h1>
          <p
            className="text-gray-500 max-w-2xl mx-auto md:text-lg text-sm
          font-semibold text-center
          "
          >
            {para}
          </p>
        </div>

        <div
          className="bg-white/40 text-blue rounded-2xl shadow-lg
         border border-gray-100 p-6 sm:pt-10"
        >
          <UploadModal
            fileSelected={fileSelected}
            isDownloadCompleted={isDownloadCompleted}
            clearDownloadCompleted={clearDownloadCompleted}
            handleFileUpload={onFileUpload}
            accept={accept}
            label={label}
          />

          {!fileSelected && !isDownloadCompleted && (
            <p className="text-blue mt-8 text-center">Upload a file to start</p>
          )}

          <div className="mt-10">
            {extractedText && (
              <ExtractedTextPreview text={extractedText as string} />
            )}
            <Suspense fallback={<GlobalLoader />}>
              <PreviewFile previewFileDesign={previewFileDesign as any} />
            </Suspense>
          </div>

          {fileSelected && !isDownloadCompleted && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleConvert}
                className="
                bg-blue hover:bg-gradient-to-r from-blueprimary to-teal text-white font-semibold
                px-10 py-4 rounded-xl max-w-xs w-full mx-auto
                transition
                shadow-card
              "
              >
                {btnText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfFile;
