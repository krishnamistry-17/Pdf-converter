import { lazy, Suspense, useEffect, useState } from "react";
const PreviewFile = lazy(() => import("../PreviewFile"));
import { useFileSessionStore } from "../../store/useFileSessionStore";
import GlobalLoader from "../GlobalLoader";
import ExtractedTextPreview from "../OCR/ExtractedTextPreview";
import UploadModal from "../UploadModal";
import useMobileSize from "../../hooks/useMobileSize";
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
  const isPdfPreview = accept === ".pdf";
  const isMobile = useMobileSize();

  const [previewOpen, setIsPreviewOpen] = useState(false);

  //use this bcz this works also in other browser instead of using stopscroll hook
  useEffect(() => {
    if (previewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [previewOpen]);

  const handlePreviewPdf = () => {
    if (isMobile) {
      window.open(previewFileDesign as string, "_blank");
    } else {
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className=" px-4 py-12">
      <div
        className={`mx-auto
        ${fileSelected ? "w-auto max-w-xl" : "max-w-xl"}
        `}
      >
        <div className="text-center mb-10">
          <h1
            className="text-3xl sm:text-4xl font-semibold
           text-text-heading leading-tight tracking-tight  mb-3"
          >
            {heading}
          </h1>
          <p
            className="text-text-body max-w-2xl mx-auto text-sm
          font-medium text-center
          "
          >
            {para}
          </p>
        </div>

        <div
          className="bg-white/40 text-text-body rounded-2xl shadow-lg
         border border-gray-100 p-10"
        >
          <UploadModal
            fileSelected={fileSelected}
            isDownloadCompleted={isDownloadCompleted}
            clearDownloadCompleted={clearDownloadCompleted}
            handleFileUpload={onFileUpload}
            accept={accept}
            label={label}
          />

          <div>
            {extractedText && (
              <ExtractedTextPreview text={extractedText as string} />
            )}
            <Suspense fallback={<GlobalLoader />}>
              <PreviewFile previewFileDesign={previewFileDesign as any} />
            </Suspense>
          </div>

          {fileSelected && !isDownloadCompleted && (
            <div className="mt-10 flex justify-center items-center gap-4">
              {isPdfPreview && (
                <button
                  className="bg-primary hover:bg-primary-hover text-white font-semibold lg:block hidden
                px-10 py-3 rounded-xl max-w-xs w-full mx-auto
                transition
                shadow-card"
                  onClick={() => {
                    setIsPreviewOpen(true);
                    handlePreviewPdf();
                  }}
                >
                  Preview PDF
                </button>
              )}
              <button
                onClick={handleConvert}
                className="
                bg-primary hover:bg-primary-hover text-white font-semibold
                px-10 py-3 rounded-xl max-w-xs w-full mx-auto
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
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:flex hidden items-center justify-center">
          <div className="bg-white rounded-xl w-[90%] max-w-3xl h-[80vh] relative shadow-xl">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-0 right-2 text-white "
            >
              ✕
            </button>

            <iframe
              src={previewFileDesign as string}
              className="w-full h-full rounded-b-xl"
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfFile;
