import { HeroSectionText } from "../../constance/Text";
import HeroSectionImage from "../../assets/svgs/herobg.svg";

const Herosection = () => {
  return (
    <section className="bg-site-bg">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 lg:py-0 py-8 flex  lg:flex-row xl:gap-16 gap-8 items-center">
        <div className="md:flex-1">
          <h1 className="font-semibold lg:text-5xl md:text-4xl text-3xl tracking-tight text-text-heading">
            {HeroSectionText.heading}
          </h1>

          <p className="mt-4 max-w-xl text-lg text-text-body leading-relaxed">
            {HeroSectionText.description}
          </p>

          <div className="mt-6 flex gap-6 text-sm text-text-body flex-wrap">
            {HeroSectionText.points.map((point, index) => (
              <span key={index}>{point}</span>
            ))}
          </div>
        </div>

        <div className="lg:flex-1 lg:block hidden w-full max-w-md">
          <img src={HeroSectionImage} alt="Hero Section Image" />
        </div>
      </div>
    </section>
  );
};

export default Herosection;
