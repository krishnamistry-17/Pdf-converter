import useFilesStore from "../../store/useSheetStore";
import { useEffect, useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import api from "../../utils/axios";
import { API_ROUTES } from "../../constance/apiConstance";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const PdfToWord = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );

  const [file, setFile] = useState<File | null>(null);
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(
    null
  );
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert("Please select a file");
      return;
    }
    setSelectedFile(file as any);
    setPreviewFileDesign(URL.createObjectURL(file as File));
    setFile(file as any);
    e.target.value = "";
    setFileSelected(true);
  };

  const downloadFile = (url: string, filename = "converted.docx") => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF file first");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await api.post(API_ROUTES.PDFS.PDF_TO_WORD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const docxUrl = response.data.url;

      // URL.revokeObjectURL(docxUrl);
      downloadFile(docxUrl);
    } catch (error) {
      console.error(error);
      toast.error("Conversion failed!");
    }
  };

  const handleConvert = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
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

 
  useEffect(() => {
    return () => {
      clearSelectedFile();
    };
  }, []);
  console.log("fileSelected", fileSelected);
  return (
    <>
      <PdfFile
        heading="Convert PDF to Word"
        para="Convert a PDF file to a Word file. This tool will convert a PDF file to a Word file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        previewFileDesign={previewFileDesign}
        PreviewFileType="docx"
        accept=".pdf"
        label="Select a file"
        btnText="Download Word"
        isDownloadCompleted={downloadCompleted}
      />
    </>
  );
};

export default PdfToWord;
