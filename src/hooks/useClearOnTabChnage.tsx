import { useEffect } from "react";

const useClearOnTabChange = (clearSelectedFile: () => void) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearSelectedFile();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearSelectedFile]);
};

export default useClearOnTabChange;
