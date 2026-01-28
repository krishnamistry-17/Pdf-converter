import { useState } from "react";
import useSplitStore from "../../store/useSplitStore";
import SwitchButton from "../SwitchButton";
import useUploadData from "../../hooks/useUploadData";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import useFilesStore from "../../store/useSheetStore";
import { toast } from "react-toastify";

const Size = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const totalPages = useSplitStore((state) => state.totalPages);
  const { selectedFile } = useFileSessionStore();
  const setResults = useSplitStore((state) => state.setResults);
  const clearResults = useSplitStore((state) => state.clearResults);
  const setLoading = useFilesStore((state) => state.setLoading);
  const [value, setValue] = useState<number>(15);
  const [allowCompression, setAllowCompression] = useState<boolean>(false);
  const { compressPdfBySize } = useUploadData();

  const handleSplitPdfBySize = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      if (!selectedFile) return;
      const results = allowCompression
        ? await compressPdfBySize(selectedFile as File)
        : await compressPdfBySize(selectedFile as File);
      setResults(results as any);
      clearResults();
      setIsSidebarOpen(false);
      return;
    } catch (error) {
      console.error(error);
      toast.error("Size split failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      <p className="text-sm text-g  ray-500">
        Original File Size:
        <b className="pl-2">
          {(selectedFile?.size ? selectedFile.size / 1024 : 0).toFixed(2)} KB
        </b>
      </p>
      <p className="text-sm text-gray-500">
        Total Pages: <b>{totalPages}</b>
      </p>

      <div className="flex flex-col gap-2 my-3">
        <p className="text-md text-black">Maximum Size per File</p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder={value.toString()}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-0"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
          />
          <div>
            <SwitchButton />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 py-3 bg-gray-100 rounded-md p-2">
          This pdf will be no longer split than this size 5 kB each
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="checkbox"
          checked={allowCompression}
          onChange={(e) => setAllowCompression(e.target.checked)}
        />
        <label htmlFor="checkbox">
          <p className="text-sm text-black">Allow Compression</p>
        </label>
      </div>
      <div className="mt-3 w-full">
        <button
          onClick={handleSplitPdfBySize}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          Split pdf by size
        </button>
      </div>
    </div>
  );
};

export default Size;
