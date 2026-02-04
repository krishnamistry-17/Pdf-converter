import { useState } from "react";

import SelectFile from "../../components/SelectFile";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import useImageStore from "../../store/useImageStore";
import {
  IoMdAdd,
  IoMdArrowForward,
  IoMdClose,
  IoMdTrash,
} from "react-icons/io";
import type { ImageResult } from "../../types/pageResult";
import JpgPreviewGrid from "../../components/JpgPreviewGrid";
import useFilesStore from "../../store/useSheetStore";
import { toast } from "react-toastify";
import useUploadData from "../../hooks/useUploadData";
import UploadModal from "../../components/UploadModal";
import useMobileSize from "../../hooks/useMobileSize";

const JpgToPdf = () => {
  const isMobile = useMobileSize();
  const [newSelectedFiles, setNewSelectedFiles] = useState<File[]>([]);
  const setLoading = useFilesStore((state) => state.setLoading);
  const { ConvertJpgToPdf } = useUploadData();
  const { results, setResults, selectedFile, setSelectedFile } =
    useImageStore();

  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );
  const clearSelectedFile = useImageStore((state) => state.clearSelectedFile);
  const clearResults = useImageStore((state) => state.clearResults);
  const isSidebarVisible = results.length > 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file as any);
    setResults([
      {
        name: file.name,
        blob: file as File,
        url: URL.createObjectURL(file as File) as string,
        fileName: file.name,
        pages: 1,
      } as ImageResult,
    ]);
  };

  const handleAddMoreFiles = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg,.jpeg,.png";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setNewSelectedFiles([...newSelectedFiles, file]);
      setResults([
        ...results,
        {
          name: file.name,
          blob: file as File,
          url: URL.createObjectURL(file as File) as string,
          fileName: file.name,
          pages: 1,
        } as ImageResult,
      ]);
    };
    input.click();
  };

  const handleDeleteSelectedFile = () => {
    if (!selectedFile) return;
    setResults(results.filter((result) => result.name !== selectedFile.name));
    clearSelectedFile();
  };

  const handleDeleteExtraFile = (fileName: string) => {
    setNewSelectedFiles((prev) => prev.filter((f) => f.name !== fileName));
    setResults(results.filter((result) => result.name !== fileName));
  };

  const handleConvertToPdf = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));

    try {
      await ConvertJpgToPdf(results);
      toast.success("Conversion successful!");
      clearResults();
      clearSelectedFile();
      setDownloadCompleted(true);
    } catch (error) {
      console.error(error);
      toast.error("Conversion failed!");
    } finally {
      setLoading(false);
    }
  };

  const mergeDisplayFiles = () => {
    return (
      <div className="flex flex-col gap-2 sm:my-4 my-2">
        <div className="flex flex-col gap-2">
          {selectedFile && (
            <div
              className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
              border border-gray-200 rounded-md p-3  truncate"
            >
              {selectedFile?.name}
              <button
                className="text-blue cursor-pointer underline text-md"
                onClick={handleDeleteSelectedFile}
              >
                <IoMdTrash />
              </button>
            </div>
          )}
          {newSelectedFiles?.map((file: any) => (
            <div
              key={file.name}
              className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
              border border-gray-200 rounded-md p-3  truncate"
            >
              {file.name}
              <button
                className="text-blue cursor-pointer underline text-md"
                onClick={() => handleDeleteExtraFile(file.name)}
              >
                <IoMdTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleReset = () => {
    setResults([]);
    clearSelectedFile();
    clearResults();
  };

  return (
    <>
      <div className="relative lg:flex flex-col min-h-screen  px-4 py-12">
        <div
          className={`flex-1  transition-all duration-300 
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
      `}
        >
          <div className={`mx-auto
            ${results.length > 0 ? "max-w-4xl" : "max-w-xl"}
          `}>
            <SelectFile
              heading="Convert Jpg to Pdf"
              description="This tool will convert Jpg files to Pdf files."
            />
            <div className="bg-white/40 text-blue rounded-2xl shadow-lg border border-gray-100 p-6 sm:pt-10 sm:pb-14">
              {results.length === 0 && (
                <UploadModal
                  fileSelected={results.length > 0}
                  isDownloadCompleted={downloadCompleted}
                  clearDownloadCompleted={clearDownloadCompleted}
                  handleFileUpload={handleFileUpload}
                  accept=".jpg,.jpeg,.png"
                  label="Select a Jpg"
                />
              )}
              {results.length === 0 && (
                <p className="text-blue mt-8 text-center">
                  Upload a Jpg to start
                </p>
              )}
              {results.length > 0 && (
                <>
                  {isMobile && selectedFile && (
                    <div className=" flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold py-4">
                          SelectedFiles
                        </h2>
                        <p
                          className="text-blue text-sm underline cursor-pointer"
                          onClick={handleReset}
                        >
                          Reset All
                        </p>
                      </div>
                      {mergeDisplayFiles()}
                      <button
                        className="bg-blue hover:bg-gradient-to-r from-blue to-teal text-white w-full py-2 rounded-md flex justify-center items-center"
                        onClick={handleConvertToPdf}
                      >
                        Convert to Pdf
                        <IoMdArrowForward className="ml-2" />
                      </button>
                    </div>
                  )}
                  <JpgPreviewGrid
                    images={results.map((result) => result.url)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {!isMobile && isSidebarVisible && (
          <aside className="fixed top-0 right-0 h-full w-[380px] bg-sea border-l border-blue shadow-lg z-50">
            <div className="p-6">
              <button className="absolute top-5 right-5" onClick={handleReset}>
                <IoMdClose />
              </button>
              <h2 className="text-xl font-semibold text-blue border-b border-blue/30 pb-4">
                Convert Jpg to Pdf
              </h2>

              <div className="flex justify-between mt-6">
                <p className="font-semibold">Images</p>
                <button
                  onClick={handleReset}
                  className="text-blue text-sm underline"
                >
                  Reset All
                </button>
              </div>
              {mergeDisplayFiles()}

              <button
                className="bg-blue hover:bg-gradient-to-r from-blue to-teal text-white w-full py-2 rounded-md flex justify-center items-center"
                onClick={handleConvertToPdf}
              >
                Convert to Pdf
                <IoMdArrowForward className="ml-2" />
              </button>
            </div>
            <div className=" fixed  top-[20%]  z-50 flex flex-col gap-3 -ml-8">
              <button
                onClick={handleAddMoreFiles}
                className="bg-teal text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
              >
                <IoMdAdd />
              </button>
            </div>
          </aside>
        )}
        {isMobile && selectedFile && (
          <div className=" fixed bottom-4 right-4 z-50 flex flex-col gap-3">
            <button
              onClick={handleAddMoreFiles}
              className="bg-teal text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            >
              <IoMdAdd />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default JpgToPdf;
