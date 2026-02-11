import { toast } from "react-toastify";
import PdfFile from "../../components/layout/PdfFile";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";

import { useEffect, useState } from "react";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const ExcelToJson = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);
  const { ConvertExcelToJson } = useUploadData();
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
    await new Promise((r) => setTimeout(r, 100));
    try {
      await ConvertExcelToJson();
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
        heading="Convert Excel to Json"
        para="Convert a Excel file to a Json file. This tool will convert a Excel file to a Json file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="json"
        accept=".xlsx"
        label="Select a file"
        btnText="Download Json"
        isDownloadCompleted={downloadCompleted}
        previewFileDesign={previewFileDesign}
      />
    </>
  );
};

export default ExcelToJson;
