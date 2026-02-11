import { toast } from "react-toastify";
import PdfFile from "../../components/layout/PdfFile";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";
import { useEffect, useState } from "react";
import { useFileSessionStore } from "../../store/useFileSessionStore";

const DocsToHtml = () => {
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setLoading = useFilesStore((state) => state.setLoading);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setDownloadCompleted = useFileSessionStore(
    (state) => state.setDownloadCompleted
  );
  const downloadCompleted = useFileSessionStore(
    (state) => state.downloadCompleted
  );
  const { ConvertDocsToHtml } = useUploadData();
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
    // await new Promise((r) => setTimeout(r, 100));
    try {
      await ConvertDocsToHtml(selectedFile as any);
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
        heading="Convert Docs to Html"
        para="Convert a Docs file to a Html file. This tool will convert a Docs file to a Html file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="html"
        accept=".docx"
        label="Select a file"
        btnText="Download Html"
        isDownloadCompleted={downloadCompleted}
        previewFileDesign={previewFileDesign}
      />
    </>
  );
};

export default DocsToHtml;
