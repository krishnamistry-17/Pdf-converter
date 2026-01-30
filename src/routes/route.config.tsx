import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../Pages/Home/Home";
import MergePdfComponent from "../Pages/pdfs/MergePdfs";
import JsonToPdf from "../Pages/pdfs/JsonToPdf";
import PdfToExcel from "../Pages/pdfs/PdfToExcel";
import PdfToWord from "../Pages/pdfs/PdfToWord";
import PdfToCsv from "../Pages/pdfs/PdfToCsv";
import JpgToPdf from "../Pages/pdfs/JpgToPdf";
import PdfToPpt from "../Pages/pdfs/PdfToPpt";
import CompressPdf from "../Pages/pdfs/Compress";
import SplitPdf from "../Pages/pdfs/SplitPdf";
import PdfToJson from "../Pages/pdfs/PdfToJson";
import CsvToPdf from "../Pages/pdfs/CsvToPdf";
import ExcelToJson from "../Pages/excels/ExcelToJson";
import ExcelToCsv from "../Pages/excels/ExcelToCsv";
import DocsToHtml from "../Pages/docs/DocsToHtml";
import ConvertPdf from "../Pages/Convertpdf";
import WordToPdf from "../Pages/words/WordToPdf";
import ExcelToPdf from "../Pages/excels/ExcelToPdf";
import PptToPdf from "../Pages/ppt/PptToPdf";
import ConvertFromPdf from "../components/tabs/ConvertFromPdf/ConvertFromPdf";
import ConvertToPdf from "../components/tabs/ConvertToPdf/ConvertToPdf";
import OtherConversion from "../components/tabs/OtherConversion/OtherConversion";
import Organize from "../Pages/pdfs/Organize";
import PdfPageNumber from "../Pages/pdfs/PdfPageNumber";
import RotatePdf from "../Pages/pdfs/RotatePdf";
import PdfToJpg from "../Pages/pdfs/PdfToJpg";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/json-to-pdf",
        element: <JsonToPdf />,
      },
      {
        path: "/pdf-to-json",
        element: <PdfToJson />,
      },
      {
        path: "/pdf-to-excel",
        element: <PdfToExcel />,
      },
      {
        path: "/pdf-to-word",
        element: <PdfToWord />,
      },
      {
        path: "/pdf-to-csv",
        element: <PdfToCsv />,
      },
      {
        path: "/jpg-to-pdf",
        element: <JpgToPdf />,
      },
      {
        path: "/pdf-to-ppt",
        element: <PdfToPpt />,
      },
      {
        path: "/merge-pdfs",
        element: <MergePdfComponent />,
      },
      {
        path: "/compress-pdfs",
        element: <CompressPdf />,
      },
      {
        path: "/split-pdfs",
        element: <SplitPdf />,
      },
      {
        path: "/csv-to-pdf",
        element: <CsvToPdf />,
      },
      {
        path: "/excel-to-json",
        element: <ExcelToJson />,
      },
      {
        path: "/excel-to-csv",
        element: <ExcelToCsv />,
      },
      {
        path: "/docs-to-html",
        element: <DocsToHtml />,
      },
      {
        path: "/convert-pdfs",
        element: <ConvertPdf />,
      },
      {
        path: "/word-to-pdf",
        element: <WordToPdf />,
      },
      {
        path: "/excel-to-pdf",
        element: <ExcelToPdf />,
      },
      {
        path: "/ppt-to-pdf",
        element: <PptToPdf />,
      },
      {
        path: "/convert-to-pdf",
        element: <ConvertToPdf />,
      },
      {
        path: "/convert-from-pdf",
        element: <ConvertFromPdf />,
      },
      {
        path: "/other-conversion",
        element: <OtherConversion />,
      },
      {
        path: "/organized-pdfs",
        element: <Organize />,
      },
      {
        path: "/page-numbers",
        element: <PdfPageNumber />,
      },
      {
        path: "/rotate-pdf",
        element: <RotatePdf />,
      },
      {
        path: "/pdf-to-jpg",
        element: <PdfToJpg />,
      },
    ],
  },
]);
export default routes;
