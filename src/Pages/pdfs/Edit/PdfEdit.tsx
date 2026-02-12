import SelectFile from "../../../components/SelectFile";
import UploadModal from "../../../components/UploadModal";
import { useEditPdfStore } from "../../../store/useEditPdfStore";
import { useFileSessionStore } from "../../../store/useFileSessionStore";
import PdfEditPreviewGrid from "../../../components/PdfEdit/PdfEditPreviewGrid";
import type { EditPdfResult } from "../../../types/pageResult";
import { useEffect } from "react";

const PdfEdit = () => {
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
    e.target.value = "";
  };

  useEffect(() => {
    return () => {
      clearResults();
      clearSelectedFile();
    };
  }, []);

  const handleReset = () => {
    clearResults();
    clearSelectedFile();
  };

  return (
    <div className="px-4 lg:py-12 py-6">
      {/* {results.length > 0 && (
        <div className="sticky top-0 z-40 border-b border-border bg-bg-card">
          <Toolbar />
        </div>
      )} */}

      <div className="flex-1">
        <main className="transition-all duration-300">
          <div className="mx-auto max-w-xl">
            {results.length === 0 && (
              <>
                <SelectFile
                  heading="Edit PDF"
                  description="Edit text, images, and pages."
                />
                <div
                  className="bg-white/40 text-text-body rounded-2xl shadow-lg
           border border-gray-100 p-4"
                >
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
            <div className="rounded-xl  bg-bg-canvas">
              <PdfEditPreviewGrid handleReset={handleReset} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PdfEdit;
