import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import ActiveTasks from './Tabs/ActiveTasks';
import {
  getContractorList,
} from '../../api/modules/Swiftsync.class';
import Loader from '../../common/Loader';
import Toaster from '../Toast/Toast';
const ContractorList = () => {
  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState({});
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getContractorList({
        page: currentPage,
        pageSize: 20,
        searchTerm: searchTerm,
      });
      if (res?.length > 0) {
        setActiveTasks(res);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  

  const tasksToDisplay = activeTasks;
  const totalPages = Math?.ceil(tasksToDisplay?.length / rowsPerPage);

  const displayedRows = tasksToDisplay?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };
  

  const renderPageNumbers = () => {
    if (totalPages === 1) {
      return (
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`rounded px-[7px] ${
            currentPage === 1 ? 'bg-[#B2282F] text-white' : 'text-[#333B48]'
          }`}
        >
          1
        </button>
      );
    }

    const pages = [];
    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`rounded px-[7px] ${
          currentPage === 1 ? 'bg-[#B2282F] text-white' : 'text-[#333B48]'
        }`}
      >
        1
      </button>
    );

    // Add ellipsis if current page > 4
    if (currentPage > 4) {
      pages.push(
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    // Render pages around the current page
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`rounded px-[7px] ${
            page === currentPage ? 'bg-[#B2282F] text-white' : 'text-[#333B48]'
          }`}
        >
          {page}
        </button>
      );
    }

    // Add ellipsis if current page < totalPages - 3
    if (currentPage < totalPages - 3) {
      pages.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    // Always show last page
    pages.push(
      <button
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        className={`rounded px-[7px] ${
          currentPage === totalPages
            ? 'bg-[#B2282F] text-white'
            : 'text-[#333B48]'
        }`}
      >
        {totalPages}
      </button>
    );

    return pages;
  };
 
  return loading ? (
    <Loader />
  ) : (
    <>
    <Toaster message={message} />
      <div className="ml-12 bg-white p-[18px] lg:ml-0  lg:p-[24px]">
        <h1 className="mb-4 font-bold text-[#1C1C1C]">Contractor List</h1>
      
      </div>
      <div className=" ml-12 bg-white p-[8px]  lg:ml-0">
        <ActiveTasks displayedRows={displayedRows} setMessage={setMessage} fetchTasks={fetchTasks}/>

        <div className="flex items-center justify-between gap-4 bg-white pt-4">
          <div className="flex w-full flex-row  items-center justify-between">
            <div className="flex items-center justify-start gap-1 md:gap-4 ">
              <span>Rows</span>

              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="rounded-md border-[1px] border-[#333B48] bg-white py-1 px-1 text-[#1C1C1C] md:px-2.5"
              >
                {[5, 7, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span>Per Page</span>
            </div>

            {/* Pagination Navigation */}
            <nav
              aria-label="Pagination"
              className="flex items-center space-x-2"
            >
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-1.5 py-1 text-[#333B48] disabled:opacity-50 md:px-3 md:py-2"
              >
                &lt;
              </button>

              {/* Page Numbers */}
              <div className="flex  hidden items-center  space-x-1 md:block">
                {renderPageNumbers()}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-1.5 py-1 text-[#333B48] disabled:opacity-50 md:px-3 md:py-2"
              >
                &gt;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContractorList;
