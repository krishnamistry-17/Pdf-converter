import { FaRotate } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useOrganizeStore } from "../../store/useOrganizeStore";
import type { PageResult } from "../../types/pageResult";
import useUploadData from "../../hooks/useUploadData";

const OrganizePreviewGrid = () => {
  const results = useOrganizeStore((s) => s.results);
  const setResults = useOrganizeStore((s) => s.setResults);
  const setBlankPage = useOrganizeStore((s) => s.setBlankPage);
  const { addBlankPageToPdf } = useUploadData();

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

  const handleAddBlankPage = async (index: number) => {
    const bytes = await addBlankPageToPdf();

    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const blankPage: PageResult = {
      name: "blank-page",
      fileName: "Blank Page",
      blob,
      url,
      rotation: 0,
      pages: 0,
    };

    const updated = [
      ...results.slice(0, index + 1),
      blankPage,
      ...results.slice(index + 1),
    ].map((p, i) => ({
      ...p,
      pages: i + 1,
    }));

    setResults(updated);
    setBlankPage(blankPage);
  };

  if (!results.length) {
    return (
      <p className="text-gray-500 mt-6 text-center">No pages to display</p>
    );
  }

  return (
    <div className="my-6 w-full">
      <div className=" flex justify-center items-center 
      flex-wrap mx-auto gap-3">
        {results.map((file, index) => (
          <div
            key={`${file.fileName}-${index}`}
            className="bg-white/40 text-blue rounded-xl shadow-md p-4 relative"
          >
            <iframe
              src={file.url}
              title={file.fileName}
              className="w-full h-72 border rounded"
              style={{ transform: `rotate(${file.rotation}deg)` }}
            />

            <div className="mt-3">
              <p className="font-medium truncate">{file.fileName}</p>
              <p className="text-sm text-gray-500">Page {file.pages}</p>
            </div>

            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleRotate(index)}
                className="bg-white p-2 rounded shadow hover:bg-gray-100"
                title="Rotate"
              >
                <FaRotate />
              </button>
              <button
                onClick={() => handleRemove(index)}
                className="bg-white p-2 rounded shadow hover:bg-gray-100"
                title="Remove"
              >
                <MdClose />
              </button>
            </div>

            <div className="absolute top-1/2 -left-2">
              <button
                onClick={() => handleAddBlankPage(index)}
                className="bg-white p-2 rounded shadow hover:bg-gray-100 "
                title="Add Blank Page"
              >
                <IoMdAdd />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizePreviewGrid;
