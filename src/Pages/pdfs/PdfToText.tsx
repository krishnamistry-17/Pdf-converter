import { toast } from "react-toastify";
import PdfFile from "../../components/layout/PdfFile";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const PdfToText = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const selectedFile = useFilesStore((state) => state.selectedFile);

  const setLoading = useFilesStore((state) => state.setLoading);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const { ConvertPdfToText } = useUploadData();
  const [fileSelected, setFileSelected] = useState(false);
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(
    null
  );
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setSelectedFile(file as any);
    setPreviewFileDesign(URL.createObjectURL(file as File) as string);
    e.target.value = "";
    setFileSelected(true);
  };

  const handleConvert = async () => {
    setLoading(true);
    // await new Promise((r) => setTimeout(r, 100));
    try {
      await ConvertPdfToText(selectedFile as any);
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
        heading="Convert PDF to Text"
        para="Convert a PDF file to a Text file. This tool will convert a PDF file to a Text file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="txt"
        accept=".pdf"
        label="Select a file"
        btnText="Download Text"
        isDownloadCompleted={downloadCompleted}
        previewFileDesign={previewFileDesign}
      />
    </>
  );
};

export default PdfToText;
