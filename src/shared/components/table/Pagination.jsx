// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-4">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-3 sm:px-4 py-2 rounded text-xs sm:text-sm bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-primary/90"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">«</span>
      </button>

      <span className="text-light-text dark:text-dark-text text-xs sm:text-sm whitespace-nowrap">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 sm:px-4 py-2 rounded text-xs sm:text-sm bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-primary/90"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">»</span>
      </button>
    </div>
  );
};

export default Pagination;
