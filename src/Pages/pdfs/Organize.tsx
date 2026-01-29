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
import CustomInputModal from "../../components/CustomInputModal";
import { useFileSessionStore } from "../../store/useFileSessionStore";

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

  const [isMobile, setIsMobile] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [newSelectedFiles, setNewSelectedFiles] = useState<File[]>([]);

  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      toast.error("You can only organize up to 3 extra files");
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
      <div className="flex flex-col gap-2 my-4">
        <div className="flex flex-col gap-2">
          {selectOrganizeFile && (
            <div
              className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
              border border-gray-200 rounded-md p-3 "
            >
              {selectOrganizeFile?.name}
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
              border border-gray-200 rounded-md p-3 "
            >
              {file.name}
              <button
                className="text-blue cursor-pointer underline text-md"
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
    <div className="relative lg:flex flex-col min-h-screen  px-4 py-12">
      <div
        className={`flex-1  transition-all duration-300 
        ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
      `}
      >
        <div className="max-w-5xl mx-auto">
          <SelectFile
            heading="Organize PDF"
            description="Sort, add, delete, reorder, rotate pages and more."
          />
          <div className="bg-white/40 text-blue rounded-2xl shadow-lg border border-gray-100 p-6 sm:pt-10 sm:pb-14">
            {results.length === 0 && (
              <CustomInputModal
                fileSelected={results.length > 0}
                label="Select a PDF"
                accept=".pdf"
                isDownloadCompleted={downloadCompleted}
                clearDownloadCompleted={clearDownloadCompleted}
                onFileUpload={handleFileUpload}
              />
            )}

            {results.length === 0 && (
              <p className="text-gray-500 mt-8 text-center">
                Upload a PDF to start
              </p>
            )}

            {results.length > 0 && <OrganizePreviewGrid />}
          </div>
        </div>
      </div>
      {isMobile && results.length > 0 && (
        <div className=" flex flex-col gap-3">
          <h2 className="text-xl font-semibold py-4">SelectedFiles</h2>
          {mergeDisplayFiles()}
          <button
            className="bg-blue hover:bg-gradient-to-r from-blue to-teal text-white w-full py-2 rounded-md flex justify-center items-center"
            onClick={handleOrganizePdf}
          >
            Organize <IoMdArrowForward className="ml-2" />
          </button>
        </div>
      )}

      {!isMobile && isSidebarVisible && (
        <aside className="fixed top-0 right-0 h-full w-[380px] bg-sea border-l border-blue shadow-lg z-50">
          <div className="p-6">
            <button className="absolute top-5 right-5" onClick={handleReset}>
              <IoMdClose />
            </button>

            <h2 className="text-xl font-semibold text-blue border-b border-blue/30 pb-4">
              Organize PDF
            </h2>

            <div className="flex justify-between mt-6">
              <p className="font-semibold text-blue">Files</p>
              <button
                onClick={handleReset}
                className="text-blue text-sm underline"
              >
                Reset All
              </button>
            </div>

            {/* File list */}
            {mergeDisplayFiles()}

            <button
              className="bg-blue hover:bg-gradient-to-r from-blue to-teal text-white w-full py-2 rounded-md flex justify-center items-center"
              onClick={handleOrganizePdf}
            >
              Organize <IoMdArrowForward className="ml-2" />
            </button>
          </div>

          <div className=" fixed  top-[20%]  z-50 flex flex-col gap-3 -ml-8">
            <button
              onClick={handleAddMoreFiles}
              className="bg-teal text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
            >
              <IoMdAdd />
            </button>

            <button
              onClick={handleSortFiles}
              className="bg-teal text-white w-12 h-12 rounded-full flex items-center justify-center shadow"
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
              className="bg-teal text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            >
              <IoMdAdd />
            </button>

            <button
              onClick={handleSortFiles}
              className="bg-teal text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
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
