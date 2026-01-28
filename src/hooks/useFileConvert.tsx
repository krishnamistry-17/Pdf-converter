import { useState } from "react";
import { ConvertApi } from "../api/convertApi";
import { downloadFromUrl } from "../utils/downloadFile";

interface ConvertOptions {
  endpoint: string;
  fileKey?: string;
  outputName: string;
  mimeType: string;
}

export const useFileConvert = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = async (file: File, options: ConvertOptions) => {
    const formData = new FormData();
    formData.append(options.fileKey as string, file);
    try {
      setLoading(true);
      setError(null);

      const data = await ConvertApi({
        endpoint: options.endpoint,
        formData: formData as unknown as File,
        fileKey: options.fileKey,
      } as any);

      if (data?.url) {
        await downloadFromUrl(data.url, options.outputName, options.mimeType);
        return;
      }

      throw new Error("Invalid API response");
    } catch (err: any) {
      setError(err.message || "Conversion failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { convert, loading, error };
};
