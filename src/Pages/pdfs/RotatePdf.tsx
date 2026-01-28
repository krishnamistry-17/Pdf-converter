import { useEffect, useState } from "react";
import { useRotatedPdfStore } from "../../store/useRotatePdfStore";
import SelectFile from "../../components/SelectFile";
import InputField from "../../components/InputField";
import RotatePreviewGrid from "../../components/rotatepdf/RotatePreviewGrid";
import {
  IoMdAdd,
  IoMdArrowForward,
  IoMdClose,
  IoMdTrash,
} from "react-icons/io";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";
import { FaRotateLeft, FaRotateRight } from "react-icons/fa6";
import { toast } from "react-toastify";

const RotatePdf = () => {
  const [isMobile, setIsMobile] = useState(false);
  const setLoading = useFilesStore((state) => state.setLoading);
  const {
    results,
    setResults,
    setSelectRotateFile,
    selectRotateFile,
    clearSelectRotateFile,
    clearResults,
  } = useRotatedPdfStore();
  const { displayPdf, rotatePdfDownload } = useUploadData();

  const [newSelectedFiles, setNewSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectRotateFile(file);

    const url = await displayPdf(file);

    setResults([
      {
        name: file.name,
        blob: file,
        url,
        rotation: 0,
        fileName: file.name,
        pages: 1,
      },
    ]);
  };

  const handleAddMoreFiles = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const url = await displayPdf(file);
      setResults([
        ...results,
        {
          name: file.name,
          blob: file,
          url,
          rotation: 0,
          fileName: file.name,
          pages: results.length + 1,
        },
      ]);
      setNewSelectedFiles((prev) => [...prev, file]);
    };

    input.click();
  };

  const handleDeleteSelectedFile = () => {
    if (!selectRotateFile) return;

    setResults(results.filter((file) => file.name !== selectRotateFile?.name));
    clearSelectRotateFile();
    setNewSelectedFiles((prev) =>
      prev.filter((file) => file.name !== selectRotateFile?.name)
    );
  };

  const handleDeleteExtraFile = (fileName: string) => {
    setNewSelectedFiles((prev) =>
      prev.filter((file) => file.name !== fileName)
    );
    setResults(results.filter((file) => file.name !== fileName));
  };

  const handleDownloadRotatedPdf = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      await rotatePdfDownload(results, "rotated.pdf");
      clearResults();
      toast.success("Download successful!");
    } catch (error) {
      console.error(error);
      toast.error("Download failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clearResults();
    clearSelectRotateFile();
    setNewSelectedFiles([]);
  };

  const handleRotateFromRight = () => {
    setResults(
      results.map((file) => ({
        ...file,
        rotation: ((file.rotation ?? 0) + 90) % 360,
      }))
    );
  };

  const handleRotateFromLeft = () => {
    setResults(
      results.map((file) => ({
        ...file,
        rotation: ((file.rotation ?? 0) - 90) % 360,
      }))
    );
  };

  const mergeDisplayFiles = () => {
    return (
      <div className="flex flex-col gap-2 my-4">
        <div className="flex flex-col gap-2">
          {selectRotateFile && (
            <div
              className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
              border border-gray-200 rounded-md p-3 "
            >
              {selectRotateFile?.name}
              <button
                className="text-blue-500 cursor-pointer underline text-md"
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
              border border-gray-200 rounded-md p-3 "
            >
              {file.name}
              <button
                className="text-blue-500 cursor-pointer underline text-md"
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

  const isSidebarVisible = results.length > 0;

  return (
    <>
      <div className="relative lg:flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 sm:p-10">
          <div className="flex flex-col items-center px-4 sm:px-10 lg:py-0 py-4">
            <div className="max-w-lg">
              <SelectFile
                heading="Rotate PDF"
                description="Rotate a PDF file by 90 degrees."
              />
            </div>
            {results.length === 0 && (
              <div className="w-full flex justify-center">
                <InputField
                  handleFileUpload={handleFileUpload}
                  accept=".pdf"
                  label="Select a file"
                />
              </div>
            )}
            {results.length === 0 && (
              <p className="text-gray-500 mt-8">Upload a PDF to start</p>
            )}
            {results.length > 0 && <RotatePreviewGrid />}
          </div>
        </div>

        {isMobile && results.length > 0 && (
          <div className=" flex flex-col mt-4">
            <h2 className="text-xl font-semibold py-4">SelectedFiles</h2>
            {mergeDisplayFiles()}

            <button
              className="bg-blue-500 text-white w-full py-2 rounded-md flex justify-center items-center"
              onClick={handleDownloadRotatedPdf}
            >
              Download Rotated PDF <IoMdArrowForward className="ml-2" />
            </button>
          </div>
        )}

        {!isMobile && isSidebarVisible && (
          <aside className="fixed top-0 right-0 h-full w-[380px] bg-white border-l shadow-lg z-50">
            <div className="p-6">
              <button className="absolute top-5 right-5" onClick={handleReset}>
                <IoMdClose />
              </button>

              <h2 className="text-xl font-semibold border-b pb-4">
                Rotate PDF
              </h2>

              <div className="flex justify-between mt-6">
                <p className="font-semibold">Files</p>
                <button
                  onClick={handleReset}
                  className="text-blue-500 underline"
                >
                  Reset All
                </button>
              </div>

              {mergeDisplayFiles()}

              <div className=" my-4 bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition cursor-pointer">
                <p>Mouse over below to see the rotation of the pages</p>
              </div>

              <div className="flex flex-col gap-2 my-4">
                <div
                  className="flex items-center gap-2 bg-blue-400 text-white p-2 rounded-md"
                  onClick={() => handleRotateFromRight()}
                >
                  <div className="bg-blue-600 p-1 rounded-md">
                    <FaRotateRight className=" " />
                  </div>
                  <p>Rotate From Right</p>
                </div>
                <div
                  className="flex items-center gap-2 bg-blue-400 text-white p-2 rounded-md"
                  onClick={() => handleRotateFromLeft()}
                >
                  <div className="bg-blue-600 p-1 rounded-md">
                    <FaRotateLeft className=" " />
                  </div>
                  <p>Rotate From Left</p>
                </div>
              </div>

              <button
                className="bg-blue-500 text-white w-full py-2 rounded-md flex justify-center items-center"
                onClick={handleDownloadRotatedPdf}
              >
                Download Rotated PDF <IoMdArrowForward className="ml-2" />
              </button>
            </div>

            <div className="absolute top-1/5 -left-8 flex flex-col gap-3">
              <button
                onClick={handleAddMoreFiles}
                className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
              >
                <IoMdAdd />
              </button>
            </div>
          </aside>
        )}

        {isMobile && isSidebarVisible && (
          <>
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
              <button
                onClick={handleAddMoreFiles}
                className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              >
                <IoMdAdd />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RotatePdf;
