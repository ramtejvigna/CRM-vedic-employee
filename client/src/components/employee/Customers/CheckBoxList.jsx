import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from 'react-router-dom';
import { FaDownload, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const CheckBoxListPage = () => {
  const location = useLocation();
  const { customerData } = location.state || {};
  const [email, setEmail] = useState(customerData?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(customerData?.whatsappNumber || '');


  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pdfContent, setPdfContent] = useState('');
  const [uniqueId, setUniqueId] = useState('');
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
  }, [customerData.babyGender, customerData.preferredStartingLetter]);

  const filterNames = (allNames) => {
    if (!customerData?.babyGender || !customerData?.preferredStartingLetter) {
      setFilteredNames([]);
      return;
    }
    const filtered = allNames.filter(
      item =>
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
      alert('No items selected!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/create-pdf', {
        names: selectedItems.map(item => ({
          name: item.name,
          meaning: item.meaning
        })),
        customerId: customerData._id,
      });

      setPdfContent(response.data.base64Pdf);
      setUniqueId(response.data.uniqueId);

      const binaryString = window.atob(response.data.base64Pdf);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);

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
  const paginatedNames = filteredNames.slice(startIndex, startIndex + itemsPerPage) || [];
  const totalPages = Math.ceil(filteredNames.length / itemsPerPage) || 1;

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Customer Details</h1>
          <div className="flex items-center space-x-4">
          </div>
        </div>

      <div className="overflow-x-auto max-h-96 mb-4 rounded-lg shadow-lg">
  <table className="min-w-full table-auto border-collapse bg-white rounded-lg">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Select</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Book Name</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Gender</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Meaning</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name In Hindi</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Meaning In Hindi</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Shlok No</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Page No</th>
      </tr>
    </thead>
    <tbody>
      {paginatedNames.map((item) => (
        <tr key={item._id} className="bg-white hover:bg-gray-100 border-b">
          <td className="px-4 py-4">
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => handleItemSelection(item)}
              className="rounded"
            />
          </td>
          <td className="px-4 py-2">{item.bookName}</td>
          <td className="px-4 py-2">{item.gender}</td>
          <td className="px-4 py-2">{item.name}</td>
          <td className="px-4 py-2">{item.meaning}</td>
          <td className="px-4 py-2">{item.nameInHindi}</td>
          <td className="px-4 py-2">{item.meaningInHindi}</td>
          <td className="px-4 py-2">{item.shlokNo}</td>
          <td className="px-4 py-2">{item.pageNo}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>




      {/* Pagination controls */}
      <div className="flex justify-between items-center mb-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded flex items-center gap-2 ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-gray-100'}`}
  >
    <span>&lt;</span> Previous
  </button>

  <span className="text-sm text-gray-600 mx-4">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded flex items-center gap-2 ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-gray-100'}`}
  >
    Next <span>&gt;</span>
  </button>
</div>




<div className="flex justify-between items-center my-10">
  {/* Left-end button */}
  <button onClick={handleGeneratePdf} className="bg-blue-500 text-white px-4 py-2 rounded">Generate PDF</button>

  {/* Center container for the icon buttons */}
  <div className="flex justify-center items-center flex-grow space-x-2">
    {pdfContent && (
      <>
        <button onClick={handleDownload} className="bg-white-500 text-white px-4 py-2 rounded flex items-center">
          <FaDownload className="text-gray-600" size={20} /> {/* Gray color */}
        </button>
        <button onClick={handleSendMail} className="bg-white-500 text-white px-4 py-2 rounded flex items-center">
          <FaEnvelope className="text-gray-600" size={20} /> {/* Gray color */}
        </button>
        <button onClick={handleSendWhatsApp} className="bg-white-500 text-white px-4 py-2 rounded flex items-center">
          <FaWhatsapp className="text-gray-600" size={20} /> {/* Gray color */}
        </button>
      </>
    )}
  </div>

  {/* Right-end button */}
  <button onClick={handleClose} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
</div>
    </div>
  );
};

export default CheckBoxListPage;