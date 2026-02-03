import { useState, useRef } from "react";
import { pdfUploadBg } from "../assets/images";

interface UploadModalProps {
  handleFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  label: string;
}

const UploadModal = ({
  handleFileUpload,
  accept = ".csv,.xlsx,.xls,.json,.pdf,.jpg,.jpeg,.png,.ppt,.doc,.docx,.pptx",
  label = "Select a file",
}: UploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(e);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(e);
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload?.({
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <>
      <div
        className="flex flex-col items-center justify-center w-full"
        onDragEnter={preventDefaults}
        onDragOver={preventDefaults}
        onDrop={preventDefaults}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileUpload}
          className="hidden"
        />

        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-all shadow-card
          w-full max-w-sm h-auto flex flex-col items-center justify-center cursor-pointer
          ${isDragging ? "border-blue hover:border-teal" : "border-gray-300"}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <img
            src={pdfUploadBg}
            alt="pdf upload bg"
            className="w-full h-full object-cover"
          />
          <button className=" bg-blue hover:bg-teal text-white px-4 py-2 rounded-md transition">
            Browse
          </button>
          <p className="text-gray-600 pt-4">{label}</p>
          <p className="text-gray-500 text-sm text-center">Supported formats: {accept}</p>
        </div>
      </div>
    </>
  );
};

export default UploadModal;
