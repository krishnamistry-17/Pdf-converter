import { useEffect, useState } from "react";
import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import SelectFile from "../../components/SelectFile";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import {
  IoMdAdd,
  IoMdArrowForward,
  IoMdClose,
  IoMdTrash,
} from "react-icons/io";
import { useOrganizeStore } from "../../store/useOrganizeStore";
import UploadModal from "../../components/UploadModal";
import useMobileSize from "../../hooks/useMobileSize";

const MergePdfComponent = () => {
  const isMobile = useMobileSize();

  const [pdfPreview1, setPdfPreview1] = useState<string | null>(null);
  const [pdfPreview2, setPdfPreview2] = useState<string | null>(null);

  const results = useOrganizeStore((state) => state.results);
  const setResults = useOrganizeStore((state) => state.setResults);
  const clearResults = useOrganizeStore((state) => state.clearResults);

  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );
  const isSidebarVisible = results.length > 0;

  const clearMergeFile1 = useFilesStore((state) => state.clearMergeFile1);
  const clearMergeFile2 = useFilesStore((state) => state.clearMergeFile2);

  const mergeFile1 = useFilesStore((state) => state.mergeFile1);
  const mergeFile2 = useFilesStore((state) => state.mergeFile2);

  const selectedMergeFile1 = useFilesStore((state) => state.selectedMergeFile1);
  const selectedMergeFile2 = useFilesStore((state) => state.selectedMergeFile2);
  const setSelectedMergeFile1 = useFilesStore(
    (state) => state.setSelectedMergeFile1
  );
  const setSelectedMergeFile2 = useFilesStore(
    (state) => state.setSelectedMergeFile2
  );
  const clearSelectedMergeFile1 = useFilesStore(
    (state) => state.clearSelectedMergeFile1
  );
  const clearSelectedMergeFile2 = useFilesStore(
    (state) => state.clearSelectedMergeFile2
  );

  const setMergeFile1 = useFilesStore((state) => state.setMergeFile1);
  const setMergeFile2 = useFilesStore((state) => state.setMergeFile2);

  const setLoading = useFilesStore((state) => state.setLoading);
  const { MergePdfs } = useUploadData();

  const handleFileUpload1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMergeFile1(file);
    setSelectedMergeFile1(file as File);
    setPdfPreview1(URL.createObjectURL(file as File));
    setResults([
      ...results,
      {
        name: file?.name ?? "",
        blob: file ?? new File([], ""),
        url: URL.createObjectURL(file ?? new File([], "")),
        rotation: 0,
        fileName: file?.name ?? "",
        pages: 1,
      },
    ]);
  };

  const handleFileUpload2 = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    if (results.length >= 2) {
      toast.error("You can only merge up to 2 files");
      return;
    }
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setMergeFile2(file);
      setSelectedMergeFile2(file as File);
      setPdfPreview2(URL.createObjectURL(file as File));
      setResults([
        ...results,
        {
          name: file?.name ?? "",
          blob: file ?? new File([], ""),
          url: URL.createObjectURL(file ?? new File([], "")),
          rotation: 0,
          fileName: file?.name ?? "",
          pages: 1,
        },
      ]);
    };
    input.click();
  };

  const handleDeleteSelectedMergeFile1 = () => {
    clearSelectedMergeFile1();
    setPdfPreview1(null);
    setResults(
      results.filter((file) => file.name !== selectedMergeFile1?.name)
    );
  };

  const handleDeleteSelectedMergeFile2 = () => {
    clearSelectedMergeFile2();
    setPdfPreview2(null);
    setResults(
      results.filter((file) => file.name !== selectedMergeFile2?.name)
    );
  };

  //clear results when merge page route change
  useEffect(() => {
    return () => {
      handleReset();
    };
  }, []);

  const handleReset = () => {
    clearResults();
    clearMergeFile1();
    clearMergeFile2();
    clearSelectedMergeFile1();
    clearSelectedMergeFile2();
    setPdfPreview1(null);
    setPdfPreview2(null);
    setResults([]);
  };

  const handleMerge = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      await MergePdfs();

      clearMergeFile1();
      clearMergeFile2();
      clearResults();
      setPdfPreview1(null);
      setPdfPreview2(null);
      if (mergeFile1 && mergeFile2) {
        toast.success("Merge pdf downloaded successfully!");
      } else {
        toast.error("Please select both PDF files to merge!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Merge pdf download failed!");
    } finally {
      setLoading(false);
    }
  };

  const mergeDisplayFiles = () => {
    return (
      <div className="flex flex-col gap-2 my-4">
        <div className="flex flex-col gap-2">
          {selectedMergeFile1 && (
            <div
              className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
              border border-gray-200 rounded-md p-3"
            >
              <p className="truncate">{selectedMergeFile1.name}</p>
              <button
                className="text-text-body cursor-pointer underline text-md"
                onClick={handleDeleteSelectedMergeFile1}
              >
                <IoMdTrash />
              </button>
            </div>
          )}
          {selectedMergeFile2 && (
            <div
              className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
                border border-gray-200 rounded-md p-3 "
            >
              <p className="truncate">{selectedMergeFile2.name}</p>
              <button
                className="text-text-body cursor-pointer underline text-md"
                onClick={handleDeleteSelectedMergeFile2}
              >
                <IoMdTrash />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className=" relative lg:flex flex-col   px-4 py-12">
      <div
        className={`flex-1  transition-all duration-300 
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
      `}
      >
        <div
          className={`mx-auto
          ${results.length > 0 ? "max-w-xl w-auto" : "max-w-xl"}
          `}
        >
          <SelectFile
            heading="Merge PDFs"
            description="Merge two PDF files into one."
          />
          <div
            className="bg-white/40 text-text-body rounded-2xl shadow-lg
           border border-gray-100 p-6 sm:pt-10 sm:pb-14"
          >
            {results.length === 0 && (
              <UploadModal
                handleFileUpload={handleFileUpload1}
                accept=".pdf"
                label="Select a PDF"
                fileSelected={results.length > 0}
                isDownloadCompleted={downloadCompleted}
                clearDownloadCompleted={clearDownloadCompleted}
              />
            )}

            <div
              className="
              flex flex-col md:flex-row
              justify-center items-center mx-auto gap-5 "
            >
              {pdfPreview1 && (
                <div className="w-64">
                  <div className="h-72 border rounded-md overflow-hidden bg-gray-100">
                    <iframe
                      src={pdfPreview1}
                      title="PDF Preview 1"
                      className="w-full h-full"
                    />
                  </div>
                  {mergeFile1 && (
                    <p className="mt-2 text-sm text-center truncate">
                      {mergeFile1.name}
                    </p>
                  )}
                </div>
              )}

              {pdfPreview2 && (
                <div className="w-64">
                  <div className="h-72 border rounded-md overflow-hidden bg-gray-100">
                    <iframe
                      src={pdfPreview2}
                      title="PDF Preview 2"
                      className="w-full h-full"
                    />
                  </div>
                  {mergeFile2 && (
                    <p className="mt-2 text-sm text-center truncate">
                      {mergeFile2.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isMobile && isSidebarVisible && (
        <aside
          className="fixed top-0 right-0 h-full w-[380px] 
         bg-bg-card border-l border-border shadow-lg z-50"
        >
          <div className="p-6">
            <button className="absolute top-5 right-5" onClick={handleReset}>
              <IoMdClose />
            </button>

            <h2 className="text-xl font-semibold text-text-heading border-b pb-4">
              Merge PDFs
            </h2>

            <div className="flex justify-between mt-6">
              <p className="font-medium text-text-body">Files</p>
              <button
                onClick={handleReset}
                className="text-text-body underline"
              >
                Reset All
              </button>
            </div>

            {/*File list */}
            {mergeDisplayFiles()}

            <button
              className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md flex justify-center items-center"
              onClick={handleMerge}
            >
              Merge PDFs
              <IoMdArrowForward className="ml-2" />
            </button>
          </div>
          <div className=" fixed  top-[20%]  z-50 flex flex-col gap-3 -ml-8">
            <button
              onClick={handleFileUpload2}
              className="bg-primary  text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
            >
              <IoMdAdd />
            </button>
          </div>
        </aside>
      )}

      {isMobile && results.length > 0 && (
        <div className=" flex flex-col gap-3 my-4">
          <h2 className="text-xl font-semibold py-4">SelectedFiles</h2>
          {mergeDisplayFiles()}
          <button
            className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md flex justify-center items-center"
            onClick={handleMerge}
          >
            Merge PDFs <IoMdArrowForward className="ml-2" />
          </button>
        </div>
      )}

      {isMobile && selectedMergeFile1 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
          <button
            onClick={handleFileUpload2}
            className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
          >
            <IoMdAdd />
          </button>
        </div>
      )}
    </div>
  );
};

export default MergePdfComponent;
