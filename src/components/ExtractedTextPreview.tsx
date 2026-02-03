import { toast } from "react-toastify";

const ExtractedTextPreview = ({ text }: { text: string }) => {
  console.log("text????????", text);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard");
  };
  return (
    <div className="bg-white/40 border rounded-lg p-4 max-h-[400px] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Extracted Text</h3>

        <button onClick={handleCopy} className="text-blue text-sm underline">
          Copy
        </button>
      </div>

      <pre className="whitespace-pre-wrap text-sm text-gray-800">{text}</pre>
    </div>
  );
};

export default ExtractedTextPreview;
