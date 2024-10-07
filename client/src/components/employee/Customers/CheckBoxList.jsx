import React, { useState } from 'react';
import axios from 'axios';

const CheckBoxListPage = ({ selectedCustomer, handleClose }) => {
  const [names, setNames] = useState(['Purna', 'Srikar', 'Ramtej', 'Mounika', 'Teja']);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pdfContent, setPdfContent] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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
      const response = await axios.post('http://localhost:3000/api/PDF/create-pdf', {
        names: selectedItems,
        customerId: selectedCustomer._id,
      });
      console.log('PDF generated and saved:', response.data);
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
      await axios.post('http://localhost:3000/api/PDF/send-pdf-email', { email, base64Pdf: pdfContent, uniqueId });
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
      await axios.post('http://localhost:3000/api/PDF/send-pdf-whatsapp', { phoneNumber, base64Pdf: pdfContent, uniqueId });
      alert('PDF sent to WhatsApp');
    } catch (error) {
      console.error('Error sending PDF to WhatsApp', error);
      alert('Error sending WhatsApp message');
    }
  };

  return (
<div className="bg-gray-100 p-6 mt-6 rounded-lg shadow-lg max-w-xl mx-auto">
  <h1 className="text-2xl mb-6 text-gray-800 text-center">
    Generate and Send PDF for {selectedCustomer.username}
  </h1>

  {/* Selection Box */}
  <div className="bg-white p-4 border border-gray-300 rounded-md mb-6">
    <h2 className="text-lg mb-4">Select Items to Generate PDF</h2>
    {names.map((name) => (
      <div key={name} className="mb-3 flex items-center">
        <input
          type="checkbox"
          value={name}
          onChange={() => handleItemSelection(name)}
          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span>{name}</span>
      </div>
    ))}
    <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    onClick={handleGeneratePdf}
    >
      Generate PDF
    </button>
  </div>

  {/* View and Download Buttons */}
  <div className="flex justify-center space-x-4 mb-6">
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      onClick={() => window.open(`data:application/pdf;base64,${pdfContent}`, '_blank')}
    >
      View PDF
    </button>
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      onClick={handleDownload}
    >
      Download PDF
    </button>
  </div>

  {/* Email and WhatsApp Section */}
  <div className="space-y-4">
    <div className="flex items-center space-x-3">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-60"
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={handleSendMail}
      >
        Send to Email
      </button>
    </div>

    <div className="flex items-center space-x-3">
      <input
        type="tel"
        placeholder="Enter WhatsApp number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-60"
      />
      <button
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        onClick={handleSendWhatsApp}
      >
        Send to WhatsApp
      </button>
    </div>
  </div>

  {/* Close button */}
  <button className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={handleClose}>
    Close
  </button>
</div>

  );
};

export default CheckBoxListPage;
