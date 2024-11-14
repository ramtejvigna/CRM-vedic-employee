import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";
import { useStore } from "../../../store";
import { useNavigate } from "react-router-dom";
import CheckBoxListPage from "./CheckBoxList";

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

  const handleClose = () => {
    setShowCheckBoxList(false);
  };

  const renderTable = (customers, fromSection, nextSection) => {
    const validCustomers = Array.isArray(customers) ? customers : [];
    const assignedOrCompletedHeader = fromSection === "completed" ? "Completed On" : "Assigned On";
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="overflow-x-auto"
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
                "Actions"
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
              {validCustomers.length > 0 ? (
                validCustomers.map((customer) => (
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
                        ? new Date(customer.completedOn).toLocaleDateString() 
                        : new Date(customer.assignedOn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            navigate('viewDetailsIn', {
                              state: {
                                customerData: customer,
                                fromSection: fromSection,
                                section: nextSection,
                              }
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
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                    No customers available in this section
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
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
              className={`relative px-4 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out ${
                activeTab === tab
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