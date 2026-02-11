import { useEditPdfStore } from "../../store/useEditPdfStore";
import PageEditor from "./PageEditor";

const PdfEditPreviewGrid = () => {
  const selectedFile = useEditPdfStore((state) => state.selectedFile);
  if (!selectedFile) return null;
  return (
    <div className="flex flex-col items-center">
      <PageEditor file={selectedFile} />
    </div>
  );
};

export default PdfEditPreviewGrid;
