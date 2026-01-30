import useUploadData from "../../hooks/useUploadData";
import { useCropPdfStore } from "../../store/useCropPdf";

const CropPreviewGrid = ({
  images,
  setActiveCropIndex,
  showCropImage,
}: {
  images: string[];
  setActiveCropIndex: (index: number) => void;
  showCropImage: boolean;
}) => {
  const { downloadBlob } = useUploadData();
  const { clearCropResults, clearResults } = useCropPdfStore();
  const selectedPageType = useCropPdfStore((state) => state.selectedPageType);
  const cropResults = useCropPdfStore((state) => state.cropResults);
  console.log(showCropImage);

  const filteredImages =
    selectedPageType === "current" ? images.slice(0, 1) : images;

  const showImages =
    showCropImage && cropResults.length > 0
      ? cropResults.map((r) => URL.createObjectURL(r.blob))
      : filteredImages;

  console.log(showImages);

  const downloadCroppedImages = () => {
    cropResults.forEach((result) => {
      downloadBlob(result.blob, result.fileName);
    });
    clearCropResults();
    clearResults();
  };

  return (
    <div className="my-6 w-full">
      <div className="flex justify-center items-center flex-wrap mx-auto gap-3">
        {showImages.map((image, index) => (
          <div
            key={index}
            onClick={() => setActiveCropIndex(index)}
            className={`cursor-pointer border rounded-lg p-2 hover:ring-2 hover:ring-blue ${
              selectedPageType === "current" ? "bg-blue/10" : "bg-white"
            }`}
          >
            <img
              src={image}
              alt={`page-${index + 1}`}
              className="h-80 object-contain"
            />
            <p className="text-sm   text-blue text-center">Page {index + 1}</p>
          </div>
        ))}
      </div>

      {cropResults.length > 0 && (
        <div className="flex justify-center items-center my-6">
          <button
            className="bg-blue text-white px-4 py-2 rounded-md"
            onClick={downloadCroppedImages}
          >
            Download Cropped Images
          </button>
        </div>
      )}
    </div>
  );
};

export default CropPreviewGrid;
