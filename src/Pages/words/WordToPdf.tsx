import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import api from "../../utils/axios";
import { API_ROUTES } from "../../constance/apiConstance";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const WordToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );

  const [file, setFile] = useState<File | null>(null);
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
    setPreviewFileDesign(URL.createObjectURL(file as File));
    setFile(file as any);
    e.target.value = "";
    setFileSelected(true);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Select a Word file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(API_ROUTES.WORD.WORD_TO_PDF, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await response.data;

      if (!data.downloadUrl) {
        toast.error("Conversion failed!");
        return;
      }

      const a = document.createElement("a");
      a.href = data.downloadUrl;
      a.download = data.fileName;
      a.click();

      URL.revokeObjectURL(data.downloadUrl);

      toast.success("Conversion successful!");
    } catch (error) {
      console.error(error);
      toast.error("Conversion failed!");
    }
  };

  const handleConvert = async () => {
    setLoading(true);

    try {
      await handleUpload();
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
        heading="Convert Word to Pdf"
        para="Convert a Word file to a Pdf file. This tool will convert a Word file to a Pdf file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="pdf"
        accept=".docx"
        label="Select a file"
        btnText="Download Pdf"
        previewFileDesign={previewFileDesign}
        isDownloadCompleted={downloadCompleted}
      />
    </>
  );
};

export default WordToPdf;
