import useSplitStore from "../../store/useSplitStore";
import Pages from "./Pages";
import Range from "./Range";
import Size from "./Size";

const SplitSidebar = ({
  setIsSidebarOpen,
  setIsTabChanged,
}: {
  setIsSidebarOpen: (open: boolean) => void;
  setIsTabChanged: (changed: boolean) => void;
}) => {
  const splitRangeType = useSplitStore((state) => state.splitRangeType);
  const setSplitRangeType = useSplitStore((state) => state.setSplitRangeType);
  return (
    <div className=" space-y-2">
      <div className="flex items-center justify-between sm:gap-0 gap-2">
        <div className="flex sm:flex-row flex-col  gap-2 w-full">
          {["Range", "Pages", "Size"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSplitRangeType(tab as "Range" | "Pages" | "Size");
                setIsTabChanged(true);
              }}
              className={`
                transition-all duration-200 font-medium px-6 py-2 rounded-md
                ${
                  splitRangeType === tab
                    ? "bg-primary/80 text-white border border-primary shadow-sm"
                    : "bg-primary-soft text-primary border border-border hover:bg-primary/20"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {splitRangeType === "Range" && (
        <Range setIsSidebarOpen={setIsSidebarOpen} />
      )}
      {splitRangeType === "Pages" && (
        <Pages setIsSidebarOpen={setIsSidebarOpen} />
      )}
      {splitRangeType === "Size" && (
        <Size setIsSidebarOpen={setIsSidebarOpen} />
      )}
    </div>
  );
};

export default SplitSidebar;
