import { useEffect } from "react";
import { useFileSessionStore } from "../store/useFileSessionStore";
import { toast } from "react-toastify";
import getFileType from "../constance/FileType";

const ToastError = () => {
  const selectedFile = useFileSessionStore((state) => state.selectedFile);
  const type = selectedFile ? getFileType(selectedFile as File) : null;
  useEffect(() => {
    if (!selectedFile || !type) return;
    if (type) {
      toast.error(`${type} file is not supported`);
    } else {
      toast.error("File is not supported");
    }
  }, [selectedFile, type]);

  return null;
};

export default ToastError;
