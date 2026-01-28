const PageNumberPreviewGrid = ({ images }: { images: string[] }) => {
  console.log(images);
  return (
    <div className="my-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="bg-white max-w-96 mt-3 xl rounded-xl shadow-md p-4 relative z-40 overflow-x-auto "
          >
            <iframe
              src={image}
              title={`page-${index + 1}`}
              className="w-full h-60 border rounded"
            />

            <div className="mt-3">
              <p className="font-medium truncate">{`page-${index + 1}`}</p>
              <p className="text-sm text-gray-500">Page {index + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageNumberPreviewGrid;
