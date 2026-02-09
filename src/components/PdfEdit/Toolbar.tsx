import SwitchButton from "../SwitchButton";
import { useEditPdfStore } from "../../store/useEditPdfStore";
import {
  FaPen,
  FaHighlighter,
  FaImage,
  FaDownload,
  FaFont,
} from "react-icons/fa";
import ToolButton from "./ToolbarButton";
import { saveEditedPdf } from "../../utils/saveEditPdf";

const Toolbar = ({}: {}) => {
  const {
    activeTool,
    setActiveTool,
    activeToolFeature,
    setActiveToolFeature,
    textElements,
    drawElements,
    imageElements,
    addImage,
  } = useEditPdfStore();
  const selectedFile = useEditPdfStore((state) => state.selectedFile);

  const handleSave = async () => {
    if (!selectedFile || textElements.length === 0) return;

    const editedPdf = await saveEditedPdf({
      file: selectedFile,
      textElements,
      drawElements,
      imageElements,
    });

    const blob = new Blob([new Uint8Array(editedPdf)], {
      type: "application/pdf" + selectedFile.type,
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.pdf";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleImageUpload = () => {
    if (activeToolFeature !== "image") return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg,.jpeg,.png";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      const file = files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      addImage(0, url, 0, 0, file.size, file.size);
    };

    input.click();
  };

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2">
        <div className="pr-4 border-r border-border">
          <SwitchButton
            value1="annotate"
            value2="edit"
            activeValue={activeTool}
            onChange={(value) => setActiveTool(value as "annotate" | "edit")}
          />
        </div>

        {activeTool === "annotate" && (
          <>
            <div className="flex items-center gap-1">
              <ToolButton
                icon={<FaFont />}
                onClick={() => {
                  setActiveToolFeature("text");
                }}
                active={activeToolFeature === "text"}
              />
              <ToolButton
                icon={<FaPen />}
                onClick={() => setActiveToolFeature("draw")}
                active={activeToolFeature === "draw"}
              />
              <ToolButton
                icon={<FaHighlighter />}
                onClick={() => setActiveToolFeature("highlight")}
                active={activeToolFeature === "highlight"}
              />
              <ToolButton
                icon={<FaImage />}
                onClick={() => {
                  setActiveToolFeature("image");
                  handleImageUpload();
                }}
                active={activeToolFeature === "image"}
              />
            </div>

            <div className="mx-2 h-6 w-px bg-border" />

            <div>
              <ToolButton
                icon={<FaDownload />}
                onClick={handleSave}
                active={false}
              />
            </div>
          </>
        )}

        {activeTool === "edit" && (
          <>
            <p>select text</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
