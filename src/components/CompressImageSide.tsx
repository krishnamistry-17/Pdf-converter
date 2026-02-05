import { compressPdfOptions } from "../constance/ConvertOptions";

const CompressImageSide = ({
  setSelectedSize,
  selectedSize,
  handleCompress,
  handleDownload,
  compressPercentage,
}: {
  setSelectedSize: (size: string) => void;
  selectedSize: string;
  handleCompress: () => void;
  handleDownload: () => void;
  compressPercentage: number | null;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 my-4 space-y-2 h-full ">
      {compressPdfOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setSelectedSize(option.value)}
          className={`flex flex-col items-start w-full gap-2 text-md font-medium
         transition-all duration-300 text-text-body border-b border-gray-200 pb-4
        ${
          selectedSize === option.value
            ? "bg-primary/10 text-primary border-primary p-2"
            : "hover:bg-primary/10 p-2"
        }
        `}
        >
          {option.label}

          <p className="text-xs text-text-body font-normal">
            {option.description}
          </p>
        </button>
      ))}
      <button
        onClick={handleCompress}
        className="w-full bg-primary/80 hover:bg-primary-hover text-white py-2 rounded-md font-semibold mb-3 transition"
      >
        Check Compression
      </button>
      {compressPercentage !== null && (
        <p className="text-sm text-gray-700 mb-3">
          File size reduced by{" "}
          <span className="font-semibold">
            {compressPercentage.toFixed(2)}%
          </span>
        </p>
      )}
      <button
        onClick={handleDownload}
        className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-md font-semibold mb-3 transition"
      >
        Compress Image
      </button>
    </div>
  );
};

export default CompressImageSide;
