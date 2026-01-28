import api from "../utils/axios";

export const ConvertApi = async ({
  endpoint,
  file,
  fileKey = "pdf",
}: {
  endpoint: string;
  file: File;
  fileKey?: string;
}) => {
  const formData = new FormData();
  formData.append(fileKey, file);
  const response = await api.post(endpoint, formData);
  return response.data;
};
