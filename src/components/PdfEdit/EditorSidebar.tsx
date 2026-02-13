import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import type { TextBlock } from "../../types/pageResult";

interface EditorSidebarProps {
  handleReset: () => void;
  handleDownload: () => void;
  handleSearch: (query: string) => void;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  searchResults: TextBlock[];
  selectedBlockId: string;
  updateTextBlock: (id: string, text: string) => void;
  clearSearch: () => void;
  setCurrentPage: (page: number) => void;
  currentPageBlocks: TextBlock[];
}
const EditorSidebar = ({
  handleReset,
  handleDownload,
  handleSearch,
  searchQuery,
  currentPage,
  totalPages,
  searchResults,
  selectedBlockId,
  updateTextBlock,
  clearSearch,
  setCurrentPage,
  currentPageBlocks,
}: EditorSidebarProps) => {
  return (
    <div className=" p-6 lg:p-0">
      <div>
        {/* Search Section */}
        <div className="p-4 border-b ">
          <div>
            <button className="absolute top-3 right-5" onClick={handleReset}>
              <IoMdClose />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 mb-3">Search & Edit</h3>
            <button onClick={handleDownload}>
              <FaDownload />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search text..."
              className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Page Navigation */}
        {totalPages > 1 && (
          <div className="p-3 border-b flex items-center justify-between ">
            <button
              onClick={() =>
                setCurrentPage(Math.max(1, currentPage - 1) as number)
              }
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1) as number)
              }
              disabled={currentPage === (totalPages as number)}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Text Blocks List */}
        <div
          className="flex-1 max-h-[calc(100vh-200px)] overflow-y-auto p-4"
          style={{ scrollbarWidth: "thin" }}
        >
          <h4 className="font-medium text-gray-700 mb-3">
            Text Blocks
            {searchQuery && (
              <span className="ml-2 text-sm text-gray-400">(filtered)</span>
            )}
          </h4>
          <div className="space-y-3">
            {(searchQuery ? searchResults : currentPageBlocks)
              .filter((block) => block.text.trim() !== "")
              .map((block) => (
                <div
                  key={block.id}
                  className={`rounded-lg border transition-all ${
                    selectedBlockId === block.id
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="p-3">
                    <textarea
                      value={block.text}
                      onChange={(e) =>
                        updateTextBlock(block.id, e.target.value)
                      }
                      className={`w-full p-2 text-sm border rounded resize-none 
                        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                        outline-none transition-all ${
                          searchQuery &&
                          block.text
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                            ? "bg-blue-100 border-blue-400"
                            : ""
                        }`}
                      rows={Math.max(2, Math.ceil(block.text.length / 40))}
                      placeholder="Edit text..."
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        Page {block.page}
                      </span>
                      {block.text !== block.originalText && (
                        <span className="text-xs text-indigo-600 font-medium">
                          Modified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {searchQuery &&
              searchResults.filter((b) => b.text.trim()).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm">No results found</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
