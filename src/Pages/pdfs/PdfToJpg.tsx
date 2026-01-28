import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import { toast } from "react-toastify";
import JSZip from "jszip";
import useImageStore from "../../store/useImageStore";
import SelectFile from "../../components/SelectFile";
import InputField from "../../components/InputField";
import ImagePreviewGrid from "../../components/ImagePreviewGrid";

const PdfToJpg = () => {
  const zip = new JSZip();

  const setSelectedFile = useFilesStore((s) => s.setSelectedFile);
  const selectedFile = useFilesStore((s) => s.selectedFile);
  const setLoading = useFilesStore((s) => s.setLoading);
  const clearResults = useImageStore((s) => s.clearResults);

  const setResults = useImageStore((s) => s.setResults);
  const results = useImageStore((s) => s.results);

  const { ConvertPdfToPng, downloadBlob } = useUploadData();

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const isFileSelected = !!selectedFile;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("Please select a file");

    setSelectedFile(file);
    setLoading(true);

    try {
      const { previews, blobs } = await ConvertPdfToPng(file);
      setPreviewImages(previews);
      setResults(
        blobs.map((blob, index) => ({
          name: `page-${index + 1}.png`,
          url: previews[index],
          blob: blob,
        }))
      );
    } catch (e) {
      toast.error("Failed to convert PDF");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleDownloadAll = () => {
    if (!results.length) return toast.error("No images to download");

    results.forEach((blob, index) =>
      downloadBlob(blob.blob, `page-${index + 1}.png`)
    );
    clearResults();
  };

  const handleDownloadZip = async () => {
    if (!results.length) return toast.error("No images to zip");

    results.forEach((blob, index) =>
      zip.file(`page-${index + 1}.png`, blob.blob)
    );

    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, `${selectedFile?.name}.zip`);
    clearResults();
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-8">
        <SelectFile
          heading="Convert PDF to JPG"
          description="Upload a PDF and download all pages as JPG images"
        />
        {results.length === 0 && (
          <InputField
            handleFileUpload={handleFileUpload}
            accept=".pdf"
            label="Select a PDF"
          />
        )}

        {isFileSelected && previewImages.length > 0 && (
          <>
            <ImagePreviewGrid images={previewImages} />

            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
              <button
                onClick={handleDownloadAll}
                className="bg-blue-600 text-white px-6 py-3 rounded-md"
              >
                Download All JPG
              </button>

              <button
                onClick={handleDownloadZip}
                className="bg-green-600 text-white px-6 py-3 rounded-md"
              >
                Download ZIP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfToJpg;
