import { useState } from "react";
import useUploadData from "../../hooks/useUploadData";
import useSplitStore from "../../store/useSplitStore";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import useFilesStore from "../../store/useSheetStore";
import { toast } from "react-toastify";

const Pages = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const pageExtractMode = useSplitStore((s) => s.pageExtractMode);
  const setPageExtractMode = useSplitStore((s) => s.setPageExtractMode);
  const setLoading = useFilesStore((state) => state.setLoading);
  const { extractAllPages, extractSelectedRange, extractSelectedPage } =
    useUploadData();

  const { selectedFile } = useFileSessionStore();

  const clearSelectedRange = useSplitStore((s) => s.clearSelectedRange);

  const setResults = useSplitStore((state) => state.setResults);
  const setPageRange = useSplitStore((state) => state.setPageRange);
  const pageRange = useSplitStore((state) => state.pageRange);
  const results = useSplitStore((state) => state.results);
  const activeRange = useSplitStore((state) => state.activeRange);

  const [pageInput, setPageInput] = useState("");

  const handleSplit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));

    try {
      if (!selectedFile) return;

      if (pageExtractMode === "extractAll") {
        const allResults = await extractAllPages(selectedFile);
        setResults(allResults as any);
      }

      if (pageExtractMode === "selectPages") {
        const { pages, ranges } = parsePagesAndRanges(pageInput);

        const pageResults =
          pages.length > 0
            ? await extractSelectedPage(selectedFile, pages)
            : [];

        const rangeResults = await Promise.all(
          ranges.map((r) => extractSelectedRange(selectedFile, r))
        );

        setResults([...(pageResults ?? []), ...rangeResults.flat()] as any);
      }

      setIsSidebarOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Page split failed");
    } finally {
      setLoading(false);
    }
  };

  const parsePagesAndRanges = (input: string) => {
    const pages: number[] = [];
    const ranges: { from: number; to: number }[] = [];

    input.split(",").forEach((part) => {
      const value = part.trim();

      if (value.includes("-")) {
        const [from, to] = value.split("-").map(Number);

        if (
          !Number.isNaN(from) &&
          !Number.isNaN(to) &&
          from > 0 &&
          to >= from
        ) {
          ranges.push({ from, to });
        }
      } else {
        const page = Number(value);
        if (!Number.isNaN(page) && page > 0) {
          pages.push(page);
        }
      }
    });

    return { pages, ranges };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);

    clearSelectedRange();

    const { pages, ranges } = parsePagesAndRanges(value);
    setPageRange(pages.join(",") as string);
    useSplitStore
      .getState()
      .setActiveRange(
        ranges.map((r) => ({ from: r.from.toString(), to: r.to.toString() }))
      );
  };

  const handleDownloadSelectedPages = async () => {
    if (!selectedFile) return;
    const selectedpageResult = await extractSelectedPage(
      selectedFile as File,
      pageRange.split(",").map(Number)
    );
    const rangeResults = await Promise.all(
      activeRange.map((r: { from: string; to: string }) =>
        extractSelectedRange(selectedFile as File, {
          from: Number(r.from),
          to: Number(r.to),
        })
      )
    );

    const blob = new Blob(
      [new Uint8Array(await selectedpageResult[0]?.blob.arrayBuffer())],
      {
        type: "application/pdf",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-pages.pdf";
    a.click();

    rangeResults.forEach(async (r) => {
      const rangeblob = new Blob(
        [new Uint8Array(await r[0]?.blob.arrayBuffer())],
        {
          type: "application/pdf",
        }
      );
      const urls = URL.createObjectURL(rangeblob);
      const as = document.createElement("a");
      as.href = urls;
      as.download = "selected-pages.pdf";
      as.click();
      URL.revokeObjectURL(urls);
    });
  };

  const handleDownloadAllPages = async () => {
    if (!selectedFile) return;
    const allResults = await extractAllPages(selectedFile as File);
    const blob = new Blob(
      [new Uint8Array(await allResults[0]?.blob.arrayBuffer())],
      {
        type: "application/pdf",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-pages.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <p className=" text-lg font-medium text-text-body py-2">Extract Mode:</p>
      <div className="flex items-center justify-between sm:gap-0 gap-2">
        <div className=" flex sm:flex-row flex-col gap-2 w-full">
          <button
            onClick={() => setPageExtractMode("extractAll")}
            className={`transition-all duration-200 font-medium rounded-md sm:px-4 sm:py-2 px-2 py-2 ${
              pageExtractMode === "extractAll"
                ? "bg-primary/80 text-white border border-primary shadow-sm"
                : "bg-primary-soft text-primary border border-border hover:bg-primary/20"
            }`}
          >
            Extract All Pages
          </button>
          <button
            onClick={() => setPageExtractMode("selectPages")}
            className={`transition-all duration-200 font-medium rounded-md sm:px-6 sm:py-2 px-2 py-2 ${
              pageExtractMode === "selectPages"
                ? "bg-primary/80 text-white border border-primary shadow-sm"
                : "bg-primary-soft text-primary border border-border hover:bg-primary/20"
            }`}
          >
            Select Pages
          </button>
        </div>
      </div>
      <div className="py-3 flex flex-col gap-2">
        {pageExtractMode === "extractAll" && (
          <div className="mt-2 flex flex-col gap-2">
            <div className=" w-full flex justify-center my-2">
              <button
                onClick={handleSplit}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition w-full"
              >
                Split
              </button>
            </div>
            <p className="text-sm text-black">
              Selected pages will be converted into sepraate pdf files.{" "}
              <b>{results.length} pdf</b> will be created.
            </p>
            <button
              onClick={handleDownloadAllPages}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition w-full"
            >
              Download All Pages
            </button>
          </div>
        )}
        {pageExtractMode === "selectPages" && (
          <div className="flex flex-col gap-2 my-2">
            <p>Pages to extract</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="1,2,5-10"
                className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-0 text-text-body "
                value={pageInput}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <button
                onClick={handleSplit}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition"
              >
                Split
              </button>
              <p className="text-sm text-text-body">
                Selected pages will be converted into sepraate pdf files.{" "}
                <b>{results.length} pdf</b> will be created.
              </p>
              <button
                onClick={handleDownloadSelectedPages}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition w-full"
              >
                Download Selected Pages
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Pages;
