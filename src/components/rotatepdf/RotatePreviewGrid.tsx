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
  
  const containerWidth =
  results.length > 1 ? "sm:grid-cols-2 grid-cols-1" : "grid-cols-1";


  return (
    <div className="my-6 w-full">
      <div
        className={`grid ${containerWidth} place-items-center`}
      >
        {results.map((file, index) => (
          <div
            key={`${file.fileName}-${index}`}
            className=" w-full max-w-[300px] bg-white/40 text-text-body rounded-xl shadow-md p-4 relative z-40 overflow-x-auto "
          >
            <iframe
              src={file.url}
              title={file.fileName}
              className="w-full  h-80 border rounded text-text-body"
              style={{ transform: `rotate(${file.rotation}deg)` }}
            />

            <div className="mt-3">
              <p className="font-medium truncate text-text-body">
                {file.fileName}
              </p>
              <p className="text-sm text-text-body">Page {file.pages}</p>
            </div>

            <div className="absolute top-1/2 -left-2">
              <button
                onClick={() => handleRotate(index)}
                className="bg-white p-2 rounded shadow hover:bg-bg-soft"
                title="Rotate"
              >
                <FaRotate />
              </button>
            </div>
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleRemove(index)}
                className="bg-white p-2 rounded shadow hover:bg-bg-soft"
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
