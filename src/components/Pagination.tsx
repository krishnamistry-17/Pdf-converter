type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onNext: () => void;
  onPrevious: () => void;
};

const Pagination = ({
  totalPages,
  currentPage,
  onNext,
  onPrevious,
}: PaginationProps) => {
  return (
    <div className="flex justify-center items-center gap-2 my-3">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
      >
        Previous
      </button>
      <span
        className="text-gray-500 text-sm font-semibold border border-gray-300
       px-4 py-2 rounded-md text-center"
      >
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
      >
        Next
      </button>
    </div>
  );
};
export default Pagination;
