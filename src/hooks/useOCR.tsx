import { useState } from "react";
import useUploadData from "./useUploadData";
import useFilesStore from "../store/useSheetStore";

export const useOCR = () => {
  const setLoading = useFilesStore((state) => state.setLoading);
  const loading = useFilesStore((state) => state.loading);
  const [text, setText] = useState("");
  const { extractTextFromImages, pdfPageToImage } = useUploadData();

  const extractText = async (file: File) => {
    setLoading(true);
    try {
      if (file.type === "application/pdf") {
        const images = await pdfPageToImage(file);
        let fullText = "";
        for (const img of images) {
          const t = await extractTextFromImages(img);
          fullText += t + "\n\n";
        }
        setText(fullText);
      } else if (
        file.type.startsWith("image/jpeg") ||
        file.type.startsWith("image/png") ||
        file.type.startsWith("image/jpg")
      ) {
        const t = await extractTextFromImages(file);
        console.log("t????????", t);
        setText(t);
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { text, loading, extractText };
};
