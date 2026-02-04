import { toast } from "react-toastify";
interface ExtractedTextPreviewProps {
  text: string;
}

const ExtractedTextPreview = ({ text }: ExtractedTextPreviewProps) => {
  const bulletRegex = /^\s*(?:[•●▪■◦○*-»e]|–|—|\d+[\.\)\-])\s+/;
  
  const lines = text.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard");
  };

  const isContinuationLine = (line: string) => /^\s{2,}/.test(line);
  
  let prevWasBullet = false;

  return (
    <div className="bg-white/40 border rounded-lg p-4 max-h-[400px] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Extracted Text</h3>
        <button onClick={handleCopy} className="text-blue text-sm underline">
          Copy
        </button>
      </div>

      <pre className="whitespace-pre-wrap text-sm text-gray-800">
        {lines.map((line, index) => {
          const isBullet = bulletRegex.test(line);
          const isContinuation = prevWasBullet && isContinuationLine(line);
         
          prevWasBullet = isBullet || isContinuation;
      
          return (
            <div key={index}>
              <span
                className={`${
                  isBullet || isContinuation ? "text-red-500" : "text-blue"
                }`}
              >
                {line}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
};

export default ExtractedTextPreview;
