import { useMemo } from "react";
import { useEditPdfStore } from "../../store/useEditPdfStore";

const EditableImage = ({
  imgRef,
  pageIndex,
}: {
  imgRef: React.RefObject<HTMLImageElement | null>;
  pageIndex: number;
}) => {
  const imageElements = useMemo(() => {
    return useEditPdfStore
      .getState()
      .imageElements.filter((image) => image.pageIndex === pageIndex);
  }, [pageIndex]);
  console.log("imageElements", imageElements);
  return imageElements.map((image) => (
    <div key={image.id}>
      <img
        ref={imgRef}
        src={image.url}
        alt="editable image"
        className="w-20 h-20 object-contain"
      />
    </div>
  ));
};

export default EditableImage;
