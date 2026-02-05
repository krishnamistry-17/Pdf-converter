import { useEffect } from "react";
import useExtractPdfStore from "../../store/useExtractPdf";

const OCRLoader = () => {
  const ocrLoading = useExtractPdfStore((state) => state.ocrLoading);
  if (!ocrLoading) return null;

  useEffect(() => {
    if (ocrLoading) {
      const stopScrollOutSide = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      document.addEventListener("wheel", stopScrollOutSide, { passive: false });
      return () => {
        document.removeEventListener("wheel", stopScrollOutSide);
      };
    }
  }, [ocrLoading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
        <p className="text-text-body text-sm">
          Please wait while we extract the text...
        </p>
      </div>
    </div>
  );
};

export default OCRLoader;
