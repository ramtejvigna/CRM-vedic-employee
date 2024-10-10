import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckBoxListPage = ({ selectedCustomer, handleClose }) => {
  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pdfContent, setPdfContent] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [email, setEmail] = useState(selectedCustomer.email || ''); // Set initial email
  const [phoneNumber, setPhoneNumber] = useState(selectedCustomer.whatsappNumber || '');
  const [selectedLetter, setSelectedLetter] = useState('A-Z');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Fetch names from the database
    axios.get('http://localhost:3000/api/names')
      .then((response) => {
        setNames(response.data);
        // Filter names based on baby's gender when names are fetched
        filterNames(response.data);
      })
      .catch((error) => console.error('Error fetching names:', error));
  }, [selectedCustomer.babyGender]); // Add babyGender as a dependency

  const filterNames = (allNames) => {
    const filtered = allNames.filter(item => item.gender === selectedCustomer.babyGender);
    setFilteredNames(filtered); // Set filtered names based on gender
    setCurrentPage(1); // Reset to the first page when filtering
  };


  // Handle filtering based on selected letter and the selected customer's baby gender
  const handleFilterNames = (letter) => {
    let filtered = names;

    if (letter && letter !== 'A-Z') {
      filtered = filtered.filter((item) => item.name.startsWith(letter));
    }

    if (selectedCustomer.babyGender) {
      filtered = filtered.filter((item) => item.gender === selectedCustomer.babyGender);
    }

    setFilteredNames(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
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

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    handleFilterNames(letter); // Filter by selected letter
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

      console.log('PDF generated and saved:', response.data);
      setPdfContent(response.data.base64Pdf);
      setUniqueId(response.data.uniqueId);

      // Display the PDF
      const pdfBlob = new Blob([new Uint8Array(atob(response.data.base64Pdf).split("").map(char => char.charCodeAt(0)))], { type: 'application/pdf' });
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
  const paginatedNames = filteredNames.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredNames.length / itemsPerPage);

  return (
    <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Select Names for PDF</h2>
      <h1 className='text-white'>{selectedCustomer.fatherName}</h1>

      <div className="mb-4">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 mb-2"
          >
            {letter}
          </button>
        ))}
        <button onClick={() => handleLetterClick('A-Z')} className="bg-gray-500 text-white px-3 py-1 rounded">
          All
        </button>
      </div>

      {/* Table of filtered names with checkboxes */}
      <div className="overflow-y-auto max-h-96 mb-4">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Select</th>
              <th className="border border-gray-300 px-4 py-2">Book Name</th>
              <th className="border border-gray-300 px-4 py-2">Gender</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Meaning</th>
              <th className="border border-gray-300 px-4 py-2">Name In Hindi</th>
              <th className="border border-gray-300 px-4 py-2">Meaning In Hindi</th>
              <th className="border border-gray-300 px-4 py-2">Shlok No</th>
              <th className="border border-gray-300 px-4 py-2">Page No</th>
            </tr>
          </thead>
          <tbody>
            {paginatedNames.map((item) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item)}
                    onChange={() => handleItemSelection(item)}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">{item.bookName}</td>
                <td className="border border-gray-300 px-4 py-2">{item.gender}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.meaning}</td>
                <td className="border border-gray-300 px-4 py-2">{item.nameInHindi}</td>
                <td className="border border-gray-300 px-4 py-2">{item.meaningInHindi}</td>
                <td className="border border-gray-300 px-4 py-2">{item.shlokNo}</td>
                <td className="border border-gray-300 px-4 py-2">{item.pageNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`bg-gray-300 text-black px-4 py-2 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className={`bg-gray-300 text-black px-4 py-2 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <div className="flex justify-between mt-4">
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
