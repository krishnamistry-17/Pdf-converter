import { useRef, useState } from "react";
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
            w-full
            rounded-xl
            border-2 border-dashed
            px-6 py-10
            text-center
            cursor-pointer
            transition-all
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary"
            }
          `}
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <FaUpload size={28} />
              </div>
            </div>

            <button
              type="button"
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              Choose Files
            </button>
            <p className="text-sm text-text-body font-medium mt-3">{label}</p>
            <p className="mt-1 text-sm text-text-body">Or drop file here</p>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadModal;
