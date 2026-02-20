import { useEffect, useState } from "react";
import { useRotatedPdfStore } from "../../store/useRotatePdfStore";
import SelectFile from "../../components/SelectFile";
import RotatePreviewGrid from "../../components/rotatepdf/RotatePreviewGrid";
import { IoMdAdd, IoMdClose, IoMdTrash } from "react-icons/io";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import UploadModal from "../../components/UploadModal";
import useMobileSize from "../../hooks/useMobileSize";
import Rotatepdfsidebar from "../../components/rotatepdf/Rotatepdfsidebar";
import { FaBars } from "react-icons/fa";

const RotatePdf = () => {
  const isMobile = useMobileSize();
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
  const [_isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rotatePdfClicked, setRotatePdfClicked] = useState(false);
  const [newSelectedFiles, setNewSelectedFiles] = useState<File[]>([]);
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );

  useEffect(() => {
    return () => {
      clearResults();
      clearSelectRotateFile();
      setNewSelectedFiles([]);
    };
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
    if (results.length >= 3) {
      toast.error("You can only rotate up to 3 extra files");
      return;
    }

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
      setRotatePdfClicked(false);
    }
  };

  const handleReset = () => {
    clearResults();
    clearSelectRotateFile();
    setNewSelectedFiles([]);
    setRotatePdfClicked(false);
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
                className=" text-text-body cursor-pointer underline text-md"
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
                className="text-text-body cursor-pointer underline text-md"
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

  const containerWidth = results.length > 1 ? "max-w-2xl" : "max-w-xl";

  return (
    <>
      <div className="relative lg:flex flex-col   px-4 lg:py-12 py-6">
        {/**Mobile header */}
        {isMobile && isSidebarVisible && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
            <button
              onClick={handleReset}
              className="text-sm font-medium text-gray-600"
            >
              Close
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setRotatePdfClicked(true);
              }}
              className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg"
            >
              Rotate PDF
            </button>
          </div>
        )}
        <div
          className={`flex-1  transition-all duration-300 
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
        `}
        >
          <div className={`mx-auto w-auto ${containerWidth}`}>
            <SelectFile
              heading="Rotate PDF"
              description="Rotate a PDF file by 90 degrees."
            />
            <div
              className="bg-white/40 text-text-body rounded-2xl shadow-lg 
            border border-gray-100 p-4"
            >
              {results.length === 0 && (
                <UploadModal
                  handleFileUpload={handleFileUpload}
                  accept=".pdf"
                  label="Select a PDF"
                  fileSelected={results.length > 0}
                  isDownloadCompleted={downloadCompleted}
                  clearDownloadCompleted={clearDownloadCompleted}
                />
              )}
              {results.length > 0 && (
                <>
                  <RotatePreviewGrid />
                </>
              )}
            </div>
          </div>
        </div>

        {!isMobile && isSidebarVisible && (
          <aside className="fixed top-0 right-0 h-full w-[380px] bg-bg-card border-l border-border shadow-lg z-50">
            <Rotatepdfsidebar
              handleReset={handleReset}
              mergeDisplayFiles={mergeDisplayFiles}
              handleRotateFromRight={handleRotateFromRight}
              handleRotateFromLeft={handleRotateFromLeft}
              handleDownloadRotatedPdf={handleDownloadRotatedPdf}
            />

            <div className=" fixed  top-[20%]  z-50 flex flex-col gap-3 -ml-8">
              <button
                onClick={handleAddMoreFiles}
                className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
              >
                <IoMdAdd />
              </button>
            </div>
          </aside>
        )}

        {isMobile && rotatePdfClicked && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
            <div className="bg-white w-full h-[85vh] rounded-t-2xl shadow-xl flex flex-col mx-2">
              <div className="flex items-center justify-center px-4 py-3 border-b cursor-grab">
                <FaBars />
              </div>
              {/*Header */}
              <div className="flex items-center justify-end px-4 py-3 border-b">
                <button onClick={() => setRotatePdfClicked(false)}>
                  <IoMdClose />
                </button>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-y-auto mx-4 mt-4">
                <Rotatepdfsidebar
                  handleReset={handleReset}
                  mergeDisplayFiles={mergeDisplayFiles}
                  handleRotateFromRight={handleRotateFromRight}
                  handleRotateFromLeft={handleRotateFromLeft}
                  handleDownloadRotatedPdf={handleDownloadRotatedPdf}
                />
              </div>
            </div>
          </div>
        )}

        {isMobile && selectRotateFile && (
          <>
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
              <button
                onClick={handleAddMoreFiles}
                className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
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
