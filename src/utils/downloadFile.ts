import axios from "axios";
import { saveAs } from "file-saver";

export const downloadFromUrl = async (
  url: string,
  filename: string,
  mimeType: string
) => {
  const res = await axios.get(url, { responseType: "blob" });
  const blob = new Blob([res.data], { type: mimeType });

  saveAs(blob, filename);
};
