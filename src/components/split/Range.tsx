import { useEffect } from "react";
import useUploadData from "../../hooks/useUploadData";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import useSplitStore from "../../store/useSplitStore";
import useFilesStore from "../../store/useSheetStore";
import { toast } from "react-toastify";

const Range = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const { selectedFile } = useFileSessionStore();
  const clearSelectedRange = useSplitStore((state) => state.clearSelectedRange);
  const { splitPdfByRange, splitPdfByFixedRange } = useUploadData();
  const setResults = useSplitStore((state) => state.setResults);
  const setLoading = useFilesStore((state) => state.setLoading);
  const activeMode = useSplitStore((state) => state.activeMode);
  const setActiveMode = useSplitStore((state) => state.setActiveMode);
  const activeRange = useSplitStore((state) => state.activeRange);
  const setActiveRange = useSplitStore((state) => state.setActiveRange);
  const pageRange = useSplitStore((state) => state.pageRange);
  console.log("pageRange", pageRange);
  const setPageRange = useSplitStore((state) => state.setPageRange);

  const handleAddRange = () => {
    const last = activeRange[activeRange.length - 1];
    const lastTo = Number(last.to);
    const base = Number.isFinite(lastTo) && lastTo > 0 ? lastTo : 1;
    setActiveRange([
      ...activeRange,
      { from: String(base + 1), to: String(base + 5) },
    ]);
  };

  useEffect(() => {
    if (activeRange.length === 0) {
      setActiveRange([{ from: "1", to: "1" }]);
    }
  }, [activeRange, setActiveRange]);

  const validateCustomRanges = () =>
    activeRange.every(({ from, to }) => {
      const f = parseInt(from, 10);
      const t = parseInt(to, 10);
      return !Number.isNaN(f) && !Number.isNaN(t) && f > 0 && t >= f;
    });

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "from" | "to"
  ) => {
    const value = e.target.value;
    const updated = [...activeRange];
    updated[index] = { ...updated[index], [field]: value };

    if (
      field === "from" &&
      parseInt(value, 10) > parseInt(updated[index].to, 10)
    ) {
      updated[index].to = value;
    }

    setActiveRange(updated);
    console.log("Updated activeRange:", updated);
  };

  const handleSplit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      if (!selectedFile) return toast.error("Please select a file first");

      if (activeMode === "custome") {
        if (!validateCustomRanges())
          return toast.error("Please enter valid page ranges.");

        const numericRanges = activeRange.map((r) => ({
          from: Number(r.from),
          to: Number(r.to),
        }));
        const rangeResults = await Promise.all(
          numericRanges.map((range) =>
            splitPdfByRange(selectedFile as File, range)
          )
        );

        setResults(rangeResults.flat() as any);
      } else if (activeMode === "fixed") {
        const size = Number(pageRange);
        console.log("size", size);
        if (!size || size <= 0) {
          toast.error(
            "Enter a valid page size,fixed range acccpets only single value"
          );
          return;
        }

        const results = await splitPdfByFixedRange(selectedFile as File, size);

        setResults(results as any);
      }

      clearSelectedRange();
      setIsSidebarOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Range split failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className=" text-lg font-medium py-2">Range Mode:</p>
      <div className="flex justify-between items-center gap-2">
        <button
          onClick={() => setActiveMode("custome")}
          className={`${
            activeMode === "custome"
              ? " bg-blue/10 text-blue border border-blue"
              : "bg-blue/10 text-blue border "
          } sm:px-6 sm:py-2 px-2 py-2 rounded-md`}
        >
          Custome Range
        </button>
        <button
          onClick={() => setActiveMode("fixed")}
          className={`${
            activeMode === "fixed"
              ? "bg-blue/10 text-blue border border-blue"
              : "bg-blue/10 text-blue border "
          } sm:px-6 sm:py-2 px-2 py-2 rounded-md`}
        >
          Fixed Range
        </button>
      </div>

      <div className="py-3 flex flex-col gap-2">
        {activeMode === "custome" && (
          <>
            {activeRange.map((range, idx) => (
              <div key={idx} className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-2 w-full border border-gray-300 rounded-md p-2">
                  <p>From:</p>
                  <input
                    type="number"
                    value={range.from}
                    onChange={(e) => handleRangeChange(e, idx, "from")}
                    className="w-full focus:outline-none focus:ring-0 text-blue bg-sea"
                  />
                </div>
                <div className="flex items-center gap-2 w-full border border-gray-300 rounded-md p-2">
                  <p>To:</p>
                  <input
                    type="number"
                    value={range.to}
                    onChange={(e) => handleRangeChange(e, idx, "to")}
                    className="w-full focus:outline-none focus:ring-0 text-blue bg-sea"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center my-4">
              <button
                onClick={handleAddRange}
                className="flex items-center justify-center gap-2 bg-blue/10 text-blue border border-blue px-6 py-2 rounded-md"
              >
                <span className="text-2xl">+</span> Add Range
              </button>
            </div>
          </>
        )}

        {activeMode === "fixed" && (
          <div className="sm:flex items-center justify-between gap-2 my-2">
            <p className="text-sm font-medium mb-2">
              Split into page ranges of:
            </p>
            <input
              type="number"
              min={1}
              placeholder="Pages per split (e.g. 3)"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              className="focus:outline-none focus:ring-0 border border-gray-300 rounded-md p-2"
            />
          </div>
        )}
      </div>

      <div className="my-3">
        <button
          onClick={handleSplit}
          className="bg-blue hover:bg-gradient-to-r from-blue to-teal text-white w-full px-4 py-2 rounded-md transition"
        >
          Split
        </button>
      </div>
    </>
  );
};

export default Range;
