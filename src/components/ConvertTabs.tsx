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

  const handleMenuOpen = () => setMenuOpen(!menuOpen);

  const tabs = [
    "All",
    "Convert to PDF",
    "Convert from PDF",
    "Organized PDFs",
    "Edit PDF",
    "Other Options",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
        <div className="hidden lg:flex justify-center mb-10">
          <TabList
            className="flex md:flex-row flex-row justify-between 
          sm:bg-white bg-transparent md:w-auto w-full  sm:rounded-full shadow-lg sm:p-2 p-4"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className={`
                  cursor-pointer px-4 sm:py-3 py-2 rounded-full text-center
                  outline-none transition-all duration-200
                  ${
                    activeTab === index
                      ? "text-text-heading font-bold underline underline-offset-8 decoration-text-muted"
                      : "text-text-body font-semibold"
                  }
                `}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
        </div>

        <div className="sm:block lg:hidden mb-4 relative z-40">
          <div
            onClick={handleMenuOpen}
            className={`bg-white/40 rounded-3xl shadow-sm border border-border cursor-pointer
              py-4 px-6 flex items-center justify-between w-full`}
          >
            <span
              className={`text-sm md:text-md xl:text-lg cursor-pointer font-medium ${
                activeTab
                  ? "text-text-heading font-bold"
                  : "text-text-body font-medium"
              }`}
            >
              {tabs[activeTab]}
            </span>
            <FaChevronDown className={`${menuOpen ? "rotate-180" : ""}`} />
          </div>

          {menuOpen && (
            <div
              className="flex flex-col gap-4 w-full mt-4 bg-white/30 rounded-3xl text-text-body
              shadow-sm border border-border p-4 md:p-6 xl:p-10 transition-all duration-150"
            >
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className="text-sm font-medium text-text-body cursor-pointer"
                  onClick={() => {
                    setActiveTab(index);
                    handleMenuOpen();
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-bg-card rounded-3xl shadow-card border border-border p-6 sm:p-10">
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
