import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import { toast } from "react-toastify";

const JpgToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(
    null
  );
  const setLoading = useFilesStore((state) => state.setLoading);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const { ConvertJpgToPdf } = useUploadData();
  const [fileSelected, setFileSelected] = useState(false);
  const [_file, setFile] = useState<File | null>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("Please select a file");
      return;
    }
    setSelectedFile(file as any);
    setPreviewFileDesign(URL.createObjectURL(file as File));
    setFile(file as File);
    e.target.value = "";
    setFileSelected(true);
  };

  const handleConvert = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      await ConvertJpgToPdf();
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
        heading="Convert Jpg to Pdf"
        para="Convert a Jpg file to a Pdf file. This tool will convert a Jpg file to a Pdf file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        previewFileDesign={previewFileDesign}
        PreviewFileType="pdf"
        accept=".jpg,.jpeg,.png"
        label="Select a file"
        btnText="Download Pdf"
      />
    </>
  );
};

export default JpgToPdf;
