import PreviewFile from "../../components/PreviewFile";
import SelectFile from "../../components/SelectFile";
import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import UploadModal from "../../components/UploadModal";

const CompressPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const clearResults = useFilesStore((state) => state.clearResults);
  const setLoading = useFilesStore((state) => state.setLoading);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);

  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearDownloadCompleted = useFileSessionStore(
    (state) => state.clearDownloadCompleted
  );
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(
    null
  );
  const results = useFilesStore((state) => state.results);

  const setResults = useFilesStore((state) => state.setResults);
  const { compressPdfs } = useUploadData();

  const [fileSelected, setFileSelected] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setResults([
      {
        name: file.name,
        blob: file,
        url: URL.createObjectURL(file),
        rotation: 0,
        fileName: file.name,
        pages: 1,
      },
    ]);
    setPreviewFileDesign(URL.createObjectURL(file as File));
    console.log("original file size--------", file.size / 1024, "KB");

    setFileSelected(true);
  };

  const handleCompress = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      await compressPdfs(results[0].blob as File);
      const compressedFile = await compressPdfs(results[0].blob as File);
      console.log(
        "compressed file size--------",
        compressedFile.size / 1024,
        "KB"
      );
      const url = URL.createObjectURL(compressedFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${results[0].name}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Compression successful!");
      clearSelectedFile();
      setFileSelected(false);
      setResults([]);
    } catch (error) {
      console.error(error);
      toast.error("Compression failed!");
    } finally {
      setLoading(false);
    }
  };

  //clear results when compress page route change
  useEffect(() => {
    return () => {
      clearResults();
    };
  }, []);

  return (
    <div className="relative flex lg:flex-row flex-col  px-4 lg:py-12 py-6 ">
      <div
        className={`mx-auto flex-1
          ${results.length > 0 ? "max-w-xl w-auto" : "max-w-xl"}
          `}
      >
        <SelectFile
          heading="Compress PDF"
          description="Compress a PDF file to reduce its size."
        />
        <div
          className="bg-white/40 text-text-body rounded-2xl shadow-lg 
          border border-gray-100 p-5"
        >
          {results.length === 0 && (
            <UploadModal
              handleFileUpload={handleFileUpload}
              accept=".pdf"
              label="Select a PDF"
              fileSelected={fileSelected}
              isDownloadCompleted={downloadCompleted}
              clearDownloadCompleted={clearDownloadCompleted}
            />
          )}

          <PreviewFile previewFileDesign={previewFileDesign} />

          <div className="flex justify-center items-center">
            {results.length > 0 && (
              <button
                onClick={handleCompress}
                className="mt-6 w-full max-w-xs mx-auto  bg-primary hover:bg-primary-hover
             text-white py-3 rounded-md font-semibold  transition"
              >
                Download Compressed PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressPdf;
