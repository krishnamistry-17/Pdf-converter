import SelectFile from "../../../components/SelectFile";
import UploadModal from "../../../components/UploadModal";

import { useEditPdfStore } from "../../../store/useEditPdfStore";
import { useFileSessionStore } from "../../../store/useFileSessionStore";
import PdfEditPreviewGrid from "../../../components/PdfEdit/PdfEditPreviewGrid";

import type { EditPdfResult } from "../../../types/pageResult";

import Toolbar from "../../../components/PdfEdit/Toolbar";


const PdfEdit = () => {
  const { results, setSelectedFile, setResults } = useEditPdfStore();
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
    e.target.value = "";
  };

  return (
    <div className="relative ">
      {results.length > 0 && (
        <div className="sticky top-0 z-40 border-b border-border bg-bg-card">
          <Toolbar />
        </div>
      )}

      <div className="flex">
        <main className="flex-1 transition-all duration-300">
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
      </div>
    </div>
  );
};

export default PdfEdit;
