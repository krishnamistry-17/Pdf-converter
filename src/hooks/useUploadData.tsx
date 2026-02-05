import jsPDF from "jspdf";
import useFilesStore from "../store/useSheetStore";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";
import useSplitStore from "../store/useSplitStore";
import mammoth from "mammoth";
import autoTable from "jspdf-autotable";
import { degrees } from "pdf-lib";
import type {
  ImageResult,
  PageNumberOptions,
  PageResult,
} from "../types/pageResult";
import type { PageNumberPosition } from "../types/pagenumberPosition";
import { toast } from "react-toastify";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js?url";

//this is for pdf to text conversion
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.2.67/build/pdf.worker.min.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

async function loadPdf(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf;
}

type TextItem = {
  str: string;
  transform: number[];
};

export type SplitResult = {
  name: string;
  blob: Blob;
  url: string;
  pages: string;
};

const useUploadData = () => {
  const mergeFile1 = useFilesStore((state) => state.mergeFile1);
  const mergeFile2 = useFilesStore((state) => state.mergeFile2);

  const selectedFile = useFilesStore((state) => state.selectedFile);

  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);

  const showError = () => {
    if (!selectedFile) {
      toast.error("No file selected!");
      return;
    }
  };

  const ConvertExcelToCsv = () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.SheetNames[0];
      const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet]);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedFile.name}.csv`;
      a.click();
    };
    reader.readAsArrayBuffer(selectedFile as any);
  };

  const ConvertExcelToJson = () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.SheetNames[0];
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedFile.name}.json`;
      a.click();
    };
    reader.readAsArrayBuffer(selectedFile as any);
  };

  // Json -> Pdf
  const ConvertJsonToPdf = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      showError();

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result as string;
          const json = JSON.parse(data);

          const pdf = new jsPDF({ compress: true });

          const pageHeight = pdf.internal.pageSize.height;
          const pageWidth = pdf.internal.pageSize.width;
          const margin = 10;
          const lineHeight = 7;

          const jsonString = JSON.stringify(json, null, 2);
          const lines = pdf.splitTextToSize(jsonString, pageWidth - 2 * margin);

          let y = margin;

          for (let i = 0; i < lines.length; i++) {
            if (y + lineHeight > pageHeight - margin) {
              pdf.addPage();
              y = margin;
            }
            pdf.text(lines[i], margin, y);
            y += lineHeight;
          }

          pdf.save("converted.pdf");
          setSelectedFile(null);
          resolve();
        } catch (err) {
          console.error(err);
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsText(selectedFile as File);
    });
  };

  // Pdf -> Json
  const convertPdfToJson = async (file: File) => {
    const pdf = await loadPdf(file);

    const pages: {
      pageNumber: number;
      text: string;
      items: any[];
    }[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      pages.push({
        pageNumber: i,
        text: pageText,
        items: textContent.items, // raw text positions (optional)
      });
    }

    //add download the json file
    const json = JSON.stringify(pages, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name}.json`;
    a.click();
    setSelectedFile(null);

    return {
      fileName: file.name,
      totalPages: pdf.numPages,
      pages,
    };
  };

  // Pdf -> Excel
  const ConvertPdfToExcel = async () => {
    showError();
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split("\n").map((line) => ({ Data: line }));
        const worksheet = XLSX.utils.json_to_sheet(lines);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const buffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.xlsx";
        a.click();
        setSelectedFile(null);
        toast.success("Conversion successful!");
      };
      reader.readAsText(selectedFile as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to convert PDF to Excel");
    }
  };

  // Pdf -> Word
  const ConvertPdfToWord = async () => {
    showError();
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const blob = new Blob([text], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.docx";
        a.click();
        setSelectedFile(null);
        toast.success("Conversion successful!");
      };
      reader.readAsText(selectedFile as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to convert PDF to Word");
    }
  };

  // Pdf -> csv

  const convertPdfToCsv = async (file: File): Promise<string> => {
    const pdf = await loadPdf(file);

    const rows: string[][] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const items = textContent.items as TextItem[];

      // Group text by Y position (rows)
      const rowMap: Record<number, TextItem[]> = {};

      items.forEach((item) => {
        const y = Math.round(item.transform[5]); // vertical position
        if (!rowMap[y]) rowMap[y] = [];
        rowMap[y].push(item);
      });

      // Sort rows top → bottom
      const sortedRows = Object.keys(rowMap)
        .map(Number)
        .sort((a, b) => b - a);

      sortedRows.forEach((y) => {
        const row = rowMap[y]
          .sort((a, b) => a.transform[4] - b.transform[4]) // left → right
          .map((item) => item.str.trim())
          .filter(Boolean);

        if (row.length) rows.push(row);
      });
    }

    const csv = rowsToCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name}.csv`;
    a.click();
    setSelectedFile(null);
    return csv;
  };

  const rowsToCsv = (rows: string[][]): string => {
    return rows
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
  };

  // Jpg,png,jpeg -> Pdf
  const ConvertJpgToPdf = async (
    results: ImageResult[],
    fileName = "converted.pdf"
  ) => {
    if (results.length === 0) return;

    const pdf = new jsPDF();

    for (let i = 0; i < results.length; i++) {
      const file = results[i].blob as File;
      const imageData = await fileToBase64(file);

      const imageType = file.type === "image/png" ? "PNG" : "JPEG";

      if (i !== 0) pdf.addPage();
      // pdf.addImage(imageData, imageType, x, y, width, height);
      pdf.addImage(imageData, imageType, 10, 10, 100, 100);
    }

    pdf.save(fileName);
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  //pdf -> png,jpg,jpeg
  const ConvertPdfToPng = async (
    file: File
  ): Promise<{ previews: string[]; blobs: Blob[] }> => {
    const pdf = await loadPdf(file);

    const previews: string[] = [];
    const blobs: Blob[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.5 });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;

      previews.push(canvas.toDataURL("image/png"));

      const blob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => b && res(b), "image/png")
      );
      blobs.push(blob);
    }

    return { previews, blobs };
  };

  // Download blob as file
  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  //downlod single image
  const downloadImage = (image: string, fileName: string) => {
    const blob = new Blob([image], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // pdf -> ppt
  const ConvertedPdfToPpt = async () => {
    showError();
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const blob = new Blob([text], {
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.ppt";
        a.click();
        setSelectedFile(null);
        toast.success("Conversion successful!");
      };
      reader.readAsText(selectedFile as any);
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert PDF to PPT");
    }
  };

  // Compress PDF
  const compressPdf = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file first!");
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 20,
      });

      const blob = new Blob([new Uint8Array(compressedBytes)], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${selectedFile.name}`;
      a.click();
    } catch (err) {
      console.error(err);
      toast.error("Failed to compress PDF");
    }
  };

  // Merge PDFs

  const MergePdfs = async () => {
    if (!mergeFile1 || !mergeFile2) {
      toast.error("Please select both PDF files to merge!");
      return;
    }

    try {
      // Read the files as array buffers
      const file1Buffer = await mergeFile1.arrayBuffer();
      const file2Buffer = await mergeFile2.arrayBuffer();

      // Load PDFs
      const pdf1 = await PDFDocument.load(file1Buffer);
      const pdf2 = await PDFDocument.load(file2Buffer);

      // Create a new PDF to merge into
      const mergedPdf = await PDFDocument.create();

      // Copy pages from first PDF
      const pages1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
      pages1.forEach((page) => mergedPdf.addPage(page));

      // Copy pages from second PDF
      const pages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
      pages2.forEach((page) => mergedPdf.addPage(page));

      // Save merged PDF
      const mergedPdfBytes = await mergedPdf.save();

      // Create blob and preview URL
      downloadPdf(mergedPdfBytes, "merged.pdf");
    } catch (error) {
      console.error("Error merging PDFs:", error);
    }
  };

  const splitPdfByRange = async (
    file: File,
    range: { from: number; to: number }
  ) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    //ensure numbers
    const from = Number(range.from);
    const to = Number(range.to);

    if (
      Number.isNaN(from) ||
      Number.isNaN(to) ||
      from < 1 ||
      to > totalPages ||
      from > to
    ) {
      return [];
    }

    const newPdf = await PDFDocument.create();

    // IMPORTANT: pdf-lib uses ZERO-based indexes
    const pageIndexes: number[] = [];
    for (let i = from; i <= to; i++) {
      pageIndexes.push(i - 1);
    }

    const copiedPages = await newPdf.copyPages(pdf, pageIndexes);
    copiedPages.forEach((p) => newPdf.addPage(p));

    const bytes = await newPdf.save();
    const blob = new Blob([new Uint8Array(bytes)], {
      type: "application/pdf",
    });

    return [
      {
        name: `range-${from}-${to}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${from}-${to}`,
      },
    ];
  };

  const splitPdfByFixedRange = async (
    file: File,
    rangeSize: number
  ): Promise<SplitResult[]> => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const totalPages = pdf.getPageCount();

    const results: SplitResult[] = [];

    for (let start = 0; start < totalPages; start += rangeSize) {
      const newPdf = await PDFDocument.create();

      const pageIndexes = Array.from(
        { length: Math.min(rangeSize, totalPages - start) },
        (_, i) => start + i
      );

      const pages = await newPdf.copyPages(pdf, pageIndexes);
      pages.forEach((p) => newPdf.addPage(p));

      const bytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      });

      results.push({
        name: `pages-${start + 1}-${start + pageIndexes.length}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${start + 1}-${start + pageIndexes.length}`,
      });
    }

    return results;
  };

  const downloadPdf = (bytes: Uint8Array, name: string) => {
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    URL.revokeObjectURL(url);
  };

  const splitEveryPage = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const totalPages = pdf.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      const bytes = await newPdf.save();
      downloadPdf(bytes, `page-${i + 1}.pdf`);
    }
  };

  const downloadSplitPdf = (bytes: Uint8Array, name: string) => {
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  const getTotalPages = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const originalPdf = await PDFDocument.load(arrayBuffer);

    const totalPages = originalPdf.getPageCount();
    return totalPages;
  };

  const extractAllPages = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const totalPages = pdf.getPageCount();
    const results: SplitResult[] = [];
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      const bytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      });
      results.push({
        name: `page-${i + 1}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${i + 1}`,
      });
    }
    return results;
  };

  const extractSelectedPage = async (file: File, pages: number[]) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();
    const results: SplitResult[] = [];

    for (const page of pages) {
      if (page < 1 || page > totalPages) {
        continue;
      }
      const newPdf = await PDFDocument.create();
      const [pageData] = await newPdf.copyPages(pdf, [page - 1]);
      newPdf.addPage(pageData);
      const bytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      });
      results.push({
        name: `page-${page}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${page}`,
      });
    }
    return results;
  };

  const extractSelectedRange = async (
    file: File,
    range: { from: number; to: number }
  ) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    // ensure numbers
    const from = Number(range.from);
    const to = Number(range.to);

    if (
      Number.isNaN(from) ||
      Number.isNaN(to) ||
      from < 1 ||
      to > totalPages ||
      from > to
    ) {
      return [];
    }

    const newPdf = await PDFDocument.create();

    // IMPORTANT: pdf-lib uses ZERO-based indexes
    const pageIndexes: number[] = [];
    for (let i = from; i <= to; i++) {
      pageIndexes.push(i - 1);
    }

    const copiedPages = await newPdf.copyPages(pdf, pageIndexes);
    copiedPages.forEach((p) => newPdf.addPage(p));

    const bytes = await newPdf.save();
    const blob = new Blob([new Uint8Array(bytes)], {
      type: "application/pdf",
    });

    return [
      {
        name: `range-${from}-${to}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${from}-${to}`,
      },
    ];
  };

  const pdfSize = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const sizeUnit = useSplitStore((state) => state.sizeUnit);
    const bytes = await pdf.save();
    const size = bytes.length;
    if (sizeUnit === "MB") {
      return Math.round(size / 1024 / 1024);
    } else {
      return Math.round(size / 1024);
    }
  };

  const compressPdfBySize = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    });

    // Re-save PDF without changing pages to reduce size
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    const results: SplitResult[] = [];
    const blob = new Blob([new Uint8Array(compressedBytes)], {
      type: "application/pdf",
    });
    //download the compressed pdf
    downloadPdf(compressedBytes, `compressed-${file.name}`);
    results.push({
      name: `compressed-${file.name}`,
      blob,
      url: URL.createObjectURL(blob),
      pages: pdfDoc.getPageCount().toString(),
    });
    return results;
  };

  const convertCsvToPdf = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    const { data, meta } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const pdf = new jsPDF();

    autoTable(pdf, {
      head: [meta.fields!],
      body: data.map((row: any) => meta.fields!.map((f) => row[f])),
      styles: { fontSize: 8 },
    });

    pdf.save("converted.pdf");
  };

  const organizePdf = async (
    pages: {
      blob: Blob;
      rotation: number;
    }[],
    fileName = "organized.pdf"
  ) => {
    const finalPdf = await PDFDocument.create();

    for (const page of pages) {
      const buffer = await page.blob.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const [srcPage] = await finalPdf.copyPages(srcPdf, [0]);

      if (page.rotation) {
        srcPage.setRotation(degrees(page.rotation));
      }

      finalPdf.addPage(srcPage);
    }

    const bytes = await finalPdf.save();
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
  };

  const addBlankPageToPdf = async (
    width = 595, // A4 width
    height = 842 // A4 height
  ): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([width, height]);
    return pdfDoc.save();
  };

  const displayPdf = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const bytes = await pdf.save();
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  };

  const rotatePdfDownload = async (
    results: PageResult[],
    fileName = "rotated.pdf"
  ) => {
    const finalPdf = await PDFDocument.create();

    for (const result of results) {
      const buffer = await result.blob.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);

      const pageIndices = srcPdf.getPageIndices();

      const copiedPages = await finalPdf.copyPages(srcPdf, pageIndices);

      copiedPages.forEach((page) => {
        if (result.rotation) {
          page.setRotation(degrees(result.rotation));
        }
        finalPdf.addPage(page);
      });
    }

    const bytes = await finalPdf.save();
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const drawPageNumber = ({
    page,
    text,
    position,
    font,
  }: {
    page: PDFPage;
    text: string;
    position: PageNumberPosition;
    font: PDFFont;
  }) => {
    const fontSize = 12;
    const margin = 20;

    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    let x = margin;
    let y = margin;

    switch (position) {
      case "bottom-center":
        x = width / 2 - textWidth / 2;
        break;

      case "bottom-right":
        x = width - textWidth - margin;
        break;

      case "top-center":
        x = width / 2 - textWidth / 2;
        y = height - margin;
        break;

      case "top-right":
        x = width - textWidth - margin;
        y = height - margin;
        break;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  };

  const toRoman = (num: number): string => {
    const map: [number, string][] = [
      [1000, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ];

    let result = "";
    for (const [value, numeral] of map) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  };

  const addPageNumberToPdf = async (
    pages: { blob: Blob; rotation: number }[],
    options: PageNumberOptions
  ) => {
    const {
      position,
      startFrom = 1,
      range,
      fileName = "page-numbered.pdf",
      text = "{current}",
      rangeType = "all",
      numberType = "arabic",
    } = options;

    const finalPdf = await PDFDocument.create();
    const font = await finalPdf.embedFont(StandardFonts.Helvetica);

    const totalPages = pages.length;

    let globalIndex = 1;
    let printedNumber = startFrom;

    for (const item of pages) {
      const srcPdf = await PDFDocument.load(await item.blob.arrayBuffer());
      const copiedPages = await finalPdf.copyPages(
        srcPdf,
        srcPdf.getPageIndices()
      );

      for (const page of copiedPages) {
        if (item.rotation) {
          page.setRotation(degrees(item.rotation));
        }

        const inRange =
          !range || (globalIndex >= range.from && globalIndex <= range.to);

        const formattedNumber =
          numberType === "roman"
            ? toRoman(printedNumber)
            : String(printedNumber);

        const matchesRangeType =
          rangeType === "all" ||
          (rangeType === "odd" && globalIndex % 2 === 1) ||
          (rangeType === "even" && globalIndex % 2 === 0);

        const matchesNumberType =
          numberType === "arabic"
            ? true
            : numberType === "roman"
            ? toRoman(printedNumber).length > 0
            : false;

        const shouldNumber = inRange && matchesRangeType && matchesNumberType;

        if (shouldNumber) {
          const finalText = text
            .replace("{current}", formattedNumber)
            .replace(
              "{total}",
              numberType === "arabic"
                ? String(range?.to ?? totalPages)
                : toRoman(range?.to ?? totalPages)
            );

          drawPageNumber({
            page,
            text: finalText,
            position,
            font,
          });

          printedNumber++;
        }

        finalPdf.addPage(page);
        globalIndex++;
      }
    }

    const bytes = await finalPdf.save();
    downloadPdf(bytes, fileName);
  };

  const ConvertDocsToHtml = async (file: File): Promise<void> => {
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        styleMap: [
          "p[style-name='Title'] => h1:fresh",
          "p[style-name='Heading 1'] => h2:fresh",
        ],
      }
    );

    const blob = new Blob([result.value], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ConvertPdfToText = async (file: File): Promise<void> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        const pageText = content.items.map((item: any) => item.str).join(" ");

        fullText += pageText + "\n\n" + '"\n\n';
      }
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Conversion successful!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert PDF to Text");
    }
  };

  const extractTextFromPDF = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        const pageText = content.items.map((item: any) => item.str).join(" ");

        fullText += pageText + "\n\n" + '"\n\n';
      }
      console.log("fullText", fullText);
      return fullText;
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert PDF to Text");
    }
  };

  //tessreact not direct extract from pdf, it extract from image
  //Tessreact--> It does not natively support PDF files; users must first render PDFs to images using third-party libraries.
  const extractTextFromImages = async (
    image: string | File,
    language: string = "eng"
  ) => {
    const worker = await createWorker(language);

    const {
      data: { text },
    } =
      typeof image === "string"
        ? await worker.recognize(image)
        : await worker.recognize(image, {
            pdfTextOnly: true,
          });

    await worker.terminate();
    console.log("text", text);

    return text;
  };

  const pdfPageToImage = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const images: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext("2d");
      if (!context) continue;

      await page.render({ canvasContext: context, viewport }).promise;

      const dataUrl = canvas.toDataURL("image/png");
      images.push(dataUrl);
    }

    return images;
  };

  //check file size and page count befor ocr
  const checkFileValidation = async (file: File) => {
    if (file.size > 10 * 1024 * 500) {
      toast.info("File size is too large, please upload a smaller file");
      return false;
    }

    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      if (pdf.numPages > 50) {
        toast.info(
          "Page count range is too large, please upload a smaller file"
        );
        return false;
      }
      if (
        file.type.startsWith("image/jpeg") ||
        file.type.startsWith("image/png") ||
        file.type.startsWith("image/jpg")
      ) {
        const images = await pdfPageToImage(file);
        if (images.length > 50) {
          toast.info(
            "Page count range is too large, please upload a smaller file"
          );
          return false;
        }
        return true;
      }
    }
    return true;
  };

  return {
    ConvertExcelToJson,
    ConvertExcelToCsv,
    ConvertDocsToHtml,
    ConvertJsonToPdf,
    downloadBlob,
    ConvertPdfToExcel,
    ConvertPdfToWord,
    convertPdfToCsv,
    ConvertJpgToPdf,
    ConvertedPdfToPpt,
    compressPdf,
    MergePdfs,
    splitPdfByRange,
    splitEveryPage,
    getTotalPages,
    splitPdfByFixedRange,
    downloadPdf,
    downloadSplitPdf,
    extractAllPages,
    extractSelectedPage,
    extractSelectedRange,
    pdfSize,
    compressPdfBySize,
    convertPdfToJson,
    convertCsvToPdf,
    organizePdf,
    addBlankPageToPdf,
    displayPdf,
    rotatePdfDownload,
    addPageNumberToPdf,
    ConvertPdfToPng,
    ConvertPdfToText,
    extractTextFromPDF,
    extractTextFromImages,
    pdfPageToImage,
    checkFileValidation,
    downloadImage,
  };
};

export default useUploadData;
