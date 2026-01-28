import ScrollWindow from "../ScrollWindow";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import GlobalLoader from "../GlobalLoader";

const Layout = () => {
  return (
    <div>
      <GlobalLoader />

      <Navbar />
      <ScrollWindow>
        <Outlet />
      </ScrollWindow>
      <Footer />
    </div>
  );
};
export default Layout;
