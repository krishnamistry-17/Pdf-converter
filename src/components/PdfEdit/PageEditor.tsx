import { useRef } from "react";
import EditableText from "../DrawTool/EditableText";
import EditableDraw from "../DrawTool/EditableDraw";

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

    const rect = imgRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addText(pageIndex, x, y, 14);
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
        alt={`page-${pageIndex}`}
        draggable={false}
      />

      {/* TEXT LAYER */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: imgRef.current?.clientWidth,
          height: imgRef.current?.clientHeight,
        }}
        onClick={handleClick}
      >
        {textElements.map((el) => (
          <EditableText key={el.id} element={el} updateText={updateText} />
        ))}
      </div>

      {/* DRAW LAYER */}
      {active && activeToolFeature === "draw" && (
        <EditableDraw imgRef={imgRef} />
      )}
    </div>
  );
};

export default PageEditor;
