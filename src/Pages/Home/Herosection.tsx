import { HeroSectionText } from "../../constance/Text";
import HeroSectionImage from "../../assets/svgs/herobg.svg";

const Herosection = () => {
  return (
    <section className="bg-site-bg">
      <div
        className="max-w-7xl mx-auto 
        px-4 lg:px-8 
        py-8  lg:py-0
        flex lg:flex-row 
        xl:gap-16 lg:gap-8  items-center"
      >
        <div className="md:flex-1 lg:text-left text-center">
          <h1
            className="font-semibold 
          lg:text-[48px] md:text-[36px] text-[32px] tracking-tight text-text-heading"
          >
            {HeroSectionText.heading}
          </h1>

          <p
            className="lg:mt-4 lg:max-w-xl text-lg text-text-body leading-relaxed lg:text-left text-center
          lg:text-[18px] text-[16px]
          "
          >
            {HeroSectionText.description}
          </p>
        </div>

        <div className="lg:flex-1 lg:block hidden w-full max-w-md">
          <img src={HeroSectionImage} alt="Hero Section Image" />
        </div>
      </div>
    </section>
  );
};

export default Herosection;
