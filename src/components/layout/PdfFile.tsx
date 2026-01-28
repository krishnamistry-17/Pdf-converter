import { useEffect, useState } from "react";

import PreviewFile from "../PreviewFile";
import useFilesStore from "../../store/useSheetStore";
import UploadModal from "../UploadModal";
import { IoMdClose } from "react-icons/io";
import ToastError from "../ToastError";
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
    | "html";
  accept: string;
  label: string;
  btnText: string;
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
}: PdfFileProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {heading}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{para}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-10">
          <div className="flex flex-col items-center gap-4">
            {fileSelected === false && (
              <button
                onClick={() => {
                  setModalOpen(true);
                  setSelectedFile(null);
                }}
                className="
               w-full sm:w-auto
              px-10 py-4
              border-2 border-dashed border-gray-300
              rounded-xl text-gray-600 font-medium
              hover:border-blue-500 hover:text-blue-600
              transition
            "
              >
                {label}
              </button>
            )}
            <ToastError />
            <p className="text-xs text-gray-400">Supported format: {accept}</p>
          </div>

          <div className="mt-10">
            <PreviewFile previewFileDesign={previewFileDesign as any} />
          </div>

          {fileSelected && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleConvert}
                className="
                bg-blue-600 text-white font-semibold
                px-10 py-4 rounded-xl
                hover:bg-blue-700 transition
                shadow-md
              "
              >
                {btnText}
              </button>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
            <button
              className="absolute sm:top-4 sm:right-4 top-1 right-2 text-gray-500"
              onClick={() => setModalOpen(false)}
            >
              <IoMdClose size={24} />
            </button>

            <UploadModal
              handleFileUpload={(e) => {
                onFileUpload(e);
                setModalOpen(false);
              }}
              accept={accept}
              label={label}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfFile;
