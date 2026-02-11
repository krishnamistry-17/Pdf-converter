import { useEffect, useState } from "react";
import SelectFile from "../../components/SelectFile";
import { useOrganizeStore } from "../../store/useOrganizeStore";
import OrganizePreviewGrid from "../../components/organize/OrganizePreviewGrid";
import {
  IoMdAdd,
  IoMdArrowForward,
  IoMdClose,
  IoMdTrash,
} from "react-icons/io";
import { FaSortNumericDownAlt } from "react-icons/fa";
import { FaSortNumericUp } from "react-icons/fa";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import UploadModal from "../../components/UploadModal";
import useMobileSize from "../../hooks/useMobileSize";

const Organize = () => {
  const setLoading = useFilesStore((state) => state.setLoading);

  const {
    results,
    setResults,
    clearResults,
    selectOrganizeFile,
    setSelectOrganizeFile,
    clearSelectOrganizeFile,
    clearBlankPage,
  } = useOrganizeStore();

  const { extractAllPages, organizePdf } = useUploadData();

  const isMobile = useMobileSize();
  const [isSorted, setIsSorted] = useState(false);
  const [newSelectedFiles, setNewSelectedFiles] = useState<File[]>([]);

  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectOrganizeFile(file);

    const pages = await extractAllPages(file);
    setResults(
      pages.map((page, index) => ({
        ...page,
        rotation: 0,
        pages: index + 1,
        fileName: file.name,
      }))
    );
  };

  const handleAddMoreFiles = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    if (results.length >= 4) {
      toast.error(
        "This pdf range is already full, you can not upload more files"
      );
      return;
    }

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const newPages = await extractAllPages(file);

      const startIndex = results.length;

      setResults([
        ...results,
        ...newPages.map((page, index) => ({
          ...page,
          rotation: 0,
          pages: startIndex + index + 1,
          fileName: file.name,
        })),
      ]);

      setNewSelectedFiles((prev) => [...prev, file]);
    };

    input.click();
  };

  const handleDeleteSelectedFile = () => {
    if (!selectOrganizeFile) return;

    setResults(
      results.filter((page) => page.fileName !== selectOrganizeFile?.name)
    );
    clearBlankPage();
    clearSelectOrganizeFile();
  };

  const handleDeleteExtraFile = (fileName: string) => {
    setNewSelectedFiles((prev) => prev.filter((f) => f.name !== fileName));

    setResults(results.filter((page) => page.fileName !== fileName));
    clearBlankPage();
  };

  const handleOrganizePdf = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      organizePdf(results, "organized.pdf");
      toast.success("Organize successful!");
      clearResults();
    } catch (error) {
      console.error(error);
      toast.error("Organize failed!");
    } finally {
      setLoading(false);
    }
  };


 
  useEffect(() => {
    return () => {
      clearResults();
      clearSelectOrganizeFile();
      setNewSelectedFiles([]);
      clearBlankPage();
    };
  }, []);

  const handleSortFiles = () => {
    setResults(
      [...results].sort((a, b) =>
        isSorted ? a.pages - b.pages : b.pages - a.pages
      )
    );
    setIsSorted((prev) => !prev);
  };

  const handleReset = () => {
    clearResults();
    clearSelectOrganizeFile();
    setNewSelectedFiles([]);
    clearBlankPage();
  };

  const isSidebarVisible = results.length > 0;

  const mergeDisplayFiles = () => {
    return (
      <div className="flex flex-col gap-2 sm:my-4 my-2">
        <div className="flex flex-col gap-2">
          {selectOrganizeFile && (
            <div
              className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
              border border-gray-200 rounded-md p-3  truncate"
            >
              {selectOrganizeFile?.name}
              <button
                className="text-text-body cursor-pointer underline text-md"
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
                className="text-text-body cursor-pointer underline text-md"
                onClick={() => {
                  handleDeleteExtraFile(file.name);
                }}
              >
                <IoMdTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative lg:flex flex-col   px-4 py-12">
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
            heading="Organize PDF"
            description="Sort, add, delete, reorder, rotate pages and more."
          />
          <div className="bg-white/40 text-text-body rounded-2xl shadow-lg 
          border border-gray-100 p-4">
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
                {isMobile && results.length > 0 && (
                  <div className=" flex flex-col gap-3">
                    <h2 className="text-xl font-semibold py-4">
                      SelectedFiles
                    </h2>
                    <p
                      className="text-text-body text-sm underline cursor-pointer"
                      onClick={handleReset}
                    >
                      Reset All
                    </p>
                    {mergeDisplayFiles()}
                    <button
                      className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md flex justify-center items-center"
                      onClick={handleOrganizePdf}
                    >
                      Organize <IoMdArrowForward className="ml-2" />
                    </button>
                  </div>
                )}
                <OrganizePreviewGrid />
              </>
            )}
          </div>
        </div>
      </div>

      {!isMobile && isSidebarVisible && (
        <aside className="fixed top-0 right-0 h-full w-[380px] bg-bg-card border-l border-border shadow-lg z-50">
          <div className="p-6">
            <button className="absolute top-5 right-5" onClick={handleReset}>
              <IoMdClose />
            </button>

            <h2 className="text-xl font-semibold text-text-body border-b border-border pb-4">
              Organize PDF
            </h2>

            <div className="flex justify-between mt-6">
              <p className="font-semibold text-text-body">Files</p>
              <button
                onClick={handleReset}
                className="text-text-body text-sm underline"
              >
                Reset All
              </button>
            </div>

            {/* File list */}
            {mergeDisplayFiles()}

            <button
              className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md flex justify-center items-center"
              onClick={handleOrganizePdf}
            >
              Organize <IoMdArrowForward className="ml-2" />
            </button>
          </div>

          <div className=" fixed  top-[20%]  z-50 flex flex-col gap-3 -ml-8">
            <button
              onClick={handleAddMoreFiles}
              className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
            >
              <IoMdAdd />
            </button>

            <button
              onClick={handleSortFiles}
              className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
            >
              {isSorted ? <FaSortNumericUp /> : <FaSortNumericDownAlt />}
            </button>
          </div>
        </aside>
      )}

      {isMobile && selectOrganizeFile && (
        <>
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
            <button
              onClick={handleAddMoreFiles}
              className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            >
              <IoMdAdd />
            </button>

            <button
              onClick={handleSortFiles}
              className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            >
              {isSorted ? <FaSortNumericUp /> : <FaSortNumericDownAlt />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Organize;
