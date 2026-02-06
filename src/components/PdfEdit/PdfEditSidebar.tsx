const PdfEditSidebar = () => {
  return (
    <div className="flex flex-col gap-3 my-4 h-full">
      <h2 className="text-xl font-semibold text-text-heading border-b border-border pb-4">
        Edit PDF
      </h2>
      <div className="my-4 bg-primary/10 text-primary border border-primary p-4 rounded-md  transition cursor-pointer">
        <p>Use a toolbar to modify, add text or images to the PDF</p>
      </div>
      {/* <div className=" flex justify-center items-center w-full mt-auto">
        <button className="bg-primary text-white px-4 py-2 w-full rounded-md">
          Download PDF
        </button>
      </div> */}
    </div>
  );
};

export default PdfEditSidebar;
