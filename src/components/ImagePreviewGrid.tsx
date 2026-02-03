const ImagePreviewGrid = ({ images }: { images: string[] }) => {
  return (
    <div className="mt-4 mb-10">
      <div className="flex flex-wrap gap-5 justify-center items-center mx-auto">
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-2 object-contain
            flex flex-col relative"
          >
            <img
              src={image}
              alt={`page-${index + 1}`}
              className="w-full max-h-[50vh] sm:max-h-80 object-contain rounded "
            />
            <p className="text-center mt-2 font-medium text-blue">
              Page {index + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImagePreviewGrid;
