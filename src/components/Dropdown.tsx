import { useNavigate } from "react-router-dom";
import { convertOptions } from "../constance/ConvertOptions";

const Dropdown = ({ close }: { close: () => void }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
    absolute
    top-12
    xl:right-0 md:right-[15px]
    mt-2 p-5
    w-[90vw] max-w-[500px]
    bg-white shadow-lg rounded-md text-sm z-50
    transition-all duration-300
     "
    >
      <div className="flex gap-8">
        {convertOptions.map((section: any, idx: number) => (
          <div key={idx}>
            <h3 className="font-semibold mb-2">{section.title}</h3>
            <ul className="space-y-1 items-center justify-center">
              {section.options.map((item: any, i: number) => (
                <li key={i} className="text-center">
                  <button
                    onClick={() => {
                      navigate(item.path);
                      close();
                    }}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2 justify-start">
                      <item.icon className=" text-red-500 text-lg" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
