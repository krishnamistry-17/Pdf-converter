const getFileType = (file: File) => {
  if (file.type === "application/pdf") return "pdf";
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return "pptx";
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return "xlsx";
  if (file.type === "application/vnd.ms-excel") return "xls";
  if (file.type === "text/csv") return "csv";
  if (file.type === "application/json") return "json";
  if (file.type === "image/jpeg") return "jpeg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/jpg") return "jpg";
  if (file.type === "application/msword") return "doc";
  if (file.type === "text/html") return "html";
  if (file.type === "text/plain") return "txt";
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "docx";
};
export default getFileType;
