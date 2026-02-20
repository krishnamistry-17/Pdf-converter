import { FaRotateLeft, FaRotateRight } from "react-icons/fa6";
import { IoMdArrowForward, IoMdClose } from "react-icons/io";

const Rotatepdfsidebar = ({
  handleReset,

  mergeDisplayFiles,
  handleRotateFromRight,
  handleRotateFromLeft,
  handleDownloadRotatedPdf,
}: {
  handleReset: () => void;
  mergeDisplayFiles: () => React.ReactNode;
  handleRotateFromRight: () => void;
  handleRotateFromLeft: () => void;
  handleDownloadRotatedPdf: () => void;
}) => {
  return (
    <div>
      <div className="p-6">
        <button className="absolute top-5 right-5" onClick={handleReset}>
          <IoMdClose />
        </button>

        <h2 className="text-xl font-semibold text-text-heading border-b border-border pb-4">
          Rotate PDF
        </h2>

        <div className="flex justify-between mt-6">
          <p className="font-semibold text-text-heading">Files</p>
          <button
            onClick={handleReset}
            className="text-text-body text-sm underline"
          >
            Reset All
          </button>
        </div>

        {mergeDisplayFiles()}

        <div className=" my-4 bg-primary/10 text-primary border border-primary p-4 rounded-md  transition cursor-pointer">
          <p>Mouse over below to see the rotation of the pages</p>
        </div>

        <div className="flex flex-col gap-2 my-4">
          <div
            className="flex items-center gap-2 bg-primary/10 text-primary  p-2 rounded-md"
            onClick={() => handleRotateFromRight()}
          >
            <div className="bg-primary/10 text-primary border border-primary p-1 rounded-md">
              <FaRotateRight className=" " />
            </div>
            <p>Rotate From Right</p>
          </div>
          <div
            className="flex items-center gap-2 bg-primary/10 text-primary  p-2 rounded-md"
            onClick={() => handleRotateFromLeft()}
          >
            <div className="bg-primary/10 text-primary border border-primary p-1 rounded-md">
              <FaRotateLeft className=" " />
            </div>
            <p>Rotate From Left</p>
          </div>
        </div>

        <button
          className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md flex justify-center items-center"
          onClick={handleDownloadRotatedPdf}
        >
          Download Rotated PDF <IoMdArrowForward className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Rotatepdfsidebar;
