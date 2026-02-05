import getFileType from "../../constance/FileType";
import useFilesStore from "../../store/useSheetStore";

const OCRPreview = ({ previewFileDesign }: { previewFileDesign: string }) => {
  const selectedFile = useFilesStore((state) => state.selectedFile);
  if (!selectedFile) return null;
  const type = getFileType(selectedFile);
  return (
    <div className="w-full flex flex-col items-center gap-3">
      {type === "pdf" && (
        <div className="w-full max-w-full sm:max-w-sm flex flex-col items-center gap-2">
          <iframe
            src={previewFileDesign}
            title="PDF Preview"
            className="w-full max-h-[50vh] rounded "
            style={{
              minHeight: "400px",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          />
          <a
            href={previewFileDesign}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-body text-sm underline"
          >
            Open PDF in new tab
          </a>
        </div>
      )}
      {(type === "jpg" || type === "jpeg" || type === "png") && (
        <div className=" flex flex-col items-center gap-2">
          <img
            src={previewFileDesign}
            alt="Image Preview"
            className="w-full max-h-[50vh] sm:max-h-80 object-contain rounded"
          />
          <a
            href={previewFileDesign}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-body text-sm underline"
          >
            Open Image in new tab
          </a>
        </div>
      )}
      {!["pdf", "jpg", "jpeg", "png"].includes(type || "") && (
        <p className="text-text-body w-full text-center">No preview available</p>
      )}
    </div>
  );
};

export default OCRPreview;
