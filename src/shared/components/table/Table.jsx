import React, { useMemo, useState } from 'react';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 10;

const Table = ({ columns = [], rows = [], loading = false, error = null }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.ceil(rows.length / ITEMS_PER_PAGE), [rows]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return rows.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, rows]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
  <div className="bg-light-surface dark:bg-dark-surface p-3 sm:p-4 rounded-lg w-full">
      {loading ? (
        <p className="text-light-muted dark:text-dark-muted">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-primary text-left">
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="p-2 sm:p-3 border border-light-border dark:border-dark-border text-light-text dark:text-dark-text text-xs sm:text-sm md:text-base whitespace-nowrap"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background transition"
                    >
                      {columns.map((col, colIdx) => (
                        <td
                          key={colIdx}
                          className="p-2 sm:p-3 border border-light-border dark:border-dark-border text-xs sm:text-sm md:text-base break-words text-light-text dark:text-dark-text"
                        >
                          {col.render ? col.render(row) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center text-light-muted dark:text-dark-muted p-4 text-sm sm:text-base"
                    >
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Show pagination only if more than 10 rows */}
          {rows.length > ITEMS_PER_PAGE && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </div>
          )}
        </>
      )}
    </div>

  );
};

export default Table;
