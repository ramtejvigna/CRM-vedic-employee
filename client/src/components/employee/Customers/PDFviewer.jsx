import React from 'react';
import { FaDownload, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const PDFViewer = ({ pdfUrl, handleDownload, handleSendMail, email, enabledRow, pdfId, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[1000] bg-black bg-opacity-75 backdrop-blur-md overflow-scroll scrollbar-hide">
      <div className="bg-white rounded-lg shadow-xl p-7 w-full mx-auto max-w-[900px] h-full max-h-[700px] relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-1 right-1 text-gray-400 text-3xl p-2 hover:text-gray-600 transition duration-200"
        >
          &times;
        </button>

        <h2 className="mb-4 text-xl font-semibold">Generated PDF:</h2>

        {/* Button container */}
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={() => handleDownload(pdfUrl, pdfId)}
            disabled={enabledRow !== pdfId}
            className={`rounded-lg px-4 py-2 transition duration-200 ${
              enabledRow !== pdfId ? 'bg-blue-100 text-blue-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FaDownload />
          </button>
          <button
            onClick={() => { /* Add your WhatsApp functionality here */ }}
            disabled={enabledRow !== pdfId}
            className={`rounded-lg px-4 py-2 transition duration-200 ${
              enabledRow !== pdfId ? 'bg-green-100 text-green-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <FaWhatsapp />
          </button>
          <button
            onClick={() => handleSendMail(pdfUrl, pdfId, email)}
            disabled={enabledRow !== pdfId}
            className={`rounded-lg px-4 py-2 transition duration-200 ${
              enabledRow !== pdfId ? 'bg-red-100 text-red-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <FaEnvelope />
          </button>
        </div>

        {/* PDF Iframe Viewer */}
        <div className="flex items-center justify-center w-full h-[90%]">
          <iframe
            src={pdfUrl}
            className="w-full h-full max-h-[600px] border rounded-lg object-fill" // Ensures image scales within the iframe
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
