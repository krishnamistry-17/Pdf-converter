import { useRef, useState } from "react";
import { pdfUploadBg } from "../assets/images";

interface UploadModalProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => any;
  accept: string;
  label: string;
  fileSelected: boolean;
  isDownloadCompleted: boolean;
  clearDownloadCompleted: () => void;
}
const UploadModal = ({
  handleFileUpload,
  accept,
  label,
  fileSelected,
  isDownloadCompleted,
  clearDownloadCompleted,
}: UploadModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileInputEvent = {
        target: {
          files: e.dataTransfer.files,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleFileUpload?.(fileInputEvent);
      e.dataTransfer.clearData();
    }
  };

  return (
    <>
      {(!fileSelected || isDownloadCompleted) && (
        <div className="flex flex-col items-center justify-center w-full">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
          />

          <div
            onClick={() => {
              inputRef.current?.click();
              clearDownloadCompleted();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 shadow-card
              w-full max-w-sm flex flex-col items-center justify-center cursor-pointer
              transition-all
              ${
                isDragging
                  ? "border-blue bg-blue/5 scale-[1.02]"
                  : "border-gray-300 hover:border-blue"
              }
            `}
          >
            <img
              src={pdfUploadBg}
              alt="pdf upload bg"
              className="w-full h-full object-cover"
            />

            <button
              className="bg-blue hover:bg-teal text-white px-4 py-2 rounded-md transition mt-4"
              type="button"
            >
              Browse
            </button>

            <p className="text-gray-600 pt-4 text-center ">{label}</p>
            <p className="text-gray-500 text-sm text-center">
              Drag & drop or browse • {accept}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadModal;

{
  /*import { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
interface UploadModalProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => any;
  accept: string;
  label: string;
  fileSelected: boolean;
  isDownloadCompleted: boolean;
  clearDownloadCompleted: () => void;
}
const UploadModal = ({
  handleFileUpload,
  accept,
  label,
  fileSelected,
  isDownloadCompleted,
  clearDownloadCompleted,
}: UploadModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      const event = {
        target: { files: e.dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>;

      handleFileUpload?.(event);
    }
  };

  return (
    <>
      {(!fileSelected || isDownloadCompleted) && (
        <div className="flex items-center justify-center w-full">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
          />

          <div
            onClick={() => {
              inputRef.current?.click();
              clearDownloadCompleted();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              w-full max-w-md
              rounded-2xl
              border-2 border-dashed
              px-8 py-10
              text-center
              cursor-pointer
              transition-all duration-200
              ${
                isDragging
                  ? "border-blue bg-blue/5 scale-[1.02]"
                  : "border-gray-300 bg-white hover:border-blue"
              }
            `}
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue/10 text-blue">
                <FaUpload size={28} />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              Upload your file
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Drag & drop your file here
            </p>

            <p className="text-xs text-gray-400 mt-1">{label}</p>

            <button
              type="button"
              className="
                mt-6
                inline-flex items-center justify-center
                bg-blue hover:bg-teal
                text-white
                px-6 py-2.5
                rounded-md
                font-medium
                transition
              "
            >
              Browse files
            </button>

            <p className="mt-4 text-xs text-gray-400">
              Supported formats: {accept}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadModal;
 */
}
