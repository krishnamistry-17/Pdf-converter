import { FaChevronDown } from "react-icons/fa";
import { usePdfPageNumbersStore } from "../../store/usePdfPageNumbers";
import NumberPosition from "../NumberPosition";
import { useEffect, useState } from "react";
import useUploadData from "../../hooks/useUploadData";
import useSplitStore from "../../store/useSplitStore";
import useFilesStore from "../../store/useSheetStore";
import { toast } from "react-toastify";

const PageSidebar = () => {
  const {
    pageMode,
    setPageMode,
    selectedName,
    setSelectedName,
    firstNumber,
    setFirstNumber,
    selectedTextName,
    setSelectedTextName,
    clearResults,
    selectedRangeType,
    setSelectedRangeType,
    selectedNumberType,
    setSelectedNumberType,
  } = usePdfPageNumbersStore();

  const position = usePdfPageNumbersStore((s) => s.pageNumberPosition);
  const results = usePdfPageNumbersStore((s) => s.results);
  const totalPages = results.length;

  const [menuOpen, setMenuOpen] = useState(false);
  const [textMenuOpen, setTextMenuOpen] = useState(false);

  const activeRange = useSplitStore((s) => s.activeRange);
  const setActiveRange = useSplitStore((s) => s.setActiveRange);
  const setLoading = useFilesStore((state) => state.setLoading);

  const { addPageNumberToPdf } = useUploadData();

  const getDefaultText = () => "Page {current} of {total}";

  useEffect(() => {
    if (totalPages > 0) {
      setSelectedTextName(getDefaultText());
    }
  }, [totalPages, setSelectedTextName]);

  const handleApply = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    if (!results.length) return;

    addPageNumberToPdf(results, {
      position,
      startFrom: firstNumber,
      range: {
        from: Number(activeRange[0].from),
        to: Number(activeRange[activeRange.length - 1].to),
      },
      fileName: "page-numbered.pdf",
      text: selectedTextName,
      rangeType: selectedRangeType,
      numberType: selectedNumberType,
    });

    clearResults();
    toast.success("Page numbers applied successfully!");
    setLoading(false);
  };

  useEffect(() => {
    if (activeRange.length === 0 && totalPages > 0) {
      setActiveRange([{ from: "1", to: `${totalPages}` }]);
    }
  }, [activeRange, setActiveRange, totalPages]);

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "from" | "to"
  ) => {
    const updated = [...activeRange];
    updated[index] = { ...updated[index], [field]: e.target.value };
    setActiveRange(updated);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold border-b pb-4">Add Page Number</h2>

      <div className="flex flex-col gap-3 my-4">
        <div>
          <p className="font-semibold mb-2">Page Mode:</p>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-md text-white ${
                pageMode === "single" ? "bg-blue-600" : "bg-blue-500"
              }`}
              onClick={() => setPageMode("single")}
            >
              Single Page
            </button>
            <button
              className={`px-4 py-2 rounded-md text-white ${
                pageMode === "multiple" ? "bg-blue-600" : "bg-blue-500"
              }`}
              onClick={() => setPageMode("multiple")}
            >
              Multiple Pages
            </button>
          </div>
        </div>

        <div className="sm:flex gap-3 mt-3 sm:flex-row w-full flex-col">
          <div className="w-full">
            <p className="font-semibold mb-2">Position:</p>
            <NumberPosition />
          </div>
          <div className="w-full">
            <p className="font-semibold mb-2">Margin:</p>
            <div
              className="relative w-full h-10 border rounded-md p-2 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm">{selectedName}</p>
                <FaChevronDown
                  className={`text-sm transition ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {menuOpen && (
                <div className="absolute left-0 top-10 w-full bg-white shadow-md rounded-md z-50">
                  {["Recommended", "small", "big"].map((size) => (
                    <button
                      key={size}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        setSelectedName(size);
                        setMenuOpen(false);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sm:flex gap-3 sm:flex-row flex-col">
          <div className="w-full">
            <p className="font-semibold mb-2">First Page Number:</p>
            <input
              type="number"
              value={firstNumber}
              onChange={(e) => setFirstNumber(Number(e.target.value))}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div className="w-full sm:mt-0 mt-3">
            <p className="font-semibold mb-2">Number Type:</p>
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                name="numberType"
                id="arabic"
                value="arabic"
                checked={selectedNumberType === "arabic"}
                onChange={(e) =>
                  setSelectedNumberType(e.target.value as "arabic" | "roman")
                }
                className="w-4 h-4"
              />
              <label htmlFor="arabic">1,2,...</label>
              <input
                type="radio"
                name="numberType"
                id="roman"
                value="roman"
                checked={selectedNumberType === "roman"}
                onChange={(e) =>
                  setSelectedNumberType(e.target.value as "arabic" | "roman")
                }
                className="w-4 h-4"
              />
              <label htmlFor="roman">i,ii,...</label>
            </div>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">
            Which pages do you want to number?
          </p>
          {activeRange.map((range, index) => (
            <div key={index} className="flex sm:gap-2 gap-3 ">
              <input
                type="number"
                value={range.from}
                onChange={(e) => handleRangeChange(e, index, "from")}
                className="w-full border rounded-md p-2"
                placeholder="From"
              />
              <input
                type="number"
                value={range.to}
                onChange={(e) => handleRangeChange(e, index, "to")}
                className="w-full border rounded-md p-2"
                placeholder="To"
              />
            </div>
          ))}
        </div>

        <div>
          <p className="font-semibold mb-2">Select Range Type:</p>
          <div className="flex gap-2 items-center">
            <input
              type="radio"
              name="rangeType"
              id="all"
              value="all"
              checked={selectedRangeType === "all"}
              onChange={(e) =>
                setSelectedRangeType(e.target.value as "all" | "odd" | "even")
              }
              className="w-4 h-4"
            />
            <label htmlFor="all">All</label>
            <input
              type="radio"
              name="rangeType"
              id="odd"
              value="odd"
              checked={selectedRangeType === "odd"}
              onChange={(e) =>
                setSelectedRangeType(e.target.value as "all" | "odd" | "even")
              }
              className="w-4 h-4"
            />
            <label htmlFor="odd">Odd</label>
            <input
              type="radio"
              name="rangeType"
              id="even"
              value="even"
              checked={selectedRangeType === "even"}
              onChange={(e) =>
                setSelectedRangeType(e.target.value as "all" | "odd" | "even")
              }
              className="w-4 h-4"
            />
            <label htmlFor="even">Even</label>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Text:</p>
          <div
            className="relative border rounded-md p-2 cursor-pointer"
            onClick={() => setTextMenuOpen(!textMenuOpen)}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm">{selectedTextName}</p>
              <FaChevronDown
                className={`text-sm ${textMenuOpen ? "rotate-180" : ""}`}
              />
            </div>

            {textMenuOpen && (
              <div className="absolute left-0 top-10 w-full bg-white shadow-md rounded-md z-50">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setSelectedTextName("Page {current} of {total}");
                    setTextMenuOpen(false);
                  }}
                >
                  Page {"{current}"} of {"{total}"}
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setSelectedTextName("{current}");
                    setTextMenuOpen(false);
                  }}
                >
                  {"{current}"}
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={!results.length}
          className="bg-blue-500 text-white py-2 rounded-md disabled:opacity-50 max-w-md sm:w-auto"
        >
          Apply Page Numbers
        </button>
      </div>
    </div>
  );
};

export default PageSidebar;
