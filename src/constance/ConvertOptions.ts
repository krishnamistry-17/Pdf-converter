import {
  FaFileExcel,
  FaFileWord,
  FaFileCsv,
  FaFilePowerpoint,
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaCrop,
} from "react-icons/fa";
export const navOptions = [
  { label: "Merge PDF", path: "/merge-pdfs" },
  { label: "Split PDF", path: "/split-pdfs" },
  { label: "Compress PDF", path: "/compress-pdfs" },
  {
    label: "Convert PDF",
    path: "/convert-pdfs",
    showArrow: true,
    hover: true,
  },
];

export const convertOptions = [
  {
    title: "Convert to PDF",
    options: [
      { icon: FaFileAlt, label: "JSON to PDF", path: "/json-to-pdf" },
      { icon: FaFileWord, label: "Word to PDF", path: "/word-to-pdf" },
      { icon: FaFileCsv, label: "CSV to PDF", path: "/csv-to-pdf" },
      { icon: FaFilePowerpoint, label: "PPT to PDF", path: "/ppt-to-pdf" },
    ],
  },
  {
    title: "Convert from PDF",
    options: [
      { icon: FaFileAlt, label: "PDF to JSON", path: "/pdf-to-json" },
      { icon: FaFileExcel, label: "PDF to Excel", path: "/pdf-to-excel" },
      { icon: FaFileWord, label: "PDF to Word", path: "/pdf-to-word" },
      { icon: FaFileCsv, label: "PDF to CSV", path: "/pdf-to-csv" },
      { icon: FaFilePowerpoint, label: "PDF to PPT", path: "/pdf-to-ppt" },
      { icon: FaFileImage, label: "PDF to Jpg", path: "/pdf-to-jpg" },
    ],
  },
  {
    title: "Convert from Excel",
    options: [
      { icon: FaFileExcel, label: "Excel to Json", path: "/excel-to-json" },
      { icon: FaFileCsv, label: "Excel to Csv", path: "/excel-to-csv" },
      { icon: FaFileExcel, label: "Excel to PDF", path: "/excel-to-pdf" },
    ],
  },
];

const allOptions = [
  {
    label: "Convert JSON to PDF",
    path: "/json-to-pdf",
    icon: FaFilePdf,
    description: "Convert a JSON file to a PDF file.",
  },
  {
    label: "Convert JPG to PDF",
    path: "/jpg-to-pdf",
    icon: FaFilePdf,
    description: "Convert a JPG file to a PDF file.",
  },
  {
    label: "Convert PDF to Jpg",
    path: "/pdf-to-jpg",
    icon: FaFileImage,
    description: "Convert a PDF file to a Jpg file.",
  },
  {
    label: "Convert Word to PDF",
    path: "/word-to-pdf",
    icon: FaFileWord,
    description: "Convert a Word file to a PDF file.",
  },
  {
    label: "Convert CSV to PDF",
    path: "/csv-to-pdf",
    icon: FaFileCsv,
    description: "Convert a CSV file to a PDF file.",
  },
  {
    label: "Convert PPT to PDF",
    path: "/ppt-to-pdf",
    icon: FaFilePowerpoint,
    description: "Convert a PPT file to a PDF file.",
  },
  {
    label: "Convert PDF to JSON",
    path: "/pdf-to-json",
    icon: FaFilePdf,
    description: "Convert a PDF file to a JSON file.",
  },
  {
    label: "Convert PDF to Excel",
    path: "/pdf-to-excel",
    icon: FaFileExcel,
    description: "Convert a PDF file to a Excel file.",
  },
  {
    label: "Convert PDF to Word",
    path: "/pdf-to-word",
    icon: FaFileWord,
    description: "Convert a PDF file to a Word file.",
  },
  {
    label: "Convert PDF to CSV",
    path: "/pdf-to-csv",
    icon: FaFileCsv,
    description: "Convert a PDF file to a CSV file.",
  },
  {
    label: "Convert PDF to PPT",
    path: "/pdf-to-ppt",
    icon: FaFilePowerpoint,
    description: "Convert a PDF file to a PPT file.",
  },
  {
    label: "Merge PDFs",
    path: "/merge-pdfs",
    icon: FaFilePdf,
    description: "Merge two or more PDF files into a single PDF file.",
  },
  {
    label: "Split PDF",
    path: "/split-pdfs",
    icon: FaFilePdf,
    description: "Split a PDF file into multiple PDF files.",
  },
  {
    label: "Convert Excel to Json",
    path: "/excel-to-json",
    icon: FaFileExcel,
    description: "Convert a Excel file to a Json file.",
  },
  {
    label: "Convert Excel to Csv",
    path: "/excel-to-csv",
    icon: FaFileCsv,
    description: "Convert a Excel file to a Csv file.",
  },
  {
    label: "Convert Excel to PDF",
    path: "/excel-to-pdf",
    icon: FaFileExcel,
    description: "Convert a Excel file to a PDF file.",
  },
  {
    label: "Compress PDF",
    path: "/compress-pdfs",
    icon: FaFilePdf,
    description: "Compress a PDF file to reduce its size.",
  },
  {
    label: "Organized PDF",
    path: "/organized-pdfs",
    icon: FaFilePdf,
    description: "Organize a PDF file into a single PDF file.",
  },
  {
    label: "Page Numbers",
    path: "/page-numbers",
    icon: FaFilePdf,
    description: "Add page numbers to a PDF file.",
  },
  {
    label: "Rotate PDF",
    path: "/rotate-pdf",
    icon: FaFilePdf,
    description: "Rotate a PDF file.",
  },
  {
    label: "Crop PDF",
    path: "/crop-pdf",
    icon: FaCrop,
    description: "Crop a PDF file.",
  },
  {
    label: "Convert Docs to Html",
    path: "/docs-to-html",
    icon: FaFileWord,
    description: "Convert a Docs file to a Html file.",
  },
  {
    label: "Convert PDF to Text",
    path: "/pdf-to-text",
    icon: FaFilePdf,
    description: "Convert a PDF file to a Text file.",
  },
];

const organizedOptions = [
  {
    label: "Merge PDFs",
    path: "/merge-pdfs",
    icon: FaFilePdf,
    description: "Merge two or more PDF files into a single PDF file.",
  },
  {
    label: "Split PDF",
    path: "/split-pdfs",
    icon: FaFilePdf,
    description: "Split a PDF file into multiple PDF files.",
  },
  {
    label: "Organized PDF",
    path: "/organized-pdfs",
    icon: FaFilePdf,
    description: "Organize a PDF file into a single PDF file.",
  },
];

const editPdfOptions = [
  {
    label: "Page Numbers",
    path: "/page-numbers",
    icon: FaFilePdf,
    description: "Add page numbers to a PDF file.",
  },
  {
    label: "Rotate PDF",
    path: "/rotate-pdf",
    icon: FaFilePdf,
    description: "Rotate a PDF file.",
  },
  {
    label: "Crop PDF",
    path: "/crop-pdf",
    icon: FaCrop,
    description: "Crop a PDF file.",
  },
];

export const fileOperations = [
  {
    title: "All",
    options: allOptions,
  },
  {
    title: "Convert to PDF",
    options: allOptions.filter((o) => o.label.includes("to PDF")),
  },
  {
    title: "Convert From PDF",
    options: allOptions.filter((o) => o.label.includes("PDF to")),
  },
  {
    title: "Edit PDF",
    options: editPdfOptions,
  },
  {
    title: "Organized PDF",
    options: organizedOptions,
  },
  {
    title: "Other Options",
    options: allOptions.filter(
      (o) =>
        !o.label.includes("PDF") &&
        !o.label.includes("Merge") &&
        !o.label.includes("Split")
    ),
  },
];

export const compressPdfOptions = [
  {
    label: "Low",
    description:
      "Low compression will reduce the size of the PDF file to 75% of the original size.",
    value: "low",
  },
  {
    label: "Medium",
    description:
      "Medium compression will reduce the size of the PDF file to 50% of the original size.",
    value: "medium",
  },
  {
    label: "High",
    description:
      "High compression will reduce the size of the PDF file to 25% of the original size.",
    value: "high",
  },
];
