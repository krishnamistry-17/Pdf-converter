import Herosection from "./Herosection";
import ConvertTabs from "../../components/ConvertTabs";
import Detail from "./Detail/Detail";
import ConversionFlow from "./Detail/ConversionFlow";

const Home = () => {
  return (
    <div className="w-full">
      <section className="py-8">
        <Herosection />
      </section>

      <section className="pb-20">
        <ConvertTabs />
      </section>

      <section className="pt-4 md:pb-20 pb-10">
        <ConversionFlow />
      </section>

      <section className="pt-4 pb-24">
        <Detail />
      </section>
    </div>
  );
};

export default Home;

