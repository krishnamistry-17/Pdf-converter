import PdfFile from "../../components/layout/PdfFile";
import useFilesStore from "../../store/useSheetStore";

import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { API_ROUTES } from "../../constance/apiConstance";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const PdftoExcel = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const setLoading = useFilesStore((state) => state.setLoading);

  const [file, setFile] = useState<File | null>(null);
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(
    null
  );

  const [fileSelected, setFileSelected] = useState(false);

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

  const downloadFile = (url: string, filename = "converted.xlsx") => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Select a PDF file first");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await api.post(API_ROUTES.PDFS.PDF_TO_EXCEL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const excelUrl = response.data.url;
      downloadFile(excelUrl);

      // window.open(excelUrl, "_blank");
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

  return (
    <>
      <PdfFile
        heading="Convert PDF to Excel"
        para="Convert a PDF file to a Excel file. This tool will convert a PDF file to a Excel file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        previewFileDesign={previewFileDesign}
        PreviewFileType="pdf"
        accept=".pdf"
        label="Select a file"
        btnText="Download Excel"
        isDownloadCompleted={downloadCompleted}
      />
    </>
  );
};

export default PdftoExcel;
