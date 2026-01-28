import { toast } from "react-toastify";
import PdfFile from "../../components/layout/PdfFile";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";

import { useState } from "react";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const ExcelToCsv = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const setLoading = useFilesStore((state) => state.setLoading);
  const { ConvertExcelToCsv } = useUploadData();
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
      await ConvertExcelToCsv();
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
        heading="Convert Excel to Csv"
        para="Convert a Excel file to a Csv file. This tool will convert a Excel file to a Csv file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="csv"
        accept=".xlsx"
        label="Select a file"
        btnText="Download Csv"
        isDownloadCompleted={downloadCompleted}
      />
    </>
  );
};

export default ExcelToCsv;
