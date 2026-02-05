const PageNumberPreviewGrid = ({ images }: { images: string[] }) => {
  return (
    <div className="my-6 w-full">
      <div
        className=" flex justify-center items-center 
      flex-wrap mx-auto gap-3"
      >
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="bg-white/40 text-text-body max-w-96 mt-3 xl rounded-xl shadow-md p-4 relative z-40 overflow-x-auto "
          >
            <iframe
              src={image}
              title={`page-${index + 1}`}
              className="w-full h-60 border rounded text-text-body"
            />

            <div className="mt-3">
              <p className="font-medium truncate text-text-body">{`page-${
                index + 1
              }`}</p>
              <p className="text-sm text-text-body">Page {index + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageNumberPreviewGrid;
