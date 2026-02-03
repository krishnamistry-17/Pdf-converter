import useImageStore from "../store/useImageStore";

const Zipsidebar = ({
  handleReset,
  handleDownloadZip,
  handleDownloadAll,
}: {
  handleReset: () => void;
  handleDownloadZip: () => void;
  handleDownloadAll: () => void;
}) => {
  const { selectedPageType, setSelectedPageType } = useImageStore((s) => s);
  return (
    <>
      <div className="flex flex-col gap-3 my-4">
        <h2 className="text-xl font-semibold text-blue border-b border-blue/30 pb-4">
          PDF to JPG
        </h2>
        <div className="md:flex justify-between mt-6">
          <h2 className="text-lg font-semibold text-blue">
            Select Download Type:
          </h2>
          <button
            onClick={handleReset}
            className="text-blue underline md:mt-0 mt-2"
          >
            Reset All
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 items-center mt-2">
            <input
              type="radio"
              name="downloadType"
              id="all"
              value="all"
              checked={selectedPageType === "all"}
              onChange={(e) =>
                setSelectedPageType(e.target.value as "all" | "zip")
              }
              className="w-4 h-4 accent-blue "
            />
            <label htmlFor="all">All Pages</label>
            <input
              type="radio"
              name="downloadType"
              id="zip"
              value="zip"
              checked={selectedPageType === "zip"}
              onChange={(e) =>
                setSelectedPageType(e.target.value as "all" | "zip")
              }
              className="w-4 h-4 accent-blue"
            />
            <label htmlFor="zip">Zip</label>
          </div>
          {selectedPageType === "all" && (
            <div className="mt-6">
              <button
                onClick={handleDownloadAll}
                className="bg-teal max-w-sm w-full text-white px-4 py-2 rounded-md"
              >
                Download All
              </button>
            </div>
          )}
          {selectedPageType === "zip" && (
            <div className="mt-6">
              <button
                onClick={handleDownloadZip}
                className="bg-teal max-w-sm w-full text-white px-4 py-2 rounded-md"
              >
                Download Zip
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Zipsidebar;
