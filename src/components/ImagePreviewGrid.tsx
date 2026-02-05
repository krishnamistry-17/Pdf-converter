interface ImagePreviewGridProps {
  images: string[];
  handleDownloadImage: (index: number) => void;
}

const ImagePreviewGrid = ({
  images,
  handleDownloadImage,
}: ImagePreviewGridProps) => {
  return (
    <div className="mt-4 mb-10">
      <div className="flex flex-wrap gap-5 justify-center items-center mx-auto">
        {images.map((image, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div
              className="bg-white rounded-xl shadow p-2 object-contain
            flex flex-col relative"
            >
              <img
                src={image}
                alt={`page-${index + 1}`}
                className="w-full max-h-[50vh] sm:max-h-80 object-contain rounded "
              />
              <p className="text-center mt-2 font-medium text-text-body">
                Page {index + 1}
              </p>
            </div>
            <div className="flex justify-center my-2">
              <button
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md"
                onClick={() => handleDownloadImage(index)}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImagePreviewGrid;
