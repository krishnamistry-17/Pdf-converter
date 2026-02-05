import Herosection from "./Herosection";
import ConvertTabs from "../../components/ConvertTabs";
import Detail from "./Detail/Detail";
import ConversionFlow from "./Detail/ConversionFlow";

const Home = () => {
  return (
    <div className="w-full">
      <section>
        <Herosection />
      </section>

      <section className="pb-10">
        <ConvertTabs />
      </section>

      <section className=" pb-10">
        <ConversionFlow />
      </section>

      <section className=" pb-10">
        <Detail />
      </section>
    </div>
  );
};

export default Home;
