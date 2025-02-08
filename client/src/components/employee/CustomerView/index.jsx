import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Loader2,
  Users,
  Calendar,
  FileText,
  Check,
  X,
  Edit,
  CircleArrowRight,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";


function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    hasPdf: "all",
    dateRange: {
      startDate: "",
      endDate: "",
    },
  });
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editedNotes, setEditedNotes] = useState({});
  const [isEditingNote, setIsEditingNote] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const employeeId = Cookies.get('employeeId');


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`https://vedic-backend-neon.vercel.app/customers/assigned/${employeeId}`);
        const filteredCustomers = response.data.data.filter(
          (customer) => customer.customerStatus !== 'newRequests' &&
            customer.customerStatus !== 'rejected'
        );
        setCustomers(filteredCustomers);
        setFilteredCustomers(filteredCustomers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [employeeId]);

  useEffect(() => {
    const applyFiltersAndSearch = () => {
      let result = [...customers];

      // Apply search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(
          (customer) =>
            (customer.customerID?.toLowerCase() || "").includes(searchLower) ||
            (customer.customerName?.toLowerCase() || "").includes(searchLower) ||
            (customer.socialMediaId?.toLowerCase() || "").includes(searchLower)
        );
      }

      // Apply status filter
      if (filters.status !== "all") {
        result = result.filter((customer) => customer.customerStatus === filters.status);
      }

      // Apply PDF filter
      if (filters.hasPdf !== "all") {
        result = result.filter((customer) =>
          filters.hasPdf === "yes"
            ? customer.pdfGenerated && customer.pdfGenerated.length > 0
            : !customer.pdfGenerated || customer.pdfGenerated.length === 0
        );
      }

      // Apply date range filter
      if (filters.dateRange.startDate && filters.dateRange.endDate) {
        const startDate = new Date(filters.dateRange.startDate);
        const endDate = new Date(filters.dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);

        result = result.filter((customer) => {
          if (!customer.paymentDate) return false;
          const paymentDate = new Date(customer.paymentDate);
          return paymentDate >= startDate && paymentDate <= endDate;
        });
      }

      setFilteredCustomers(result);
      setTotalPages(Math.ceil(result.length / itemsPerPage));
      setCurrentPage(1); // Reset to first page when filters change
    };

    applyFiltersAndSearch();
  }, [searchTerm, filters, customers, itemsPerPage]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleNoteChange = (e, customerID) => {
    const updatedNotes = e.target.value;
    setEditedNotes((prev) => ({
      ...prev,
      [customerID]: updatedNotes,
    }));
  };

  const handleEditToggle = (customerID, currentNote) => {
    if (!isEditingNote[customerID]) {
      // When entering edit mode, initialize with current note
      setEditedNotes((prev) => ({
        ...prev,
        [customerID]: currentNote || ""
      }));
    }
    setIsEditingNote((prev) => ({ ...prev, [customerID]: !prev[customerID] }));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      status: "all",
      hasPdf: "all",
      dateRange: {
        startDate: "",
        endDate: "",
      },
    });
    setCurrentPage(1);
  };

  const handleUpdateNote = async (customerID) => {
    try {
      const noteToUpdate = editedNotes[customerID] || ""; // Use empty string if note is cleared

      // Make API request to update the note
      await axios.patch(
        `https://vedic-backend-neon.vercel.app/customers/updateNote/${customerID}`,
        { note: noteToUpdate }
      );

      // Update local state
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.customerID === customerID
            ? { ...customer, note: noteToUpdate }
            : customer
        )
      );

      // Clear edited note state
      setEditedNotes((prev) => {
        const newState = { ...prev };
        delete newState[customerID];
        return newState;
      });

      // Exit edit mode
      setIsEditingNote((prev) => ({ ...prev, [customerID]: false }));
    } catch (error) {
      console.error('Error updating note:', error);
      // You might want to add error handling UI here
    }
  };

  const convertToCSV = (data) => {
    // Define headers based on the table columns
    const headers = [
      "Customer ID",
      "Customer Name",
      "Instagram Name",
      "Payment Date",
      "PDFs Count",
      "Status",
      "Note",
    ];

    // Convert headers to CSV string
    let csvContent = headers.join(",") + "\n";

    data.forEach((customer) => {
      const row = [
        customer.customerID || "",
        `"${(customer.customerName || "").replace(/"/g, '""')}"`,
        `"${(customer.socialMediaId || "").replace(/"/g, '""')}"`,
        customer.paymentDate
          ? new Date(customer.paymentDate).toLocaleDateString()
          : "",
        customer.pdfGenerated ? customer.pdfGenerated.length : "0",
        customer.customerStatus || "",
        `"${(customer.note || "").replace(/"/g, '""')}"`,
      ];
      csvContent += row.join(",") + "\n";
    });

    return csvContent;
  };

  const downloadCSV = () => {
    // Use filtered data to match what's being displayed in table
    const csvContent = convertToCSV(filteredCustomers);

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary link element to trigger download
    const link = document.createElement("a");

    // Create the download URL
    const url = window.URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `customers_export_${new Date().toISOString().split("T")[0]}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg m-4 md:m-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">
            Overall Customer View
          </h1>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          {/* Top Actions Row */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Search Bar - Made More Prominent */}
            <div className="flex-grow lg:max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by ID, name, or Instagram handle..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
                             transition-all duration-200 text-gray-800 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Export & Clear Actions */}
            <div className="flex gap-3">
              <button
                onClick={downloadCSV}
                className="px-5 py-3 text-sm font-medium text-white bg-green-600 
                         hover:bg-green-700 rounded-xl transition-colors duration-200
                         flex items-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Export to CSV
              </button>
              <button
                onClick={clearAllFilters}
                className="px-5 py-3 text-sm font-medium text-gray-700 bg-white 
                         hover:bg-gray-50 rounded-xl transition-colors duration-200
                         flex items-center gap-2 border border-gray-200 shadow-sm"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Date Range Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="font-medium text-gray-700">Date Range</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Start Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.startDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            startDate: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg 
                                     text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">End Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.endDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            endDate: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg 
                                     text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                  Customer ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                  Instagram Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                  Payment Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">
                  PDFs
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((customer) => (
                <tr
                  key={customer.customerID}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {customer.customerID}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {customer.customerName || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-blue-500 hover:text-blue-600">
                      {customer.socialMediaId || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {customer.paymentDate
                        ? new Date(customer.paymentDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${customer.pdfGenerated?.length
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      {customer.pdfGenerated ? customer.pdfGenerated.length : 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${customer.customerStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {customer.customerStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {isEditingNote[customer.customerID] ? (
                        // Edit mode - input field
                        <input
                          type="text"
                          value={editedNotes[customer.customerID] || ''} // Ensure it uses empty string when cleared
                          onChange={(e) => handleNoteChange(e, customer.customerID)} // Correct change handling
                          className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                      ) : (
                        // Display mode - static note text
                        <span className="text-gray-700">{customer.note || '-'}</span>
                      )}

                      {/* Edit/Save button */}
                      <button
                        onClick={() =>
                          isEditingNote[customer.customerID]
                            ? handleUpdateNote(customer.customerID) // Save note
                            : handleEditToggle(customer.customerID) // Toggle edit mode
                        }
                        className="px-3 py-1 text-blue-500 rounded-full text-xs hover:text-blue-600 transition-all duration-200"
                      >
                        {isEditingNote[customer.customerID] ? (
                          <CircleArrowRight /> // Save icon
                        ) : (
                          <Edit /> // Edit icon
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No customers found matching your criteria.
            </div>
          )}

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredCustomers.length)} of{" "}
                {filteredCustomers.length} entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1 rounded-lg text-sm ${currentPage === pageNumber
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerTable;
