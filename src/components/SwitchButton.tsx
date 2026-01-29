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
    <div className="flex items-center gap-2 bg-blue/10 rounded-r-full rounded-l-full p-1">
      <button
        className={`${
          activeUnit === "MB"
            ? "bg-blue/10 text-blue border border-blue"
            : "bg-blue/10 text-blue "
        } px-4 py-2 rounded-full transition`}
        onClick={() => handleUnitChange("MB")}
      >
        MB
      </button>
      <button
        className={`${
          activeUnit === "KB"
            ? "bg-blue/10 text-blue border border-blue"
            : "bg-blue/10 text-blue "
        } px-4 py-2 rounded-full transition`}
        onClick={() => handleUnitChange("KB")}
      >
        KB
      </button>
    </div>
  );
};

export default SwitchButton;
