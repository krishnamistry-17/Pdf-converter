
interface PdfLayoutProps {
  isMobile: boolean;
  isSidebarVisible: boolean;
  results: any[];
  main: React.ReactNode;
  sidebar?: React.ReactNode;
}

const PdfLayout = ({
  isMobile,
  isSidebarVisible,
  results,
  main,
  sidebar,
}: PdfLayoutProps) => {
  return (
    <div className="relative lg:flex flex-col px-4 lg:py-12 py-6">
      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 
          ${!isMobile && isSidebarVisible ? "lg:mr-[380px]" : ""}
        `}
      >
        <div
          className={`mx-auto ${
            results.length > 0 ? "max-w-xl w-auto" : "max-w-xl"
          }`}
        >
          {main}
        </div>
      </div>

      {/* Sidebar */}
      {!isMobile && isSidebarVisible && sidebar && (
        <aside className="fixed top-0 right-0 h-full w-[380px] bg-bg-card border-l border-border shadow-lg z-50">
          {sidebar}
        </aside>
      )}
    </div>
  );
};

export default PdfLayout;
