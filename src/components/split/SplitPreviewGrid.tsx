import useSplitStore from "../../store/useSplitStore";
import { useEffect } from "react";

const SplitPreviewGrid = () => {
  const results = useSplitStore((s) => s.results);
  const selectedPages = useSplitStore((s) => s.pageRange);
  const selectedRange = useSplitStore((s) => s.activeRange);

  const activeMode = useSplitStore((s) => s.activeMode);

  const checkedPages = new Set<number>();

  useEffect(() => {
    if (activeMode === "custome") {
      selectedRange?.forEach((r: { from: string; to: string }) => {
        for (let i = Number(r.from); i <= Number(r.to); i++)
          checkedPages.add(i);
      });
    } else {
      for (
        let i = 1;
        i <= Number(selectedPages.split(",").map(Number).join(","));
        i++
      )
        checkedPages.add(i);
    }
  }, [activeMode, selectedRange, selectedPages]);

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((file, index) => {
          const filePages: number[] = file.pages
            .split(",")
            .flatMap((p: string) =>
              p.includes("-")
                ? Array.from(
                    {
                      length:
                        Number(p.split("-")[1]) - Number(p.split("-")[0]) + 1,
                    },
                    (_, i) => Number(p.split("-")[0]) + i
                  )
                : [Number(p)]
            );
         
          const isSelected = filePages.some((p) => checkedPages.has(p));

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col relative"
            >
              <div className="flex-1">
                <div className="absolute top-2 right-2">
                  {isSelected && (
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                      <input type="checkbox" checked readOnly />
                    </div>
                  )}
                </div>
                <iframe
                  src={file.url}
                  title={file.name}
                  className="w-full h-80 rounded border"
                />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">Pages {file.pages}</p>
              </div>

              <a
                href={file.url}
                download={file.name}
                className="mt-4 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Download
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SplitPreviewGrid;
