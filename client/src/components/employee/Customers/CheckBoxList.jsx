import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";

const CheckBoxListPage = ({ selectedCustomer, handleClose }) => {
  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pdfContent, setPdfContent] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [email, setEmail] = useState(selectedCustomer.email || '');
  const [phoneNumber, setPhoneNumber] = useState(selectedCustomer.whatsappNumber || '');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Fetch names from the database
    axios.get('http://localhost:3000/api/names')
      .then((response) => {
        setNames(response.data);
        filterNames(response.data); // Initial filter based on babyGender and preferredStartingLetter
      })
      .catch((error) => console.error('Error fetching names:', error));
  }, [selectedCustomer.babyGender, selectedCustomer.preferredStartingLetter]);

  const filterNames = (allNames) => {
    // Filter by babyGender and preferredStartingLetter
    const filtered = allNames.filter(
      item =>
        item.gender === selectedCustomer.babyGender &&
        item.name.startsWith(selectedCustomer.preferredStartingLetter)
    );

    setFilteredNames(filtered);
    setCurrentPage(1); // Reset to page 1 after filtering
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
      alert('No items selected!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/create-pdf', {
        names: selectedItems.map(item => ({
          name: item.name,
          meaning: item.meaning
        })),
        customerId: selectedCustomer._id,
      });

      setPdfContent(response.data.base64Pdf);
      setUniqueId(response.data.uniqueId);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF.');
    }
  };

  const handleDownload = () => {
    if (!pdfContent) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdfContent}`;
    link.download = `${uniqueId}.pdf`;
    link.click();
  };

  const handleSendMail = async () => {
    if (!email || !pdfContent) {
      alert('Provide a valid email and ensure the PDF is generated.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/send-pdf-email', { email, base64Pdf: pdfContent, uniqueId });
      alert('PDF sent to email');
    } catch (error) {
      console.error('Error sending PDF to email', error);
      alert('Error sending email');
    }
  };

  const handleSendWhatsApp = async () => {
    if (!phoneNumber || !pdfContent || !uniqueId) {
      alert('Provide a valid phone number and ensure the PDF is generated.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/send-pdf-whatsapp', { phoneNumber, base64Pdf: pdfContent, uniqueId });
      alert('PDF sent to WhatsApp');
    } catch (error) {
      console.error('Error sending PDF via WhatsApp', error);
      alert('Error sending WhatsApp message');
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNames = filteredNames.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredNames.length / itemsPerPage);

  return (
    <div className="bg-white w-full dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-10">Select Names for PDF</h2>

      {/* Table of filtered names with checkboxes */}
      <div className="overflow-y-auto max-h-96 mb-4">
        <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-black dark:bg-gray-900">
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-white">Select</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-white">Book Name</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-white">Gender</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-white">Name</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-white">Meaning</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-white">Name In Hindi</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-white">Meaning In Hindi</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-white">Shlok No</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-white">Page No</th>
            </tr>
          </thead>
          <tbody>
            {paginatedNames.map((item) => (
              <tr key={item._id}>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item)}
                    onChange={() => handleItemSelection(item)}
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.bookName}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.gender}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.meaning}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.nameInHindi}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.meaningInHindi}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.shlokNo}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.pageNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center mb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <span className="text-black dark:text-white mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      <div className="flex justify-between my-10">
        <button onClick={handleGeneratePdf} className="bg-blue-500 text-white px-4 py-2 rounded">Generate PDF</button>

        {pdfContent && (
          <>
            <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">Download PDF</button>
            <button onClick={handleSendMail} className="bg-red-500 text-white px-4 py-2 rounded">Send PDF via Email</button>
            <button onClick={handleSendWhatsApp} className="bg-yellow-500 text-white px-4 py-2 rounded">Send PDF via WhatsApp</button>
          </>
        )}
        <button onClick={handleClose} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default CheckBoxListPage;
