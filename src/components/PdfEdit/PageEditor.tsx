import { useRef } from "react";
import EditableText from "../DrawTool/EditableText";
import EditableDraw from "../DrawTool/EditableDraw";
import { useEditPdfStore } from "../../store/useEditPdfStore";
import EditableImage from "../DrawTool/EditableImage";

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
  selectFirstPageText: string | null;
  selectTextFromPdf: () => void;
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
  selectFirstPageText,
  selectTextFromPdf,
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { addDraw } = useEditPdfStore();

  const { activeTool } = useEditPdfStore();
  const handleClick = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    if (activeToolFeature !== "text") return;

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

  const handleDrawClick = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    if (activeToolFeature !== "draw") return;

    const rect = imgRef.current.getBoundingClientRect();
    const imgWidth = rect.width;
    const imgHeight = rect.height;

    if (!imgWidth || !imgHeight) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addDraw(pageIndex, [{ x: x / imgWidth, y: y / imgHeight }], [0, 0, 0], 2);
  };

  const handleDoubleClick = async () => {
    if (!selectFirstPageText) {
      await selectTextFromPdf();
      return;
    }
    const text = selectFirstPageText.split("\n\n")[pageIndex];
    if (!text) {
      return <div className=" border border-primary rounded-md p-2"></div>;
    }
    console.log("text", text);
    addText(pageIndex, 0.5, 0.5, 16 / (imgRef.current?.clientHeight ?? 0));
  };

  return (
    <>
      {activeTool === "annotate" && (
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
            {textElements
              .filter((el) => el.pageIndex === pageIndex)
              .map((el) => (
                <EditableText
                  key={el.id}
                  element={el}
                  updateText={updateText}
                  imgHeight={imgRef.current?.clientHeight}
                  enabled={activeToolFeature === "text"}
                />
              ))}
          </div>

          {activeToolFeature === "draw" && (
            <div className="absolute top-0 left-0" onClick={handleDrawClick}>
              <EditableDraw
                imgRef={imgRef}
                color={[0, 0, 0]}
                width={2}
                pageIndex={pageIndex}
              />
            </div>
          )}

          {activeToolFeature === "image" && (
            <div className="absolute top-0 left-0">
              <EditableImage imgRef={imgRef} pageIndex={pageIndex} />
            </div>
          )}
        </div>
      )}
      {activeTool === "edit" && (
        <div>
          <img
            src={image}
            
            alt="editable image"
            className="w-full h-full object-contain"
            onDoubleClick={handleDoubleClick}
          />
        </div>
      )}
    </>
  );
};

export default PageEditor;
