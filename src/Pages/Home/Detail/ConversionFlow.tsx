import { steps } from "../../../constance/Text";

const ConversionFlow = () => {
  return (
    <section className="max-w-[1100px] mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h2
          className="lg:text-4xl md:text-3xl text-2xl font-semibold tracking-tight
        text-text-heading   text-center"
        >
          How File Conversion Works
        </h2>
        <p
          className="mt-3 max-w-xl mx-auto lg:text-lg text-md
        font-medium text-center
          text-text-body
        "
        >
          Convert files in seconds with our fast and secure online tools.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 ">
        {steps.map((step: any, index: number) => (
          <div
            key={index}
            className="group flex flex-col items-center text-center bg-white rounded-2xl p-6"
          >
            <div
              className={`
                  w-16 h-16 rounded-full
                  bg-gradient-to-b ${step.color}
                  flex items-center justify-center
                  text-white text-2xl
                  shadow-lg
                  group-hover:scale-110 transition
                `}
            >
              <step.icon />
            </div>

            <h3 className="mt-6 text-lg font-semibold text-text-heading">
              {step.title}
            </h3>
            <p className="mt-2 text-sm  text-text-body leading-relaxed font-medium max-w-[240px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ConversionFlow;
