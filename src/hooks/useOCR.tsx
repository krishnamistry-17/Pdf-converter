import { useState } from "react";
import useUploadData from "./useUploadData";
import useExtractPdfStore from "../store/useExtractPdf";

export const useOCR = () => {
  const setOcrLoading = useExtractPdfStore((state) => state.setOcrLoading);
  const ocrLoading = useExtractPdfStore((state) => state.ocrLoading);
  const selectedLanguage = useExtractPdfStore(
    (state) => state.selectedLanguage
  );
  const [text, setText] = useState("");
  const { extractTextFromImages, pdfPageToImage, checkFileValidation } =
    useUploadData();

  const extractText = async (file: File) => {
    setOcrLoading(true);
    try {
      //check File Validation before OCR
      const isValid = await checkFileValidation(file);
      if (!isValid) {
        setOcrLoading(false);
        return;
      }
      if (file.type === "application/pdf") {
        const images = await pdfPageToImage(file);
        let fullText = "";
        for (const img of images) {
          const t = await extractTextFromImages(img, selectedLanguage);
          fullText += t + "\n\n";
        }
        setText(fullText);
      } else if (
        file.type.startsWith("image/jpeg") ||
        file.type.startsWith("image/png") ||
        file.type.startsWith("image/jpg")
      ) {
        const images = [file];
        const t = await extractTextFromImages(images[0], selectedLanguage);
        setText(t);
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOcrLoading(false);
    }
  };

  return { text, ocrLoading, extractText };
};
