import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import { toast } from "react-toastify";

const CsvToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setDownloadFileUrl = useFilesStore((state) => state.setDownloadFileUrl);
  const setLoading = useFilesStore((state) => state.setLoading);
  const { convertCsvToPdf } = useUploadData();
  const selectedFile = useFilesStore((state) => state.selectedFile);
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

    await new Promise((r) => setTimeout(r, 100));

    try {
      await convertCsvToPdf(selectedFile as File);
      setDownloadFileUrl(URL.createObjectURL(selectedFile as File) as string);
      clearSelectedFile();
      toast.success("Conversion successful!");
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
        heading="Convert Csv to PDF"
        para="Convert a Csv file to a PDF file. This tool will convert a Csv file to a PDF file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="pdf"
        accept=".csv"
        label="Select a file"
        btnText="Download PDF"
      />
    </>
  );
};

export default CsvToPdf;
