import { FaSearch } from "react-icons/fa";

const SearchConversion = () => {
  return (
    <div className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-full w-full ">
      <FaSearch className=" text-black/50" />
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent outline-none w-full focus:outline-none focus:ring-0"
      />
    </div>
  );
};

export default SearchConversion;
