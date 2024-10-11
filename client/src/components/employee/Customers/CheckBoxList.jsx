import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckBoxListPage = ({ selectedCustomer, handleClose }) => {
  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [pdfContent, setPdfContent] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [email, setEmail] = useState(selectedCustomer.email || ''); 
  const [phoneNumber, setPhoneNumber] = useState(selectedCustomer.whatsappNumber || '');
  const [selectedLetter, setSelectedLetter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/names')
      .then((response) => {
        setNames(response.data);
        filterNames(response.data); // Filter names based on gender
      })
      .catch((error) => console.error('Error fetching names:', error));
  }, [selectedCustomer.babyGender]);

  const filterNames = (allNames, letter = selectedLetter) => {
    let filtered = allNames.filter(item => item.gender === selectedCustomer.babyGender);
    if (letter) {
      filtered = filtered.filter((item) => item.name.startsWith(letter));
    }
    setFilteredNames(filtered);
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    filterNames(names, letter);
  };

  const handleGeneratePdf = async () => {
    if (filteredNames.length === 0) {
      alert('No names available for the selected letter!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/create-pdf', {
        names: filteredNames.map(item => ({
          name: item.name,
          meaning: item.meaning,
        })),
        customerId: selectedCustomer._id,
      });

      setPdfContent(response.data.base64Pdf);
      setUniqueId(response.data.uniqueId);

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

  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <div className="p-6 bg-white w-2/3 text-center rounded-lg shadow-lg flex flex-col gap-10">
        <h2 className="text-xl font-semibold mb-4">Select Names for PDF</h2>

        <div className="mb-4">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`bg-slate-400 bg-opacity-25 border border-gray-600 py-1 rounded-full mr-3 mb-2 w-10 h-10 ${selectedLetter === letter ? 'bg-gray-900 bg-opacity-70' : ''}`}
            >
              {letter}
            </button>
          ))}
        </div>

        {selectedLetter && (
          <div className="flex justify-between mt-4">
            <button onClick={handleGeneratePdf} className="bg-blue-500 text-white px-4 py-2 rounded">
              Generate PDF
            </button>
            <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">
              Download PDF
            </button>
            <button onClick={handleSendMail} className="bg-yellow-500 text-white px-4 py-2 rounded">
              Send via Email
            </button>
            <button onClick={handleSendWhatsApp} className="bg-green-600 text-white px-4 py-2 rounded">
              Send via WhatsApp
            </button>
          </div>
        )}

        <div className="mt-6">
          <button onClick={handleClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckBoxListPage;
