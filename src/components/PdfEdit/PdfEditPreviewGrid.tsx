import { useEditPdfStore } from "../../store/useEditPdfStore";
import PageEditor from "./PageEditor";

const PdfEditPreviewGrid = ({ handleReset }: { handleReset: () => void }) => {
  const selectedFile = useEditPdfStore((state) => state.selectedFile);
  if (!selectedFile) return null;
  return (
    <div className="flex flex-col items-center">
      <PageEditor file={selectedFile} handleReset={handleReset} />
    </div>
  );
};

export default PdfEditPreviewGrid;
