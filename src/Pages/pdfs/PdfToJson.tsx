import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const PdfToJson = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const { convertPdfToJson } = useUploadData();

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
    e.target.value = "";
    setFileSelected(true);
  };

  const handleConvert = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      const json = await convertPdfToJson(selectedFile as File);
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      // window.open(url);
      toast.success("Conversion successful!");
      clearSelectedFile();
      setDownloadCompleted(true);
      setFileSelected(false);
      return;
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
        heading="Convert PDF to JSON"
        para="Convert a PDF file to a JSON file. This tool will convert a PDF file to a JSON file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        previewFileDesign={previewFileDesign}
        PreviewFileType="json"
        accept=".pdf"
        label="Select a file"
        btnText="Download JSON"
        isDownloadCompleted={downloadCompleted}
      />
    </>
  );
};

export default PdfToJson;
