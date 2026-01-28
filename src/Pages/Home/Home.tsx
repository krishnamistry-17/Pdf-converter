import Herosection from "./Herosection";
import ConvertTabs from "../../components/ConvertTabs";
import Detail from "./Detail/Detail";
import ConversionFlow from "./Detail/ConversionFlow";

const Home = () => {
  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white">
      <section>
        <Herosection />
      </section>

      <section className=" pt-4 pb-24">
        <ConvertTabs />
      </section>

      <section className=" pt-4 md:pb-20 pb-10">
        <ConversionFlow />
      </section>

      <section className=" pt-4 pb-24">
        <Detail />
      </section>
    </div>
  );
};
export default Home;
