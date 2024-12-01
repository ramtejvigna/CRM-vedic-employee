import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../../../store";
import { useNavigate } from "react-router-dom";
import EmptyState from "./EmptyState";
import CheckBoxListPage from "./CheckBoxList";

const formatDateTime = (dateString) => {
  if (!dateString) return "No Date";
  
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  
  // Add leading zero to minutes if needed
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${month}${day}, ${year} ${hours}:${formattedMinutes} ${ampm}`;
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  </div>
);

export const Customers = () => {
  const [customerData, setCustomerData] = useState({
    assignedCustomers: [],
    completed: []
  });
  const [activeTab, setActiveTab] = useState("assignedCustomers");
  const [showCheckBoxList, setShowCheckBoxList] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { isDarkMode } = useStore();
  const navigate = useNavigate();
  const employeeId = Cookies.get("employeeId");

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!employeeId) {
        console.error("Employee ID not found in cookies");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://vedic-backend-neon.vercel.app/customers/employees/${employeeId}/customers`
        );

        const formattedData = {
          assignedCustomers: Array.isArray(response.data.assignedCustomers)
            ? response.data.assignedCustomers
            : [],
          completed: Array.isArray(response.data.completed)
            ? response.data.completed
            : []
        };

        setCustomerData(formattedData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setCustomerData({ assignedCustomers: [], completed: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [employeeId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, activeTab]);

  const handleClose = () => {
    setShowCheckBoxList(false);
  };

  const getPaginatedData = (customers) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return customers.slice(startIndex, endIndex);
  };

  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const endIndex = Math.min(currentPage * rowsPerPage, totalItems);
  
    // Calculate which page numbers to show
    const getPageNumbers = () => {
      const pageNumbers = [];
      const showPages = 5; // Number of page buttons to show
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + showPages - 1);
  
      // Adjust start if we're near the end
      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }
  
      // Add first page if not included
      if (start > 1) {
        pageNumbers.push(1);
        if (start > 2) pageNumbers.push('...');
      }
  
      // Add page numbers
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
  
      // Add last page if not included
      if (end < totalPages) {
        if (end < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
  
      return pageNumbers;
    };
  
    return (
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Max. Rows per page:
          </span>
          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="block w-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300"
            >
              {[5, 10, 25, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {`${startIndex}-${endIndex} of ${totalItems}`}
          </span>
  
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
            >
              <ChevronLeft
                className={`w-5 h-5 ${
                  currentPage === 1 
                    ? 'text-gray-400 dark:text-gray-600' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              />
            </button>
  
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pageNumber, index) => (
                <React.Fragment key={index}>
                  {pageNumber === '...' ? (
                    <span className="px-2 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`min-w-[32px] h-8 px-2 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out
                        ${currentPage === pageNumber
                          ? 'bg-blue-500 bg-opacity-90 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
  
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
            >
              <ChevronRight
                className={`w-5 h-5 ${
                  currentPage === totalPages 
                    ? 'text-gray-400 dark:text-gray-600' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTable = (customers, fromSection, nextSection) => {
    const validCustomers = Array.isArray(customers) ? [...customers] : [];

    // Updated sorting logic to handle both sections
    if (fromSection === "assignedCustomers") {
      validCustomers.sort((a, b) => {
        const deadlineA = new Date(a.deadline);
        const deadlineB = new Date(b.deadline);

        if (!a.deadline) return 1;
        if (!b.deadline) return -1;

        return deadlineA - deadlineB;
      });
    } else if (fromSection === "completed") {
      validCustomers.sort((a, b) => {
        const completedOnA = new Date(a.completedOn);
        const completedOnB = new Date(b.completedOn);

        // Sort in descending order (most recent first)
        return completedOnB - completedOnA;
      });
    }

    const paginatedCustomers = getPaginatedData(validCustomers);
    const assignedOrCompletedHeader =
      fromSection === "completed" ? "Completed On" : "Assigned On";

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {[
                  "Customer ID",
                  "Customer Name",
                  "Whatsapp number",
                  "Baby Gender",
                  assignedOrCompletedHeader,
                  ...(fromSection === "assignedCustomers" ? ["Deadline"] : []),
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence mode="wait" initial={false}>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
                    <motion.tr
                      key={customer._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {customer.customerID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {customer.customerName ? customer.customerName : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {customer.whatsappNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {customer.babyGender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {fromSection === "completed"
                          ? formatDateTime(customer.completedOn)
                          : formatDateTime(customer.assignedOn)}
                      </td>
                      {fromSection === "assignedCustomers" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {formatDateTime(customer.deadline)}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              navigate("viewDetailsIn", {
                                state: {
                                  customerData: customer,
                                  fromSection: fromSection,
                                  section: nextSection,
                                },
                              });
                            }}
                          >
                            <Eye size={20} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center p-4 py-8 text-gray-500 dark:text-gray-300"
                      >
                        <EmptyState />
                      </motion.div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>

        {paginatedCustomers.length > 0 && renderPagination(validCustomers.length)}
      </>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    const customers = customerData[activeTab] || [];
    const nextSection = activeTab === "assignedCustomers" ? "completed" : "assignedCustomers";

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTable(customers, activeTab, nextSection)}
        </motion.div>
      </AnimatePresence>
    );
  };

  const assignedCustomersCount = customerData.assignedCustomers?.length || 0;

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${isDarkMode ? "bg-gray-900" : ""}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Customer Management
        </h1>
        <div className="flex p-2 mb-6 justify-center space-x-2 overflow-x-auto">
          {["assignedCustomers", "completed"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out ${activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1")}
              {tab === "assignedCustomers" && assignedCustomersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white p-1 px-2 rounded-full">
                  {assignedCustomersCount}
                </span>
              )}
            </motion.button>
          ))}
        </div>
        {renderContent()}
      </div>

      {showCheckBoxList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
          >
            <CheckBoxListPage
              selectedCustomer={selectedCustomer}
              handleClose={handleClose}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Customers;