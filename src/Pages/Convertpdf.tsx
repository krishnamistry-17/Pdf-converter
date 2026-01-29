import { useNavigate } from "react-router-dom";
import { convertOptions } from "../constance/ConvertOptions";
import { MdArrowBack } from "react-icons/md";

const ConvertPdf = () => {
  const navigate = useNavigate();
  return (
    <div>
      <MdArrowBack
        onClick={() => navigate("/")}
        className=" text-xl cursor-pointer ml-2 mt-2"
      />
      <div className="flex flex-col">
        {convertOptions.map((section: any, idx: number) => (
          <div key={idx} className=" p-4 hover:bg-gray-100">
            <h3 className="font-bold mb-2 text-blue">{section.title}</h3>
            <ul className="space-y-1 items-center justify-center">
              {section.options.map((item: any, i: number) => (
                <li key={i} className="text-center">
                  <button
                    onClick={() => {
                      navigate(item.path);
                      close();
                    }}
                    className="block w-full text-left px-2 py-1 rounded hover:bg-blue/10"
                  >
                    <div className="flex items-center gap-2 justify-start">
                      <item.icon className=" text-blue text-lg" />
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

export default ConvertPdf;
