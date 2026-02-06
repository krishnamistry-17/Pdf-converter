import { useEditPdfStore } from "../../store/useEditPdfStore";
import PageEditor from "./PageEditor";

interface Props {
  images: string[];
  activePageIndex: number | null;
  setActivePageIndex: (index: number) => void;
}

const PdfEditPreviewGrid = ({
  images,
  activePageIndex,
  setActivePageIndex,
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
        />
      ))}
    </div>
  );
};

export default PdfEditPreviewGrid;
