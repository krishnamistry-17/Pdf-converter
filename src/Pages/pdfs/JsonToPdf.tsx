import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const JsonToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);
  const { ConvertJsonToPdf } = useUploadData();
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("Please select a file");
      return;
    }
    setSelectedFile(file as any);
    setPreviewFile(URL.createObjectURL(file as File) as string);
    e.target.value = "";
    setFileSelected(true);
  };

  const handleConvert = async () => {
    setLoading(true);

    // allow loader to render
    await new Promise((r) => setTimeout(r, 100));

    try {
      await ConvertJsonToPdf();
      toast.success("Conversion successful!");
      clearSelectedFile();
      setDownloadCompleted(true);
      setFileSelected(false);
    } catch (error) {
      console.error(error);
      toast.error("Conversion failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PdfFile
        heading="Convert JSON to PDF"
        para="Convert a JSON file to a PDF file. This tool will convert a JSON file to a PDF file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="pdf"
        accept=".json"
        label="Select a file"
        btnText="Download PDF"
        isDownloadCompleted={downloadCompleted}
      />
    </>
  );
};

export default JsonToPdf;
