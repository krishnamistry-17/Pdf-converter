const ImagePreviewGrid = ({ images }: { images: string[] }) => {
  return (
    <div className="mt-4 mb-10">
      <div className="flex flex-wrap gap-3 justify-center">
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-3 w-full max-w-sm"
          >
            <img
              src={image}
              alt={`page-${index + 1}`}
              className="w-full h-80 object-contain rounded border"
            />
            <p className="text-center mt-2 font-medium">Page {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImagePreviewGrid;
