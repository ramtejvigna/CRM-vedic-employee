import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Edit, Trash, MessageCircle, Share2, Check, X } from "lucide-react";
import { useStore } from "../../../store";

const CheckBoxListPage = () => {
  const { isDarkMode, toggleDarkMode } = useStore();

  const location = useLocation();
  const { customerData } = location.state || {};
  const [email, setEmail] = useState(customerData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    customerData?.whatsappNumber || ""
  );

  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pdfContent, setPdfContent] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const itemsPerPage = 20;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch names from the database
    axios
      .get("http://localhost:3000/api/names")
      .then((response) => {
        setNames(response.data);
        filterNames(response.data);
        setIsLoading(false) // Initial filter based on babyGender and preferredStartingLetter
      })
      .catch((error) => console.error("Error fetching names:", error));
  }, [customerData?.babyGender, customerData?.preferredStartingLetter]);

  const filterNames = (allNames) => {
    if (!customerData?.babyGender || !customerData?.preferredStartingLetter) {
      setFilteredNames([]);
      return;
    }
    const filtered = allNames.filter(
      (item) =>
        item.gender === customerData.babyGender &&
        item.name.startsWith(customerData.preferredStartingLetter)
    );
    setFilteredNames(filtered);
    setCurrentPage(1);
  };

  const handleClose = () => {
    // You can use history or navigate depending on the version of React Router you're using
    window.history.back(); // Go back to the previous page
  };

  const handleItemSelection = (item) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(item)) {
        return prevSelected.filter((i) => i !== item);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleGeneratePdf = async () => {
    if (selectedItems.length === 0) {
      alert("No items selected!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/create-pdf",
        {
          names: selectedItems.map((item) => ({
            name: item.name,
            meaning: item.meaning,
          })),
          customerId: customerData._id,
        }
      );

      setPdfContent(response.data.base64Pdf);
      setUniqueId(response.data.uniqueId);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF.");
    }
  };

  const handleDownload = () => {
    if (!pdfContent) return;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${pdfContent}`;
    link.download = `${uniqueId}.pdf`;
    link.click();
  };

  const handleSendMail = async () => {
    if (!email || !pdfContent) {
      alert("Provide a valid email and ensure the PDF is generated.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/send-pdf-email", {
        email,
        base64Pdf: pdfContent,
        uniqueId,
      });
      alert("PDF sent to email");
    } catch (error) {
      console.error("Error sending PDF to email", error);
      alert("Error sending email");
    }
  };

  const handleSendWhatsApp = async () => {
    if (!phoneNumber || !pdfContent || !uniqueId) {
      alert("Provide a valid phone number and ensure the PDF is generated.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/send-pdf-whatsapp", {
        phoneNumber,
        base64Pdf: pdfContent,
        uniqueId,
      });
      alert("PDF sent to WhatsApp");
    } catch (error) {
      console.error("Error sending PDF via WhatsApp", error);
      alert("Error sending WhatsApp message");
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNames =
    filteredNames.slice(startIndex, startIndex + itemsPerPage) || [];
  const totalPages = Math.ceil(filteredNames.length / itemsPerPage) || 1;

  return (
    <div className={`bg-white w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} text-black ${isDarkMode ? 'text-white' : 'text-black'} p-6 rounded-lg shadow-lg`}>
      <h1 className="text-3xl font-bold mb-5">Select Names For PDF</h1>
     
      {/* Table of filtered names with checkboxes */}
      <div className="overflow-y-auto max-h-96 mb-4">
      {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
        <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Book Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Meaning
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Name In Hindi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Meaning In Hindi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Shlok No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Page No
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {paginatedNames.map((item) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleItemSelection(item)}
                      className="text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {item.bookName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {item.gender}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {item.meaning}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {item.nameInHindi}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {item.meaningInHindi}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {item.shlokNo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {item.pageNo}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
          )
        }
      </div>
      
      {/* Pagination controls */}
      <div className="flex justify-center items-center mb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="text-black dark:text-white mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
            isDarkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-300 bg-white"
          } text-sm font-medium text-gray-500 hover:bg-gray-50`}
        >
          Next
        </button>
      </div>

      <div className="flex justify-between my-10">
        <button
          onClick={handleGeneratePdf}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate PDF
        </button>

        {pdfContent && (
          <>
            <button
              onClick={() => setShowPreview(true)}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Preview PDF
            </button>
            <button
              onClick={() => setShowShareOptions(true)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Share
            </button>
          </>
        )}
        <button
          onClick={handleClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPreview && (
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
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  PDF Preview
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                >
                  <X size={24} />
                </button>
              </div>
              <embed
                src={`data:application/pdf;base64,${pdfContent}`}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Options Modal */}
      <AnimatePresence>
        {showShareOptions && (
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
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-[400px]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Share PDF
                </h2>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex justify-center mt-2 items-center flex-col space-y-5">
                <button
                  onClick={handleSendMail}
                  className="flex items-center w-[200px] bg-red-500 text-white px-2 py-2 rounded"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Send via Email
                </button>
                <button
                  onClick={handleSendWhatsApp}
                  className="flex items-center  w-[200px] bg-green-500 text-white px-2 py-2 rounded"
                >
                  <Share2 size={20} className="mr-2" />
                  Send via WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckBoxListPage;
