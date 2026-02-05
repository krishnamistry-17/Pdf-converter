import getFileType from "../constance/FileType";
import useFilesStore from "../store/useSheetStore";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";

export const CsvPreview = ({ file }: { file: File }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    file.text().then((text) => {
      if (!cancelled) {
        setContent(text.split("\n").slice(0, 5).join("\n"));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <pre
      className="
        w-full max-w-full sm:max-w-md
        max-h-[50vh] sm:max-h-80
        overflow-x-auto overflow-y-auto
        bg-bg-soft rounded
        text-[11px] sm:text-xs
        text-text-body
        px-2 py-1 sm:px-4 sm:py-2
        whitespace-pre break-all sm:break-normal
      "
    >
      {content}
    </pre>
  );
};

export const JsonPreview = ({ file }: { file: File }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    file.text().then((text) => {
      if (!cancelled) {
        try {
          const json = JSON.parse(text);
          setContent(JSON.stringify(json, null, 2));
        } catch {
          setContent("Invalid JSON file");
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <pre
      className="
        w-full max-w-full sm:max-w-md
        max-h-[50vh] sm:max-h-80
        overflow-x-auto overflow-y-auto
        bg-bg-soft rounded
        text-[11px] sm:text-xs
        px-2 py-1 sm:px-4 sm:py-2
        whitespace-pre break-all sm:break-normal
      "
    >
      {content}
    </pre>
  );
};

export const ExcelPreview = ({ file }: { file: File }) => {
  const [data, setData] = useState<any[][]>([]);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result;
      if (buffer) {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setData(jsonData.slice(0, 10) as any[][]);
      }
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div
      className="
        w-full max-w-full sm:max-w-md
        max-h-[50vh] sm:max-h-80
        overflow-auto bg-bg-soft rounded
      "
    >
      <table className="border-collapse border border-gray-300 w-full text-[11px] sm:text-xs">
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell: any, j: number) => (
                <td key={j} className="border border-border px-1 py-0.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const WordPreview = () => {
  return (
    <pre
      className="
        w-full max-w-full sm:max-w-md
        max-h-[50vh] sm:max-h-80
        overflow-auto bg-bg-soft rounded
        text-text-body
        text-[11px] sm:text-xs
        px-2 py-1 sm:px-4 sm:py-2
      "
    >
      No preview available for Word file
    </pre>
  );
};

export const PptPreview = () => {
  return (
    <pre
      className="
        w-full max-w-full sm:max-w-md
        max-h-[50vh] sm:max-h-80
        overflow-auto bg-bg-soft rounded
          text-text-body
        text-[11px] sm:text-xs
        px-2 py-1 sm:px-4 sm:py-2
      "
    >
      No preview available for PPT file
    </pre>
  );
};

const PreviewFile = ({
  previewFileDesign,
}: {
  previewFileDesign: string | null;
}) => {
  const location = useLocation();
  const selectedFile = useFilesStore((state) => state.selectedFile);

  if (!previewFileDesign) return null;

  if (!selectedFile) return null;

  const type = getFileType(selectedFile);

  const showPptPreview = () => <PptPreview />;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-full max-w-full sm:max-w-md my-4 flex flex-col items-center gap-2 px-2">
        {type === "pdf" && (
          <div className="w-full max-w-full sm:max-w-md flex flex-col items-center gap-2">
            <iframe
              src={previewFileDesign}
              title="PDF Preview"
              className="w-full max-h-[50vh] sm:max-h-80 rounded "
              style={{
                minHeight: "400px",
                WebkitOverflowScrolling: "touch",
              }}
            />
            <a
              href={previewFileDesign}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-body text-sm underline"
            >
              Open PDF in new tab
            </a>
          </div>
        )}

        {(type === "jpg" || type === "jpeg" || type === "png") &&
          previewFileDesign && (
            <img
              src={previewFileDesign}
              alt="Image Preview"
              className="w-full max-h-[50vh] sm:max-h-80 object-contain rounded"
            />
          )}

        {type === "json" && <JsonPreview file={selectedFile} />}

        {type === "csv" && <CsvPreview file={selectedFile} />}

        {(type === "xlsx" || type === "xls") && (
          <ExcelPreview file={selectedFile} />
        )}

        {(type === "doc" || type === "docx") && <WordPreview />}

        {type === "pptx" &&
          (location.pathname.includes("ppt-to-pdf") ? (
            showPptPreview()
          ) : (
            <PptPreview />
          ))}

        {type === "html" && previewFileDesign && (
          <iframe
            src={previewFileDesign}
            title="HTML Preview"
            className="w-full h-[60vh] sm:h-80 rounded border"
          />
        )}

        {type === "txt" && (
          <pre
            className="
              w-full max-w-full sm:max-w-md
              max-h-[50vh] sm:max-h-80
              overflow-x-auto overflow-y-auto
              bg-bg-soft rounded
              text-text-body
              text-[11px] sm:text-xs
              px-2 py-1 sm:px-4 sm:py-2
            "
          >
            {previewFileDesign}
          </pre>
        )}

        {![
          "pdf",
          "jpg",
          "jpeg",
          "png",
          "json",
          "csv",
          "xlsx",
          "xls",
          "doc",
          "docx",
          "pptx",
          "html",
          "txt",
        ].includes(type || "") && (
          <p className="text-text-body w-full text-center">
            No preview available
          </p>
        )}

        <p className="text-sm text-text-body flex flex-col items-center justify-center truncate max-w-full">
          File Name: {selectedFile.name}
          <span className="text-xs text-text-body pl-3">
            Selected file type is <span className="font-semibold">{type}</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default PreviewFile;
