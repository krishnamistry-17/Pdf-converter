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
      className=" sticky top-0 left-0 right-0 
      z-50 bg-bg-page backdrop-blur border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative ">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src={PdfConverterLogo}
            alt="PDF Converter Logo"
            className="h-8 w-auto"
          />
        </div>

        <div
          className="md:flex hidden items-center gap-6 
        text-[16px] 
        text-text-heading font-medium"
        >
          <button
            className=" hover:text-primary transition"
            onClick={() => navigate("/edit-pdf")}
          >
            Edit PDF
          </button>
          <button
            className=" hover:text-primary transition"
            onClick={() => navigate("/merge-pdfs")}
          >
            Merge PDF
          </button>
          <button
            className=" hover:text-primary transition"
            onClick={() => navigate("/split-pdfs")}
          >
            Split PDF
          </button>
          <button
            className=" hover:text-primary transition"
            onClick={() => navigate("/compress-pdfs")}
          >
            Compress PDF
          </button>

          <div className="relative">
            <button
              className="flex items-center hover:text-primary transition gap-2 text-left font-medium"
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
            className="absolute top-14 z-50 right-0 mt-2 p-4 w-[250px] bg-bg-card font-medium
             text-text-heading shadow-lg rounded-md text-sm"
          >
            <div className="absolute top-3 right-3 cursor-pointer">
              <IoMdClose
                onClick={() => setMobileMenu(false)}
                className=" w-5 h-5"
              />
            </div>
            <div
              className="flex flex-col items-start gap-4 text-sm text-text-heading font-medium"
              onClick={() => setMobileMenu(false)}
            >
              <button
                className=" hover:text-primary transition"
                onClick={() => navigate("/edit-pdf")}
              >
                Edit PDF
              </button>
              <button
                className=" hover:text-primary transition"
                onClick={() => navigate("/merge-pdfs")}
              >
                Merge PDF
              </button>
              <button
                className=" hover:text-primary transition"
                onClick={() => navigate("/split-pdfs")}
              >
                Split PDF
              </button>
              <button
                className=" hover:text-primary transition"
                onClick={() => navigate("/compress-pdfs")}
              >
                Compress PDF
              </button>
              <button
                className=" hover:text-primary transition"
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
