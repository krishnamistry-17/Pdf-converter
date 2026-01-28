import { useState } from "react";
import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import SelectFile from "../../components/SelectFile";
import { toast } from "react-toastify";

const MergePdfComponent = () => {
  const [pdfPreview1, setPdfPreview1] = useState<string | null>(null);
  const [pdfPreview2, setPdfPreview2] = useState<string | null>(null);

  const clearMergeFile1 = useFilesStore((state) => state.clearMergeFile1);
  const clearMergeFile2 = useFilesStore((state) => state.clearMergeFile2);

  const mergeFile1 = useFilesStore((state) => state.mergeFile1);
  const mergeFile2 = useFilesStore((state) => state.mergeFile2);

  const setMergeFile1 = useFilesStore((state) => state.setMergeFile1);
  const setMergeFile2 = useFilesStore((state) => state.setMergeFile2);

  const setLoading = useFilesStore((state) => state.setLoading);
  const { MergePdfs } = useUploadData();

  const handleFileUpload1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMergeFile1(file);

    setPdfPreview1(URL.createObjectURL(file as File));
  };

  const handleFileUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMergeFile2(file);
    setPdfPreview2(URL.createObjectURL(file as File));
  };

  const handleMerge = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      await MergePdfs();
      clearMergeFile1();
      clearMergeFile2();
      setPdfPreview1(null);
      setPdfPreview2(null);
      toast.success("Merge pdf downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Merge pdf download failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div
        className="max-w-7xl mx-auto my-6 p-4 flex flex-col items-center gap-6
      bg-white rounded-2xl shadow-lg border border-gray-100  sm:p-10
      "
      >
        <div>
          <SelectFile
            heading="Merge PDFs"
            description="Merge two PDF files into one."
          />
        </div>
        <div className="md:flex flex-col md:flex-row gap-6 mb-8">
          <div className=" relative">
            <label
              htmlFor="pdf1"
              className="cursor-pointer bg-white border-2 border-dashed border-gray-500 
          rounded-md w-64 h-40 flex flex-col items-center justify-center 
          hover:bg-gray-50 transition"
            >
              <span className="text-gray-700 font-medium">Select PDF 1</span>
              <input
                id="pdf1"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload1}
              />
            </label>
            {pdfPreview1 && (
              <div className="absolute top-0 left-0 w-full h-full">
                <object
                  data={pdfPreview1}
                  title="PDF Preview1"
                  className="w-64 h-40 object-cover"
                >
                  <embed src={pdfPreview1} type="application/pdf" />
                </object>
                {mergeFile1 && (
                  <div>
                    <p>{mergeFile1.name}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className=" md:mt-0 mt-17 relative">
            <label
              htmlFor="pdf2"
              className="cursor-pointer bg-white border-2 border-dashed border-gray-500 
          rounded-md w-64 h-40 flex flex-col items-center justify-center 
          hover:bg-gray-50 transition"
            >
              <span className="text-gray-700 font-medium">Select PDF 2</span>
              <input
                id="pdf2"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload2}
              />
            </label>
            {pdfPreview2 && (
              <div className="absolute top-0 left-0 w-full h-full">
                <object
                  data={pdfPreview2}
                  title="PDF Preview2"
                  className="w-64 h-40 object-cover"
                >
                  <embed src={pdfPreview2} type="application/pdf" />
                </object>
                {mergeFile2 && (
                  <div>
                    <p>{mergeFile2.name}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleMerge}
          className="bg-blue-600 mt-5 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Download Merged PDF
        </button>
      </div>
    </div>
  );
};

export default MergePdfComponent;
