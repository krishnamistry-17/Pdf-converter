import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import api from "../../utils/axios";
import { API_ROUTES } from "../../constance/apiConstance";

const PdfToWord = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);

  const [file, setFile] = useState<File | null>(null);
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(null);
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

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF file first");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await api.post(API_ROUTES.PDFS.PDF_TO_WORD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const wordUrl = response.data.url;
      window.open(wordUrl, "_blank");

      alert(" Conversion successful!");
    } catch (error) {
      console.error(error);
      alert("Conversion failed!");
    }
  };

  const handleConvert = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      await handleUpload();
      clearSelectedFile();
    } catch (error) {
      console.error(error);
      alert("Conversion failed!");
    } finally {
      setLoading(false);
    }
  };

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
      />
    </>
  );
};

export default PdfToWord;
