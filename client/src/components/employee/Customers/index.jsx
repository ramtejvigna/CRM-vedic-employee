import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check, X } from "lucide-react";
import { useStore } from "../../../store"; // Assuming you have a store for dark mode
import { useNavigate } from "react-router-dom";
import CheckBoxListPage from "./CheckBoxList";

export const Customers = () => {
  const [customerData, setCustomerData] = useState({});
  const [activeTab, setActiveTab] = useState("assignedCustomers");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [nextSection, setNextSection] = useState("");
  const [details, setDetails] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showCheckBoxList, setShowCheckBoxList] = useState(false);
  const { isDarkMode } = useStore();
  const navigate = useNavigate();

  const employeeId = Cookies.get("employeeId");

  useEffect(() => {
    if (employeeId) {
      axios
        .get(`http://localhost:8000/customers/employees/${employeeId}/customers`)
        .then((response) => setCustomerData(response.data))
        .catch((error) =>
          console.error("Error fetching customer data:", error)
        );
    } else {
      console.error("Employee ID not found in cookies");
    }
  }, [employeeId]);

  const handleGeneratePdfClick = (customer) => {
    setSelectedCustomer(customer);
    setShowCheckBoxList(true);
  };

  const handleClose = () => {
    setShowCheckBoxList(false);
  };

  const moveCustomer = (customer, fromSection, toSection, details) => {
    const updatedCustomer = { ...customer, additionalDetails: details };

    if (toSection === "completed") {
      updatedCustomer.feedback = feedback;
      updatedCustomer.customerStatus = "completed";
    }

    setCustomerData((prevData) => ({
      ...prevData,
      [fromSection]: prevData[fromSection].filter(
        (c) => c._id !== customer._id
      ),
      [toSection]: [...prevData[toSection], updatedCustomer],
    }));

    axios
      .put(`https://vedic-backend-neon.vercel.app/customers/${customer._id}`, updatedCustomer)
      .catch((error) => console.error("Error moving customer:", error));
  };

  const handleAccept = useCallback(() => {
    if (selectedCustomer) {
      moveCustomer(selectedCustomer, activeTab, nextSection, details);
      setShowModal(false);
    }
  }, [selectedCustomer, nextSection, details, activeTab]);

  const renderTable = (customers, fromSection, nextSection) => (
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
              "Father Name",
              "Mother Name",
              "Whatsapp number",
              "Baby Gender",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {customers.map((customer) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {customer.fatherName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {customer.motherName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {customer.whatsappNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {customer.babyGender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {fromSection === "assignedCustomers" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setNextSection(nextSection);
                          setShowModal(true);
                        }}
                      >
                        <Check size={20} />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setNextSection(nextSection);
                        navigate('viewDetailsIn', {
                          state: {
                            customerData: customer, // Pass customer data
                            fromSection: fromSection, // Pass current section
                            section: nextSection    // Pass section info
                          }
                        });
                      }}
                    >
                      <Eye size={20} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
      {customers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 py-8 text-gray-500 dark:text-gray-300"
        >
          <p className="text-xl">No customers available in this section</p>
        </motion.div>
      )}
    </motion.div>
  );

  const renderContent = () => {
    const filteredCustomers = Array.isArray(customerData[activeTab])
      ? customerData[activeTab]
      : [];
    switch (activeTab) {
      case "assignedCustomers":
        return renderTable(filteredCustomers, "assignedCustomers", "completed");
      case "completed":
        return renderTable(filteredCustomers, "completed", "assignedCustomers");
      default:
        return null;
    }
  };

  const assignedCustomersCount = Array.isArray(customerData["assignedCustomers"])
    ? customerData["assignedCustomers"].length
    : 0;

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${isDarkMode ? "bg-gray-900" : ""
        }`}
    >
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
              {tab.charAt(0).toUpperCase() +
                tab.slice(1).replace(/([A-Z])/g, " $1")}
              {tab === "assignedCustomers" && assignedCustomersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white p-1 px-2 rounded-full">
                  {assignedCustomersCount}
                </span>
              )}
            </motion.button>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        >
          {renderContent()}
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Payment Details
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedCustomer?.email}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Payment Date & Time:{" "}
                  {new Date(selectedCustomer?.paymentDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}{" "}
                  - {selectedCustomer?.paymentTime}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Preferred God : {selectedCustomer?.preferredGod}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  PDF's Generated - {selectedCustomer?.pdfGenerated}
                </p>
                <label className="block my-2 mt-4 text-gray-600 dark:text-gray-300">
                  Feedback
                </label>
                <textarea
                  onChange={(e) => setFeedback(e.target.value)}
                  className="border border-gray-300 h-20 rounded-xl p-2 mb-4 w-full resize-none dark:bg-gray-700 dark:text-white"
                />
                <button
                  className="p-2 px-4 bg-blue-500 text-white rounded-lg"
                  onClick={() => {
                    setSelectedCustomer(selectedCustomer);
                    setShowCheckBoxList(true);
                  }}
                >
                  Generate PDF
                </button>
              </div>
              <div className="mt-10">
                <button
                  onClick={handleAccept}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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