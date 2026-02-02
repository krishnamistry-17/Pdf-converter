import { lazy, Suspense, useEffect, useState } from "react";
const PreviewFile = lazy(() => import("../PreviewFile"));

import { useFileSessionStore } from "../../store/useFileSessionStore";
import CustomInputModal from "../CustomInputModal";
import GlobalLoader from "../GlobalLoader";
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
}: PdfFileProps) => {
  const [modalOpen, _setModalOpen] = useState(false);
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );

  useEffect(() => {
    if (modalOpen) {
      const stopScrollOutSide = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      document.addEventListener("wheel", stopScrollOutSide, { passive: false });
      return () => {
        document.removeEventListener("wheel", stopScrollOutSide);
      };
    }
  }, [modalOpen]);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1
            className="text-3xl sm:text-4xl font-bold
           text-blueprimary leading-tight tracking-tight  mb-3"
          >
            {heading}
          </h1>
          <p
            className="text-teal max-w-2xl mx-auto md:text-lg text-sm
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
          <CustomInputModal
            fileSelected={fileSelected}
            label={label}
            accept={accept}
            isDownloadCompleted={isDownloadCompleted}
            clearDownloadCompleted={clearDownloadCompleted}
            onFileUpload={onFileUpload}
          />

          {!fileSelected && !isDownloadCompleted && (
            <p className="text-blueprimary mt-8 text-center">
              Upload a file to start
            </p>
          )}

          <div className="mt-10">
            <Suspense fallback={<GlobalLoader />}>
              <PreviewFile previewFileDesign={previewFileDesign as any} />
            </Suspense>
          </div>

          {fileSelected && !isDownloadCompleted && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleConvert}
                className="
                bg-blueprimary hover:bg-gradient-to-r from-blueprimary to-teal text-white font-semibold
                px-10 py-4 rounded-xl
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
