import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import api from "../../utils/axios";
import { API_ROUTES } from "../../constance/apiConstance";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import { toast } from "react-toastify";

const PptToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const [fileSelected, setFileSelected] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(
    null
  );
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return alert("Please select a file");

    setSelectedFile(uploadedFile);
    setFile(uploadedFile);
    setPreviewFileDesign(URL.createObjectURL(uploadedFile as File));
    setFileSelected(true);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a Ppt file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(API_ROUTES.PPT.PPT_TO_PDF, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response", response);

      const data = await response.data;

      if (!data.downloadUrl) {
        alert("Conversion failed!");
        return;
      }

      const pdfUrl = response.data.downloadUrl;
      console.log("pdfUrl", pdfUrl);

      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "converted.pdf";
      a.click();
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error(error);
      alert("Download failed!");
    }
  };

  const handleConvert = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      await handleUpload();
      toast.success("Conversion successful!");
      clearSelectedFile();
      setDownloadCompleted(true);
      setFileSelected(false);
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
        heading="Convert Ppt to Pdf"
        para="Convert a Ppt file to a Pdf file. This tool will convert a Ppt file to a Pdf file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        accept=".pptx"
        label="Select a file"
        btnText="Download Pdf"
        PreviewFileType="pptx"
        previewFileDesign={previewFileDesign as unknown as string}
        isDownloadCompleted={downloadCompleted}
      />
    </>
  );
};

export default PptToPdf;
