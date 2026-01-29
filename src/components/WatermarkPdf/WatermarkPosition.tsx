import useWaterMarkStore from "../../store/useWaterMarkStore";
import type { WaterMarkPosition } from "../../types/watermarkPosition";

const positions: { label: string; value: WaterMarkPosition }[] = [
  { label: "Top Left", value: "top-left" },
  { label: "Top", value: "top-center" },
  { label: "Top Right", value: "top-right" },
  { label: "Left", value: "middle-left" },
  { label: "Center", value: "middle-center" },
  { label: "Right", value: "middle-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom", value: "bottom-center" },
  { label: "Bottom Right", value: "bottom-right" },
];

const WatermarkPosition = () => {
  const position = useWaterMarkStore((s) => s.watermarkPosition);
  const setPosition = useWaterMarkStore((s) => s.setWatermarkPosition);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:w-25 w-20 max-w-full mb-4">
        {positions.map((p) => (
          <button
            key={p.value}
            onClick={() => setPosition(p.value)}
            className={`border rounded-md p-2 cursor-pointer ${
              position === p.value
                ? "bg-blue text-white"
                : "bg-white hover:bg-gray-100 border border-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </>
  );
};

export default WatermarkPosition;
