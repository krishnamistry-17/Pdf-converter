import { steps } from "../../../constance/Text";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ConversionFlow = () => {
  return (
    <section className="w-full mx-auto container-custom">
      <div className="text-center mb-14">
        <h2 className="lg:text-4xl md:text-3xl text-2xl font-semibold tracking-tight text-text-heading">
          How File Conversion Works
        </h2>
        <p className="mt-3 max-w-xl mx-auto lg:text-lg text-md font-medium text-text-body">
          Convert files in seconds with our fast and secure online tools.
        </p>
      </div>

      <motion.div
        variants={containerVariants as any}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step: any, index: number) => (
            <motion.div
              key={index}
              variants={itemVariants as any}
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

              <h3 className="mt-6 xl:text-[18px] text-[16px]  font-semibold text-text-heading">
                {step.title}
              </h3>
              <p className="mt-2 xl:text-[16px] text-[14px] text-text-body leading-relaxed font-medium max-w-[240px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ConversionFlow;
