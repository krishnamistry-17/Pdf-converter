import { toast } from "react-toastify";
import useSplitStore from "../../store/useSplitStore";
import { useEffect } from "react";

const SplitPreviewGrid = ({ isMobile }: { isMobile: boolean }) => {
  const results = useSplitStore((s) => s.results);
  const selectedPages = useSplitStore((s) => s.pageRange);
  const selectedRange = useSplitStore((s) => s.activeRange);
  const splitRangeType = useSplitStore((s) => s.splitRangeType);

  const clearResults = useSplitStore((s) => s.clearResults);

  const activeMode = useSplitStore((s) => s.activeMode);

  const checkedPages = new Set<number>();

  const handleDownload = () => {
    clearResults();
    toast.success("Downloaded successfully");
  };

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

  const containerWidth =
    results.length > 1 ? "sm:grid-cols-2 grid-cols-1" : "grid-cols-1";

  return (
    <div>
      <div className={`grid ${containerWidth} place-items-center`}>
        {results.map((file, index) => {
          return (
            <>
              <div
                key={index}
                className=" w-full max-w-[400px] bg-white/40 text-text-body rounded-xl shadow-md p-4 flex flex-col relative mb-6"
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
                  onClick={handleDownload}
                  className="mt-4 text-center bg-primary hover:bg-primary-hover text-white py-2 rounded-md "
                >
                  Download
                </a>
              </div>
            </>
          );
        })}
        {isMobile && splitRangeType === "Pages" && (
          <p className="text-sm text-text-body">
            To download all pages, please check the select pages option.
          </p>
        )}
      </div>
    </div>
  );
};

export default SplitPreviewGrid;
