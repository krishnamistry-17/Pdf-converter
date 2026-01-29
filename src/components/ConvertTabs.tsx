import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { useState } from "react";
import ConvertToPdf from "./tabs/ConvertToPdf/ConvertToPdf";
import ConvertFromPdf from "./tabs/ConvertFromPdf/ConvertFromPdf";
import OtherConversion from "./tabs/OtherConversion/OtherConversion";
import AllTab from "./tabs/AllTab";
import { FaChevronDown } from "react-icons/fa";
import OrganizedPdf from "./tabs/OrganizedPdf/OrganizedPdf";
import EditPdfLayout from "./tabs/EditPdf/EditPdfLayout";

const ConvertTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };
  const tabs = [
    "All",
    "Convert to PDF",
    "Convert from PDF",
    "Organized PDFs",
    "Edit PDF",
    "Other Options",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 ">
      <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
        <div className="hidden lg:flex justify-center mb-10">
          <TabList
            className="flex md:flex-row flex-row justify-between sm:bg-white/30 bg-transparent sm:w-auto w-full 
            sm:rounded-full shadow-md sm:p-2 p-4 gap-2"
          >
            {tabs.map((tab: any, index: number) => {
              return (
                <Tab
                  key={index}
                  className={`
              cursor-pointer px-6 sm:py-3 py-2 md:text-md xl:text-lg font-semibold rounded-full text-center 
              outline-none
              ${
                activeTab === index
                  ? "bg-gradient-to-r bg-clip-text text-transparent from-blue via-teal to-blue font-semibold transition-all duration-300 underline underline-offset-8 decoration-blue  pt-1 "
                  : "text-blue hover:text-teal"
              }
            `}
                >
                  {tab}
                </Tab>
              );
            })}
          </TabList>
        </div>
        <div className="sm:block lg:hidden  lg:mb-0 mb-4 relative z-40">
          <div
            onClick={() => {
              setActiveTab(activeTab);
              handleMenuOpen();
            }}
            className=" bg-white/30 rounded-3xl shadow-sm border border-gray-100 cursor-pointer
          py-4 px-6 flex items-center justify-between w-full"
          >
            <label
              className={`text-sm md:text-md xl:text-lg text-center cursor-pointer
                ${
                  activeTab === activeTab
                    ? "  bg-gradient-to-r bg-clip-text text-transparent from-blue via-teal to-blue font-semibold"
                    : "text-gray-500 hover:text-gray-900"
                }
                `}
            >
              {tabs[activeTab]}
            </label>
            <div>
              <FaChevronDown className={`${menuOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
          {menuOpen && (
            <div
              className="flex flex-col gap-4 w-full mt-4 bg-white/30 rounded-3xl text-blue
            shadow-sm border border-gray-100 p-4 md:p-6 xl:p-10 transition-all duration-150"
            >
              {tabs.map((tab: any, index: number) => {
                return (
                  <button
                    key={index}
                    className="text-sm font-medium text-blue cursor-pointer"
                    onClick={() => {
                      setActiveTab(index);
                      handleMenuOpen();
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white/40 rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <TabPanel>
            <AllTab />
          </TabPanel>
          <TabPanel>
            <ConvertToPdf />
          </TabPanel>
          <TabPanel>
            <ConvertFromPdf />
          </TabPanel>
          <TabPanel>
            <OrganizedPdf />
          </TabPanel>
          <TabPanel>
            <EditPdfLayout />
          </TabPanel>
          <TabPanel>
            <OtherConversion />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};

export default ConvertTabs;
