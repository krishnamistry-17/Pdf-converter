import { useNavigate } from "react-router-dom";
import { fileOperations } from "../../constance/ConvertOptions";

const colors = [
  "from-red-500 to-red-400",
  "from-primary to-primary-hover",
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

  return (
    <div className="w-full mx-auto container-custom">
      <div className="text-center mb-14">
        <h2 className="text-text-heading lg:text-4xl md:text-3xl text-2xl font-semibold tracking-tight">
          {heading}
        </h2>

        <p className="mt-3 text-text-body md:text-lg text-sm max-w-2xl mx-auto">
          {titlle}
        </p>

        <p className="mt-2 text-text-body md:text-lg text-sm max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fileOperations
          .find((operation: any) => operation.title === title)
          ?.options.map((operation: any, index: number) => (
            <button
              key={index}
              onClick={() => navigate(operation.path)}
              className="
                group
                bg-bg-card
                border border-border
                rounded-2xl
                p-6
                text-left
                shadow-card
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-hover
              "
            >
              <div
                className={`
                  w-14 h-14
                  rounded-xl
                  bg-gradient-to-b ${colors[index % colors.length]}
                  flex items-center justify-center
                  text-white text-2xl
                  mb-6
                `}
              >
                <operation.icon />
              </div>

              <h3 className="text-lg font-semibold text-text-heading mb-2">
                {operation.label}
              </h3>

              <p className="text-sm text-text-body mb-6  leading-relaxed">
                {operation.description}
              </p>

              <span className="inline-flex items-center gap-1 text-sm font-medium text-text-muted">
                {buttonText}
                <span aria-hidden>→</span>
              </span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Tablayout;
