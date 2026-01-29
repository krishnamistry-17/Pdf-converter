import { FaRotate } from "react-icons/fa6";
import { useRotatedPdfStore } from "../../store/useRotatePdfStore";
import { MdClose } from "react-icons/md";

const RotatePreviewGrid = () => {
  const results = useRotatedPdfStore((s) => s.results);
  const setResults = useRotatedPdfStore((s) => s.setResults);

  const handleRotate = (index: number) => {
    setResults(
      results.map((item, i) =>
        i === index
          ? { ...item, rotation: ((item.rotation ?? 0) + 90) % 360 }
          : item
      )
    );
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(results[index].url);
    setResults(results.filter((_, i) => i !== index));
  };

  return (
    <div className="my-6 w-full">
      <div className=" flex justify-center items-center 
      flex-wrap mx-auto gap-3">
        {results.map((file, index) => (
          <div
            key={`${file.fileName}-${index}`}
            className="bg-white/40 text-blue rounded-xl shadow-md p-4 relative z-40 overflow-x-auto "
          >
            <iframe
              src={file.url}
              title={file.fileName}
              className="w-full  h-80 border rounded"
              style={{ transform: `rotate(${file.rotation}deg)` }}
            />

            <div className="mt-3">
              <p className="font-medium truncate">{file.fileName}</p>
              <p className="text-sm text-gray-500">Page {file.pages}</p>
            </div>

            <div className="absolute top-1/2 -left-2">
              <button
                onClick={() => handleRotate(index)}
                className="bg-white p-2 rounded shadow hover:bg-gray-100"
                title="Rotate"
              >
                <FaRotate />
              </button>
            </div>
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleRemove(index)}
                className="bg-white p-2 rounded shadow hover:bg-gray-100"
                title="Remove"
              >
                <MdClose />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RotatePreviewGrid;
