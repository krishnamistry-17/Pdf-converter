const Herosection = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-5">
      <h1
        className="lg:text-4xl md:text-3xl text-2xl font-extrabold tracking-tight
      text-blue  text-center"
      >
        {" "}
        Convert your files to and from PDF
      </h1>
      <p
        className="md:text-lg text-sm px-2  pt-2
      font-semibold text-center
      bg-gradient-to-b bg-clip-text text-transparent from-blue to-gradient
      "
      >
        This is a simple app that allows you to convert files to and from PDF.
      </p>
    </div>
  );
};

export default Herosection;
