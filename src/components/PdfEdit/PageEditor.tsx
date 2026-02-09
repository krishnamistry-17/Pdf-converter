import { useRef } from "react";
import EditableText from "../DrawTool/EditableText";

interface Props {
  image: string;
  pageIndex: number;
  active: boolean;
  setActivePageIndex: (i: number) => void;
  activeToolFeature: "text" | "draw" | "highlight" | "image";
  textElements: any[];
  addText: (pageIndex: number, x: number, y: number, fontSize: number) => void;
  updateText: (
    id: string,
    text: string,
    x: number,
    y: number,
    fontSize: number
  ) => void;
}

const PageEditor = ({
  image,
  pageIndex,
  active,
  setActivePageIndex,
  activeToolFeature,
  textElements,
  addText,
  updateText,
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    if (activeToolFeature !== "text") return;
    // If user clicked on an input or existing text, do nothing
    if ((e.target as HTMLElement).tagName === "INPUT") return;

    const rect = imgRef.current.getBoundingClientRect();
    const imgWidth = rect.width;
    const imgHeight = rect.height;

    if (!imgWidth || !imgHeight) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addText(
      pageIndex,
      x / imgWidth,
      y / imgHeight,
      16 / imgHeight // now SAFE
    );
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative bg-white rounded-xl shadow-md p-2 ${
        active ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => setActivePageIndex(pageIndex)}
    >
      {/* IMAGE */}
      <img
        ref={imgRef}
        src={image}
        className="block w-full max-h-[70vh] object-contain rounded"
        style={{ transform: "scaleX(1) scaleY(1)" }}
        draggable={false}
      />

      {/* TEXT LAYER */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: imgRef.current?.clientWidth,
          height: imgRef.current?.clientHeight,
          transform: "scaleX(1) scaleY(1)",
        }}
        onClick={handleClick}
      >
        {textElements.map((el) => (
          <EditableText
            key={el.id}
            element={el}
            updateText={updateText}
            imgHeight={imgRef.current?.clientHeight}
          />
        ))}
      </div>

      {/* DRAW LAYER */}
      {/* {active && activeToolFeature === "draw" && (
        <EditableDraw imgRef={imgRef} />
      )} */}
    </div>
  );
};

export default PageEditor;
