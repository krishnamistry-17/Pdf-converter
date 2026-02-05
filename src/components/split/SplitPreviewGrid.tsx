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
    <div>
      <div
        className=" flex justify-center items-center 
      flex-wrap mx-auto gap-3"
      >
        {results.map((file, index) => {
          return (
            <div
              key={index}
              className="bg-white/40 text-text-body rounded-xl shadow-md p-4 flex flex-col relative mb-6"
            >
              <div className="flex-1">
                <iframe
                  src={file.url}
                  title={file.name}
                  className="w-full h-80 rounded border"
                />
                <p className="font-medium text-text-body">{file.name}</p>
                <p className="text-sm text-text-body">Pages {file.pages}</p>
              </div>

              <a
                href={file.url}
                download={file.name}
                className="mt-4 text-center bg-primary hover:bg-primary-hover text-white py-2 rounded-md "
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
