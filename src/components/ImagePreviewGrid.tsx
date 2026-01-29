const ImagePreviewGrid = ({ images }: { images: string[] }) => {
  return (
    <div className="mt-4 mb-10">
      <div className=" flex justify-center items-center 
      flex-wrap mx-auto gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-white text-blue rounded-xl shadow-md p-4 flex flex-col relative w-full max-w-sm"
          >
            <iframe
              src={image}
              title={`image-${index}`}
              className="w-full h-80 rounded border"
            />
            <p className="font-medium mt-2">{`image-${index}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreviewGrid;
