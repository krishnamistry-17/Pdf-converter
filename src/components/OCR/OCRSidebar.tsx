import { IoMdTrash } from "react-icons/io";
import useFilesStore from "../../store/useSheetStore";
import useExtractPdfStore from "../../store/useExtractPdf";
import { FaMagic } from "react-icons/fa";
import SummaryOptions from "./SummaryOptions";
import OCRLoader from "./OCRLoader";
import { executivePoints, keyPoints } from "../../constance/Text";
import { useEffect } from "react";
import mockSummarize from "../../utils/mockSummarize";

const OCRSidebar = ({
  handleReset,
  handleDeleteSelectedFile,
  previewFile,
  handleStartOCR,
}: {
  handleReset: () => void;
  handleDeleteSelectedFile: () => void;
  previewFile: string | null;
  handleStartOCR: () => void;
}) => {
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const extractedText = useExtractPdfStore((state) => state.results[0]);

  const { setSummaryStatus, summaryStatus, summaryType, setSummaryResult } =
    useExtractPdfStore();

  useEffect(() => {
    if (extractedText) {
      setSummaryStatus("idle");
    }
  }, [extractedText]);

  useEffect(() => {
    if (summaryStatus === "loading") {
      mockSummarize(extractedText, summaryType).then((res) => {
        setSummaryResult(res);
        setSummaryStatus("done");
      });
    }
  }, [summaryStatus]);

  return (
    <div className="sm:p-6">
      <h2 className="text-xl font-semibold text-blue border-b border-blue/30 pb-4">
        OCR Text Extraction
      </h2>
      <div className="flex justify-between mt-6">
        <p className="font-semibold text-blue">Extracted Text</p>
        <button className="text-blue text-sm underline" onClick={handleReset}>
          Reset All
        </button>
      </div>
      <div className="my-2 flex flex-col gap-2">
        {selectedFile && (
          <div
            className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
                border border-gray-200 rounded-md p-3  truncate"
          >
            {selectedFile.name}
            <button
              className="text-blue cursor-pointer underline text-md"
              onClick={handleDeleteSelectedFile}
            >
              <IoMdTrash />
            </button>
          </div>
        )}
        {previewFile && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-center items-center my-3">
              <button
                className="bg-blue w-full text-white px-4 py-2 rounded-md"
                onClick={handleStartOCR}
              >
                Start OCR
              </button>
            </div>
          </div>
        )}
        {extractedText && (
          <div className="flex flex-col gap-3">
            <p className="text-blue">Summary Text</p>
            <button
              className="bg-blue text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
              onClick={() => setSummaryStatus("options")}
            >
              <FaMagic />
              Summarize
            </button>
          </div>
        )}

        {summaryStatus === "options" && <SummaryOptions />}
        {summaryStatus === "loading" && <OCRLoader />}
        {summaryStatus === "done" && (
          <div className="mt-6">
            {/* <h3 className="font-semibold text-blue">
                    {summaryType === "executive"
                      ? "Executive Summary"
                      : "Key Points"}
                  </h3> */}
            {/* <p className="mt-2 text-blue whitespace-pre-line">
                    {summaryResult}
                  </p> */}
            {summaryType === "keypoints" && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-blue mb-3">
                  Key Points
                </h3>

                <ul className="space-y-3 text-sm text-gray-700">
                  {keyPoints.map((point: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue">•</span>
                      <span className="text-blue">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {summaryType === "executive" && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-blue mb-2">
                  Executive Summary
                </h3>

                {/* Intro paragraph */}
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {executivePoints.join("\n")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRSidebar;
