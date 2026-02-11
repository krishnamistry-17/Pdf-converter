import SelectFile from "../../../components/SelectFile";
import UploadModal from "../../../components/UploadModal";
import useMobileSize from "../../../hooks/useMobileSize";
import { useEditPdfStore } from "../../../store/useEditPdfStore";
import { useFileSessionStore } from "../../../store/useFileSessionStore";
import PdfEditPreviewGrid from "../../../components/PdfEdit/PdfEditPreviewGrid";
import { IoMdClose } from "react-icons/io";
import type { EditPdfResult } from "../../../types/pageResult";
import PdfEditSidebar from "../../../components/PdfEdit/PdfEditSidebar";
import Toolbar from "../../../components/PdfEdit/Toolbar";

const PdfEdit = () => {
  const isMobile = useMobileSize();
  const {
    results,
    setSelectedFile,
    setResults,
    clearResults,
    clearSelectedFile,
  } = useEditPdfStore();
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );

  const isSidebarVisible = results.length > 0;
  console.log("isSidebarVisible", isSidebarVisible);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    setResults([
      {
        name: file.name,
        blob: file,
        url: URL.createObjectURL(file),
        fileName: file.name,
      } as unknown as EditPdfResult,
    ]);
  };

  const handleReset = () => {
    clearResults();
    clearSelectedFile();
  };

  return (
    <div className="relative ">
      {results.length > 0 && (
        <div className="sticky top-0 z-40 border-b border-border bg-bg-card">
          <Toolbar />
        </div>
      )}

      <div className="flex">
        <main
          className={`flex-1 transition-all duration-300 ${
            !isMobile && isSidebarVisible ? "mr-[380px]" : ""
          }`}
        >
          <div className="mx-auto max-w-xl px-4 py-6">
            {results.length === 0 && (
              <>
                <SelectFile
                  heading="Edit PDF"
                  description="Edit text, images, and pages."
                />
                <div className="mt-6 rounded-xl border border-border bg-bg-card p-8 shadow-sm">
                  <UploadModal
                    handleFileUpload={handleFileUpload}
                    accept=".pdf"
                    label="Select a PDF"
                    fileSelected={results.length > 0}
                    isDownloadCompleted={downloadCompleted}
                    clearDownloadCompleted={clearDownloadCompleted}
                  />
                </div>
              </>
            )}
          </div>
          {results.length > 0 && (
            <div className="rounded-xl  bg-bg-canvas  mx-4">
              <PdfEditPreviewGrid />
            </div>
          )}
        </main>

        {!isMobile && isSidebarVisible && (
          <aside className="fixed right-0 top-0 z-50 h-screen w-[380px] border-l border-border bg-bg-card shadow-lg">
            <div className="relative h-full p-6">
              <button
                className="absolute right-4 top-4 text-text-muted hover:text-text-body"
                onClick={handleReset}
              >
                <IoMdClose size={20} />
              </button>
              <PdfEditSidebar />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default PdfEdit;
