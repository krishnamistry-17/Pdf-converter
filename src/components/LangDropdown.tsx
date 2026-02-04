import { FaLanguage } from "react-icons/fa6";
import { useState } from "react";
import { languages } from "../constance/Langugaes";
import useExtractPdfStore from "../store/useExtractPdf";

const LangDropdown = () => {
  const [open, setOpen] = useState(false);
  const setSelectedLanguage = useExtractPdfStore(
    (state) => state.setSelectedLanguage
  );
  const selectedLanguage = useExtractPdfStore(
    (state) => state.selectedLanguage
  );

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    toggleOpen();
  };

  return (
    <div className=" relative my-2">
      <button
        className="flex items-center gap-2 text-left font-medium
         bg-white text-blue px-4 py-2 rounded-xl shadow-sm border border-gray-100"
        onClick={() => toggleOpen()}
      >
        <FaLanguage />
        <span className="text-sm text-blueprimary font-medium">
          {languages.find((lang) => lang.code === selectedLanguage)?.name}
        </span>
      </button>
      {open && (
        <div className="absolute top-12 left-0 z-50 bg-white text-blue shadow-sm border border-gray-100 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className="text-sm text-blueprimary font-medium hover:bg-blue/10 p-2 rounded-md"
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LangDropdown;
