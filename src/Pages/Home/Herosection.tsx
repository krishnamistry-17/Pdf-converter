const Herosection = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-5">
      <h1
        className=" font-semibold lg:text-[42px] md:text-4xl sm:text-3xl text-2xl  tracking-tight
      text-black text-center"
      >
        {" "}
        Convert your files to and from PDF
      </h1>
      <p
        className="md:text-lg text-sm px-2  pt-2 font-interMedium
      font-semibold text-center
      text-gray-500
      "
      >
        This is a simple app that allows you to convert files to and from PDF.
      </p>
    </div>
  );
};

export default Herosection;
