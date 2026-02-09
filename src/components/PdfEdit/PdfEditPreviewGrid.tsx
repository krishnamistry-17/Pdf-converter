import { useEditPdfStore } from "../../store/useEditPdfStore";
import PageEditor from "./PageEditor";

interface Props {
  images: string[];
  activePageIndex: number | null;
  setActivePageIndex: (index: number) => void;
  selectFirstPageText: string | null;
  selectTextFromPdf: () => void;
}

const PdfEditPreviewGrid = ({
  images,
  activePageIndex,
  setActivePageIndex,
  selectFirstPageText,
  selectTextFromPdf,
}: Props) => {
  const { activeToolFeature, textElements, addText, updateText } =
    useEditPdfStore();

  return (
    <div className="my-6 flex flex-col items-center gap-6">
      {images.map((image, pageIndex) => (
        <PageEditor
          key={pageIndex}
          image={image}
          pageIndex={pageIndex}
          active={activePageIndex === pageIndex}
          setActivePageIndex={setActivePageIndex}
          activeToolFeature={activeToolFeature}
          textElements={textElements.filter((t) => t.pageIndex === pageIndex)}
          addText={addText}
          updateText={updateText}
          selectFirstPageText={selectFirstPageText}
          selectTextFromPdf={selectTextFromPdf}
        />
      ))}
    </div>
  );
};

export default PdfEditPreviewGrid;
