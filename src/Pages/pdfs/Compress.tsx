import PreviewFile from "../../components/PreviewFile";
import SelectFile from "../../components/SelectFile";
import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import { compressPdfOptions } from "../../constance/ConvertOptions";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import CustomInputModal from "../../components/CustomInputModal";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const CompressPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setDownloadCompleted = useFileSessionStore((state) => state.setDownloadCompleted);
  const downloadCompleted = useFileSessionStore((state) => state.downloadCompleted);
  const clearDownloadCompleted = useFileSessionStore((state) => state.clearDownloadCompleted);
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(
    null
  );
  const results = useFilesStore((state) => state.results);
  console.log(results);
  const setResults = useFilesStore((state) => state.setResults);
  const { compressPdf } = useUploadData();

  const [fileSelected, setFileSelected] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("50%");

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
    e.target.value = "";
    setFileSelected(true);
  };

  const handleCompress = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      await compressPdf();
      toast.success("Compression successful!");
      clearSelectedFile();
      setDownloadCompleted(true);
      setFileSelected(false);
      setResults([]);
    } catch (error) {
      console.error(error);
      toast.error("Compression failed!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div
        className={`flex-1 transition-all duration-300 
          
          ${fileSelected ? "md:mr-[320px]" : ""}`}
      >
        <div className="max-w-5xl mx-auto">
          <SelectFile
            heading="Compress PDF"
            description="Compress a PDF file to reduce its size."
          />
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:pt-10 sm:pb-14">
            {results.length === 0 && (
              <CustomInputModal
                fileSelected={fileSelected}
                label="Select a PDF"
                accept=".pdf"
                isDownloadCompleted={downloadCompleted}
                clearDownloadCompleted={clearDownloadCompleted}
                onFileUpload={handleFileUpload}
              />
            )}

            <PreviewFile previewFileDesign={previewFileDesign} />
          </div>
        </div>
      </div>

      <aside
        className={`
          fixed lg:top-[11%] top-[12%] right-0 h-full w-full md:w-[320px] z-50
          bg-white  shadow-lg border-l border-gray-200
          transform transition-transform duration-300
          ${fileSelected ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6">
          <button className="absolute top-5 right-5">
            <IoMdClose onClick={() => setFileSelected(false)} />
          </button>
          <h2 className="text-lg font-semibold mb-4">Compression Level</h2>

          <div className="space-y-2">
            {compressPdfOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedSize(option.value)}
                className={`
                  w-full text-left px-4 py-2 rounded-md border
                  transition
                  ${
                    selectedSize === option.value
                      ? " bg-blue-400 text-white"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <div>
                  <h3
                    className={`text-sm  font-semibold ${
                      selectedSize === option.value
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {option.label}
                  </h3>
                  {selectedSize === option.value && (
                    <p className="text-xs text-white">{option.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleCompress}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Download Compressed PDF
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CompressPdf;
