import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ActiveTasks from './Tabs/ActiveTasks';
import ResaleReports from './Tabs/ResaleReports';
import {
  generateReport,
  generateResaleNocReports,
  getInteractionList,
  getUnits,
} from '../../api/modules/Swiftsync.class';
import Loader from '../../common/Loader';
import Select, { ActionMeta } from 'react-select';
import CustomMenuList from '../Interaction Form/units/CustomMenuList';
import * as XLSX from 'xlsx';

// Styles for react-select components
const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: '#ccc',
    padding: '6px 8px',
    fontSize: '14px',
    fontWeight: '400',
    color: '#1C1C1C',
    '&:hover': {
      borderColor: '#B2282F',
    },
    '&:focus': {
      borderColor: '#B2282F',
    },
  }),
  menu: (provided) => ({
    ...provided,
    fontSize: '14px',
    fontWeight: '400',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#B2282F' : 'white',
    color: state.isSelected ? 'white' : '#1C1C1C',
    '&:hover': {
      backgroundColor: 'grey',
    },
  }),
};

// Interaction type options
const typeOfInteraction = [
  { value: 'Walk-in', label: 'Walk-in' },
  { value: 'Site Visit', label: 'Site Visit' },
  { value: 'Telecom – Inbound', label: 'Telecom – Inbound' },
  { value: 'Telecom – Outbound', label: 'Telecom – Outbound' },
  { value: 'Email', label: 'Email' },
  { value: 'Notice of Violation (NOV)', label: 'Notice of Violation (NOV)' },
  {
    value: 'Referred by Other Department',
    label: 'Referred by Other Department',
  },
];

interface Option {
  value: string;
  label: string;
}

const Reports = () => {
  // Data states
  const [allInteractionsData, setAllInteractionsData] = useState<any[]>([]);
  const [allReportsData, setAllReportsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter and pagination states
  const [interactionTypes, setInteractionTypes] = useState<any[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'interactions' | 'reports'>('interactions');
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);


  const [filters, setFilters] = useState({
    interactionType: null as Option | null,
    customerName: '',
    unitNumber: null as Option | null,
    typeOfInteraction: null as Option | null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get current data based on active tab
  const currentData = useMemo(() => {
    return activeTab === 'interactions' ? allInteractionsData : allReportsData;
  }, [activeTab, allInteractionsData, allReportsData]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return  currentData ? currentData?.slice(startIndex, startIndex + rowsPerPage): '';
  }, [currentData, currentPage, rowsPerPage]);

  // Calculate totals
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  // Fetch data with current filters
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const commonParams = {
        interactionType: filters.interactionType?.value || '',
        customerName: filters.customerName || '',
        unitNumber: filters.unitNumber?.value || '',
        typeOfInteraction: filters.typeOfInteraction?.value || '',
        page: currentPage,
        pageSize: 100,
      };

      let response;
      if (activeTab === 'interactions') {
        response = await generateReport(commonParams);
        setAllInteractionsData(response || []);
      } else {
        response = await generateResaleNocReports(commonParams);
        setAllReportsData(response || []);
      }

      // Reset to first page when data changes
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  // Handle filter application
  const handleFilter = () => {
    fetchData();
  };

  // Handle tab change
  const handleTabChange = (tab: 'interactions' | 'reports') => {
    setActiveTab(tab);
    setFilters({
      interactionType: null,
      customerName: '',
      unitNumber: null,
      typeOfInteraction: null,
    });
  };

  // Export to Excel
  const exportToExcel = async () => {
    try {
      setLoading(true);

      if (currentData.length === 0) {
        alert('No data to export');
        return;
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(
        activeTab === 'interactions'
          ? currentData?.map((task) => ({
              Date: task.date,
              'Customer Type': task.customerType,
              'Type Selected': task.typeSel,
              'Unit Number': task.unitNumber,
              'Project Name': task.projectName,
              Name: task.customerName,
              'Email Address': task.emailAddress,
              'Contact Number': task.contactNumber,
              'Type of Interaction': task.typeOfInteraction,
              'Purpose of Interaction': task.purposeOfInteraction,
              'Follow-up Date': task.followUpDate,
              Remarks: task.remarks,
            }))
          : currentData?.map((report) => ({
              
              'Customer Name': report.customername,
              'Unit Number': report.unitno,              
              'Project Name': report.projectname,    
              'Intiator Name': report.intiatorname,
              'Contact Number': report.contactno,
              'Master Community': report.mastercomm,
              'Email': report.email,
            }))
      );

      const fileName = activeTab === 'interactions' 
        ? 'interactions_report.xlsx' 
        : 'resale_reports.xlsx';
      const sheetName = activeTab === 'interactions' 
        ? 'Interactions' 
        : 'Resale Reports';

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = useCallback(
    async (append = true) => {
      try {
        const response = await getUnits({ searchTerm, page, pageSize });
        if (!response.statusText === 'OK') {
          throw new Error('Network response was not ok');
        }
        const newData = await response.data;
  
        if (!newData || newData.length === 0) {
          setHasMoreData(false);
          return;
        }
  
        const newOptions = newData.map((unit) => ({
          value: `${unit.slno}-${unit.sapno}`,
          label: `${unit.slno} - ${unit.sapno}`,
        }));
  
        setOptions((prevOptions) =>
          append ? [...prevOptions, ...newOptions] : newOptions
        );
        setPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error('Failed to fetch units:', error);
      }
    },
    [page, pageSize, searchTerm]
  );

  // Handle filter changes
  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle input change for unit search
  const handleInputChange = (
    inputValue: string,
    actionMeta: ActionMeta<Option>
  ) => {
    if (actionMeta.action === 'input-change') {
      setSearchTerm(inputValue);
    }
    return inputValue;
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Render page numbers for pagination
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

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

    // Show ellipsis if current page is beyond the first set
    if (currentPage > maxVisiblePages - 1) {
      pages.push(
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    // Calculate range of pages to show around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if we're near the start or end
    if (currentPage <= maxVisiblePages - 1) {
      startPage = 2;
      endPage = Math.min(maxVisiblePages, totalPages - 1);
    } else if (currentPage >= totalPages - (maxVisiblePages - 2)) {
      startPage = totalPages - (maxVisiblePages - 1);
      endPage = totalPages - 1;
    }

    // Add the calculated pages
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

    // Show ellipsis if current page is before the last set
    if (currentPage < totalPages - (maxVisiblePages - 2)) {
      pages.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
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
    }

    return pages;
  };

  // Initial data fetch and interaction types
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await fetchData();
        
        // Fetch interaction types if not already loaded
        if (interactionTypes.length === 0) {
          const resp = await getInteractionList();
          setInteractionTypes(resp?.data || []);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [activeTab]);

  useEffect(() => {
    setPage(1);
    setOptions([]);
    setHasMoreData(true);
  }, [searchTerm]);
  useEffect(() => {
    if (page === 1 && hasMoreData) {
      fetchOptions(false);
    }
  }, [page, hasMoreData, fetchOptions]);

  return loading ? (
    <Loader />
  ) : (
    <div className="ml-12 bg-white p-[18px] lg:ml-0 lg:p-[24px]">
      {/* Tab selector */}
      <div className="flex bg-[#F2F2F2] p-[8px]">
        <button
          className={`flex flex-1 items-center justify-center px-[10px] py-[6px] text-sm md:px-[36px] md:py-[10px] ${
            activeTab === 'interactions'
              ? 'bg-[#B2282F] text-white'
              : 'bg-[#F2F2F2] text-black'
          }`}
          onClick={() => handleTabChange('interactions')}
        >
          Interactions
        </button>
        <button
          className={`flex flex-1 items-center justify-center px-[10px] py-[6px] text-sm md:px-[36px] md:py-[10px] ${
            activeTab === 'reports'
              ? 'bg-[#B2282F] text-white'
              : 'bg-[#F2F2F2] text-black'
          }`}
          onClick={() => handleTabChange('reports')}
        >
          Resale Noc
        </button>
      </div>

      {/* Header with title and export button */}
      <div className="mb-3 mt-3 flex justify-between">
        <h1 className="mb-4 font-bold text-[#1C1C1C]">
          {activeTab === 'interactions' ? 'All Interactions' : 'Resale Noc'}
        </h1>
        <div className="pr-1 sm:pr-10">
          <button
            className="flex items-center gap-2 rounded bg-[#B2282F] px-4 py-3 text-white"
            onClick={exportToExcel}
            disabled={currentData?.length === 0 || loading}
          >
            {loading ? (
              'Exporting...'
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export to Excel
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="mb-4 flex flex-wrap justify-center gap-4 sm:justify-start">
        {/* Interaction-specific filters */}
        {activeTab === 'interactions' && (
          <>
            <Select
              placeholder="Purpose of Interaction"
              isClearable
              styles={customStyles}
              options={interactionTypes?.map((type: { name: string }) => ({
                value: type.name,
                label: type.name,
              }))}
              value={filters.interactionType}
              onChange={(value) => handleFilterChange('interactionType', value)}
            />
            <Select
              placeholder="Interaction Type"
              className="w-52"
              isClearable
              styles={customStyles}
              options={typeOfInteraction}
              value={filters.typeOfInteraction}
              onChange={(value) => handleFilterChange('typeOfInteraction', value)}
            />
          </>
        )}

        {/* Common filters */}
        <input
          type="text"
          className="h-12 w-52 rounded border px-2"
          placeholder="Customer Name"
          value={filters.customerName}
          onChange={(e) => handleFilterChange('customerName', e.target.value)}
        />

        <Select
          name="unitNumber"
          className="w-72"
          value={filters.unitNumber}
          onChange={(value) => handleFilterChange('unitNumber', value)}
          options={options}
          isClearable
          onInputChange={handleInputChange}
          components={{
            MenuList: (props) => (
              <CustomMenuList
                {...props}
                hasMoreData={false}
                fetchOptions={fetchOptions}
              />
            ),
          }}
          styles={customStyles}
          isSearchable
          placeholder="Search units..."
        />

        <button
          className="rounded bg-[#B2282F] px-4 py-2 text-white"
          onClick={handleFilter}
        >
          Apply Filters
        </button>
        <button
          className="rounded border border-[#B2282F] bg-white px-4 py-2 text-[#B2282F]"
          onClick={() => {
            setFilters({
              interactionType: null,
              customerName: '',
              unitNumber: null,
              typeOfInteraction: null,
            });
            fetchData();
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Data display area */}
      <div className="bg-white p-[8px]">
        {/* Render the appropriate tab content */}
        {activeTab === 'interactions' ? (
          <ActiveTasks displayedRows={paginatedData} />
        ) : (
          <ResaleReports displayedRows={paginatedData} />
        )}

        {/* Pagination controls */}
        <div className="flex items-center justify-between gap-4 bg-white pt-4">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex items-center justify-start gap-1 md:gap-4">
              <span>Rows</span>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="rounded-md border-[1px] border-[#333B48] bg-white py-1 px-1 text-[#1C1C1C] md:px-2.5"
              >
                {[5, 10, 20, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span>
                Showing{' '}
                {Math.min((currentPage - 1) * rowsPerPage + 1, totalItems)}-
                {Math.min(currentPage * rowsPerPage, totalItems)} of{' '}
                {totalItems}
              </span>
            </div>

            <nav aria-label="Pagination" className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded px-1.5 py-1 text-[#333B48] disabled:opacity-50 md:px-3 md:py-2"
              >
                &lt;
              </button>

              <div className="hidden items-center space-x-1 md:flex">
                {renderPageNumbers()}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalItems === 0}
                className="rounded px-1.5 py-1 text-[#333B48] disabled:opacity-50 md:px-3 md:py-2"
              >
                &gt;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;