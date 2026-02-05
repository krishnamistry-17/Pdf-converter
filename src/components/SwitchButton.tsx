import { useState } from "react";
import useSplitStore from "../store/useSplitStore";

const SwitchButton = () => {
  const sizeUnit = useSplitStore((state) => state.sizeUnit);
  const setSizeUnit = useSplitStore((state) => state.setSizeUnit);

  const [activeUnit, setActiveUnit] = useState<"MB" | "KB">(sizeUnit);

  const handleUnitChange = (unit: "MB" | "KB") => {
    setActiveUnit(unit);
    setSizeUnit(unit);
  };

  return (
    <div className="flex items-center gap-2 bg-primary/10 rounded-r-full rounded-l-full p-1">
      <button
        className={`${
          activeUnit === "MB"
            ? "bg-primary/10 text-primary border border-primary"
            : "bg-primary/10 text-primary "
        } px-4 py-2 rounded-full transition`}
        onClick={() => handleUnitChange("MB")}
      >
        MB
      </button>
      <button
        className={`${
          activeUnit === "KB"
            ? "bg-primary/10 text-primary border border-primary"
            : "bg-primary/10 text-primary "
        } px-4 py-2 rounded-full transition`}
        onClick={() => handleUnitChange("KB")}
      >
        KB
      </button>
    </div>
  );
};

export default SwitchButton;
