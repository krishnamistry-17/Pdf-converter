import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useEffect, useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import { toast } from "react-toastify";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const PdfToCsv = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const { convertPdfToCsv } = useUploadData();
  const setLoading = useFilesStore((state) => state.setLoading);
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
    e.target.value = "";
    setFileSelected(true);
  };

  const handleConvert = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      await convertPdfToCsv(selectedFile as File);
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

 
  useEffect(() => {
    return () => {
      clearSelectedFile();
    };
  }, []);
  return (
    <>
      <PdfFile
        heading="Convert PDF to Csv"
        para="Convert a PDF file to a Csv file. This tool will convert a PDF file to a Csv file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        previewFileDesign={previewFileDesign}
        PreviewFileType="csv"
        accept=".pdf"
        label="Select a file"
        btnText="Download Csv"
        isDownloadCompleted={downloadCompleted}
      />
    </>
  );
};

export default PdfToCsv;
