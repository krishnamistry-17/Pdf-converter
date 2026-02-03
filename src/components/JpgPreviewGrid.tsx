const JpgPreviewGrid = ({ images }: { images: string[] }) => {
  return (
    <div className="mt-4 mb-10">
      <div
        className=" flex justify-center items-center 
        flex-wrap mx-auto gap-3"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-white text-blue rounded-xl shadow-md p-2 object-contain 
            flex flex-col relative "
          >
            <img
              src={image}
              alt={`image-${index}`}
              className="w-full max-h-[50vh] sm:max-h-80 object-contain rounded"
            />
            <p className="font-medium mt-2 text-blue text-center">{`image-${index}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JpgPreviewGrid;
