import { DetailText } from "../../../constance/Text";

const colors = [
  "from-red-500 to-red-400",
  "from-blue to-teal",
  "from-green-500 to-green-400",
  "from-purple-500 to-purple-400",
  "from-orange-500 to-orange-400",
  "from-pink-500 to-pink-400",
];

const Detail = () => {
  return (
    <>
      <div className="mb-5 flex flex-col gap-3">
        <h2
          className="lg:text-4xl md:text-3xl text-2xl font-bold tracking-tight
       text-blueprimary  text-center"
        >
          Why Choose Us?
        </h2>
        <p
          className=" mt-3 max-w-xl mx-auto  px-2 lg:text-lg text-md
         font-medium text-center
         text-blue
         "
        >
          We are a team of experts who are dedicated to providing the best file
          conversion service.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 max-w-[1240px] mx-auto w-full md:px-8 px-4">
        {DetailText.map((item, index) => (
          <div
            key={index}
            className="
            group relative overflow-hidden
            flex flex-col sm:flex-row items-start sm:items-center gap-5
            bg-white rounded-2xl px-6 py-10
            border border-gray-100
            shadow-sm hover:shadow-xl
            transition-all duration-300
            hover:-translate-y-1
          "
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition
              bg-gradient-to-r from-transparent via-gray-50 to-transparent"
            />

            <div
              className={`
             shrink-0 w-14 h-14 rounded-xl
              bg-gradient-to-b ${colors[index % colors.length]}
              flex items-center justify-center
              text-white text-2xl
              shadow-md group-hover:scale-110 transition
            `}
            >
              {item.icon && <item.icon />}
            </div>

            <div className="relative z-10 flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-blueprimary">
                {item.title}
              </h3>
              <p className="text-sm text-teal/80 leading-relaxed font-medium max-w-[380px]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Detail;
