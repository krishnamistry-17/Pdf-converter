import { useState } from "react";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown";
import { IoMdClose } from "react-icons/io";
import PdfConverterLogo from "../../assets/svgs/pdf-converter-logo.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  return (
    <header
      className=" text-white shadow-md sticky top-0 left-0 right-0 
      z-50 bg-blue"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex justify-between items-center relative ">
        <div onClick={() => navigate("/")}>
          <img
            src={PdfConverterLogo}
            alt="PDF Converter Logo"
            className="w-full h-full object-contain font-medium"
          />
        </div>

        <div className="md:flex hidden items-center gap-6">
          <button
            className="text-left font-medium"
            onClick={() => navigate("/merge-pdfs")}
          >
            Merge PDF
          </button>
          <button
            className="text-left font-medium"
            onClick={() => navigate("/split-pdfs")}
          >
            Split PDF
          </button>
          <button
            className="text-left font-medium"
            onClick={() => navigate("/compress-pdfs")}
          >
            Compress PDF
          </button>

          <div className="relative">
            <button
              className="flex items-center gap-2 text-left font-medium"
              onClick={toggleDropdown}
              onMouseEnter={() => setOpen(true)}
            >
              Convert PDF{" "}
              <FaChevronDown className={`${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div onMouseLeave={() => setOpen(false)}>
                <Dropdown close={() => setOpen(false)} />
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            <FaBars />
          </button>
        </div>
        {mobileMenu && (
          <div
            onMouseLeave={() => setMobileMenu(false)}
            className="absolute top-16 z-50 right-0 mt-2 p-4 w-[250px] bg-sea font-medium
             text-blue shadow-lg rounded-md text-sm"
          >
            <div className="absolute top-3 right-3 cursor-pointer">
              <IoMdClose
                onClick={() => setMobileMenu(false)}
                className=" w-5 h-5"
              />
            </div>
            <div
              className="flex flex-col text-left  gap-4"
              onClick={() => setMobileMenu(false)}
            >
              <button
                className="text-left font-medium"
                onClick={() => navigate("/merge-pdfs")}
              >
                Merge PDF
              </button>
              <button
                className="text-left font-medium"
                onClick={() => navigate("/split-pdfs")}
              >
                Split PDF
              </button>
              <button
                className="text-left font-medium"
                onClick={() => navigate("/compress-pdfs")}
              >
                Compress PDF
              </button>
              <button
                className="text-left font-medium"
                onClick={() => navigate("/convert-pdfs")}
              >
                Convert PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
