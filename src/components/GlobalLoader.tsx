import { useEffect } from "react";
import useFilesStore from "../store/useSheetStore";

const GlobalLoader = () => {
  const loading = useFilesStore((state) => state.loading);
  const setLoading = useFilesStore((state) => state.setLoading);

  useEffect(() => {
    if (!loading) return;
    const id = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 8000);
    return () => clearTimeout(id);
  }, [loading, setLoading]);

  if (!loading) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-white/60 backdrop-blur-[1px]
      "
      role="status"
      aria-live="polite"
      aria-label="Processing file"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="animate-spin rounded-full
         h-15 w-15 border-t-2 border-b-2 border-gray-900"
        />
      </div>
    </div>
  );
};

export default GlobalLoader;
