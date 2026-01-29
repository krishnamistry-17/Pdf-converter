import useSplitStore from "../../store/useSplitStore";
import { useEffect } from "react";

const SplitPreviewGrid = () => {
  const results = useSplitStore((s) => s.results);
  console.log("results", results);
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
  
  const imagesLength = results.length > 3 ? 3 : results.length;

  return (
    <div className="my-4">
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(${imagesLength},1fr)] gap-4`}>
        {results.map((file, index) => {
          return (
            <div
              key={index}
              className="bg-white/40 text-blue rounded-xl shadow-md p-4 flex flex-col relative"
            >
              <div className="flex-1">
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
                className="mt-4 text-center bg-blue hover:bg-gradient-to-r from-blue to-teal text-white py-2 rounded-md hover:bg-blue"
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
