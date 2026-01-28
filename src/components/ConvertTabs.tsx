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
        <div className="hidden md:flex justify-center mb-10">
          <TabList
            className="flex md:flex-row flex-row justify-between sm:bg-white bg-transparent sm:w-auto w-full 
            sm:rounded-full shadow-md sm:p-2 p-4 gap-2"
            // style={{ scrollbarWidth: "none" }}
          >
            {tabs.map((tab: any, index: number) => {
              return (
                <Tab
                  key={index}
                  className={`
              cursor-pointer px-6 sm:py-3 py-2 text-lg font-semibold rounded-full text-center 
              transition-all duration-300 outline-none
              ${
                activeTab === index
                  ? "bg-gradient-to-r bg-clip-text text-transparent from-pink-800 via-purple-600 to-red-500 font-semibold "
                  : "text-gray-500 hover:text-gray-900"
              }
            `}
                >
                  {tab}
                </Tab>
              );
            })}
          </TabList>
        </div>
        <div className="sm:block md:hidden  lg:mb-0 mb-4 relative z-40">
          <div
            onClick={() => {
              setActiveTab(activeTab);
              handleMenuOpen();
            }}
            className=" bg-white rounded-3xl shadow-sm border border-gray-100 cursor-pointer
          py-4 px-6 flex items-center justify-between w-full"
          >
            <label
              className={`text-md text-center cursor-pointer
                ${
                  activeTab === activeTab
                    ? "  bg-gradient-to-r bg-clip-text text-transparent from-pink-800 via-purple-500 to-red-500 font-semibold"
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
              className="flex flex-col gap-4 w-full mt-4 bg-white rounded-3xl 
            shadow-sm border border-gray-100 p-4 sm:p-10 transition-all duration-150"
            >
              {tabs.map((tab: any, index: number) => {
                return (
                  <button
                    key={index}
                    className="text-sm font-medium text-gray-500 cursor-pointer"
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

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
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
