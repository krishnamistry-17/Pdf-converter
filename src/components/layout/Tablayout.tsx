import { useNavigate } from "react-router-dom";
import { fileOperations } from "../../constance/ConvertOptions";

const colors = [
  "from-red-500 to-red-400",
  "from-blue to-teal",
  "from-green-500 to-green-400",
  "from-purple-500 to-purple-400",
  "from-orange-500 to-orange-400",
  "from-pink-500 to-pink-400",
];
const Tablayout = ({
  heading,
  titlle,
  description,
  buttonText,
  title,
}: {
  heading: string;
  titlle: string;
  description: string;
  buttonText: string;
  title: string;
}) => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };
  return (
    <div className="max-w-7xl mx-auto lg:px-4">
      <div className="text-center mb-12">
        <h2
          className="lg:text-4xl md:text-3xl text-2xl font-semibold tracking-tight
      text-black  text-center"
        >
          {heading}
        </h2>
        <p
          className="md:text-lg text-sm  mt-2
      font-medium text-center
      text-gray-500
      "
        >
          {titlle}
        </p>
        <p
          className="md:text-lg text-sm  mt-2 mx-auto 
      font-medium text-center text-gray-500"
        >
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {fileOperations
          .find((operation: any) => operation.title === title)
          ?.options.map((operation: any, index: number) => (
            <button
              key={index}
              className="group bg-white  rounded-2xl p-6 
     shadow-sm hover:shadow-xl transition-all duration-300 
     hover:-translate-y-1.5 text-center sm:text-left"
              onClick={() => handleClick(operation.path)}
            >
              <div className="flex justify-center sm:justify-start">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-b ${
                    colors[index % colors.length]
                  } flex items-center justify-center text-white text-2xl mb-6`}
                >
                  <operation.icon />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-black mb-2">
                {operation.label}
              </h3>

              <p className="text-sm font-medium text-blue mb-6">
                {operation.description}
              </p>

              <div className="flex justify-center sm:justify-start text-sm font-medium text-blue">
                {buttonText} →
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Tablayout;
