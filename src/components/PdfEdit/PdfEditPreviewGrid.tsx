import { useEditPdfStore } from "../../store/useEditPdfStore";
import PageEditor from "./PageEditor";

const PdfEditPreviewGrid = () => {
  const selectedFile = useEditPdfStore((state) => state.selectedFile);
  if (!selectedFile) return null;
  return (
    <div className="my-6 flex flex-col items-center gap-6">
      <PageEditor file={selectedFile} />
    </div>
  );
};

export default PdfEditPreviewGrid;
