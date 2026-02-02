import React, { useState } from "react";
import useFilesStore from "../store/useSheetStore";
import { IoMdClose } from "react-icons/io";
import UploadModal from "./UploadModal";

interface CustomInputModalProps {
  fileSelected: boolean;
  label: string;
  accept: string;
  isDownloadCompleted: boolean;
  clearDownloadCompleted: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInputModal = ({
  fileSelected,
  label,
  accept,
  isDownloadCompleted,
  clearDownloadCompleted,
  onFileUpload,
}: CustomInputModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        {(!fileSelected || isDownloadCompleted) && (
          <button
            onClick={() => {
              setModalOpen(true);
              setSelectedFile(null);
              clearDownloadCompleted();
            }}
            className="
               w-full sm:w-full max-w-md mx-auto
              px-10 py-4
              border-2 border-dashed border-blue/30
              rounded-xl text-blueprimary font-medium
              hover:border-blue 
              transition
            "
          >
            {label}
          </button>
        )}
        <p className="text-xs text-blue/80 font-medium">Supported format: {accept}</p>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-blueprimary rounded-xl p-6 w-full max-w-lg relative">
            <button
              className="absolute sm:top-4 sm:right-4 top-1 right-2 text-blueprimary"
              onClick={() => setModalOpen(false)}
            >
              <IoMdClose size={24} />
            </button>

            <UploadModal
              handleFileUpload={(e: React.ChangeEvent<HTMLInputElement>) => {
                onFileUpload(e);
                setModalOpen(false);
              }}
              accept={accept}
              label={label}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomInputModal;
