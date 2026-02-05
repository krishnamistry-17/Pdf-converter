import { usePdfPageNumbersStore } from "../store/usePdfPageNumbers";
import type { PageNumberPosition } from "../types/pagenumberPosition";

const positions: { label: string; value: PageNumberPosition }[] = [
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

const NumberPosition = () => {
  const position = usePdfPageNumbersStore((s) => s.pageNumberPosition);
  const setPosition = usePdfPageNumbersStore((s) => s.setPageNumberPosition);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:w-25 w-20 max-w-full  my-3">
        {positions.map((p) => (
          <button
            key={p.value}
            onClick={() => setPosition(p.value)}
            className={`border rounded-md p-2 cursor-pointer
            ${
              position === p.value
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary border"
            }`}
          ></button>
        ))}
      </div>
    </>
  );
};

export default NumberPosition;
