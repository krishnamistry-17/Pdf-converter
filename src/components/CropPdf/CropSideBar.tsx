import { useCropPdfStore } from "../../store/useCropPdf";
import ImageCropper from "../ImageCropper";

const CropSideBar = ({
  handleReset,
  activeCropIndex,
  setShowCropImage,
  handleCropComplete,
}: {
  handleReset: () => void;
  activeCropIndex: number | null;
  setShowCropImage: (show: boolean) => void;
  handleCropComplete: (base64: string) => void;
}) => {
  const { selectedPageType, setSelectedPageType, results } = useCropPdfStore();

  return (
    <div>
      <div className="flex flex-col gap-3 my-4">
        <div className=" flex justify-between items-center border-b border-border py-4">
          <h2 className="text-xl font-semibold text-text-heading ">Crop PDF</h2>
          <p
            className="text-sm text-text-body underline cursor-pointer"
            onClick={handleReset}
          >
            Reset All
          </p>
        </div>
      </div>
      <div className=" my-4 bg-primary/10 text-primary border border-primary p-4 rounded-md  transition cursor-pointer">
        <p>Select the page type to crop and click on the page to crop</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-text-heading">Pages:</h2>
        <div className="flex gap-3 items-center">
          <input
            type="radio"
            name="pageType"
            id="current"
            value="current"
            checked={selectedPageType === "current"}
            onChange={(e) =>
              setSelectedPageType(e.target.value as "current" | "all")
            }
            className="w-4 h-4 accent-primary "
          />
          <label htmlFor="current text-text-body">Current Page</label>
          <input
            type="radio"
            name="pageType"
            id="all"
            value="all"
            checked={selectedPageType === "all"}
            onChange={(e) =>
              setSelectedPageType(e.target.value as "current" | "all")
            }
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="all text-text-body">All Pages</label>
        </div>
        {selectedPageType === "all" && (
          <div className=" my-4 bg-primary/10 text-primary border border-primary p-4 rounded-md  transition cursor-pointer">
            <p>Select one page to crop and click on the page to crop</p>
          </div>
        )}
      </div>
      {activeCropIndex !== null && results[activeCropIndex] && (
        <div className="mt-6">
          <button className="text-lg font-semibold text-text-heading mb-2 cursor-pointer">
            Crop Page {activeCropIndex + 1}
          </button>

          <ImageCropper
            setShowCropImage={setShowCropImage}
            src={results[activeCropIndex].url}
            onCropComplete={handleCropComplete}
          />
        </div>
      )}
    </div>
  );
};

export default CropSideBar;
