import ScrollWindow from "../ScrollWindow";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import GlobalLoader from "../GlobalLoader";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient/50">
      <Navbar />
      <ScrollWindow>
        <GlobalLoader />
        <Outlet />
      </ScrollWindow>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};
export default Layout;
