import WatermarkPosition from "./WatermarkPosition";
import { IoMdArrowForward } from "react-icons/io";

const PlaceText = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) => {

  const handleAddWatermark = () => {
    console.log("add watermark");
    setIsSidebarOpen(false);
  };
  
  return (
    <>
      <div className="flex flex-col gap-2 my-4">
        <p className="text-lg font-medium py-2">Enter Text:</p>
        <input
          type="text"
          className="w-full p-2 border border-blue/30 rounded-md 
          focus:outline-none focus:ring-0 bg-sea text-blue"
          placeholder="Add Watermark Text"
        />
      </div>
      <div className="flex flex-col gap-2 my-4">
        <p className="text-lg font-medium py-2">Add Watermark Position:</p>
        <WatermarkPosition />
      </div>
      <div className="flex justify-center my-4">
        <button
          className="bg-blue hover:bg-gradient-to-r from-blue to-teal text-white
         px-4 py-2 rounded-md w-full flex items-center justify-center gap-1"
          onClick={() => handleAddWatermark()}
        >
          Add Watermark <IoMdArrowForward />
        </button>
      </div>
    </>
  );
};

export default PlaceText;
