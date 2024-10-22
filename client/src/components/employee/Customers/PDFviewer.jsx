import React from 'react';
import { FaDownload, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const PDFViewer = ({ pdfUrl, handleDownload, handleSendMail, email, enabledRow, pdfId, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-3xl p-2 ">
        &times; {/* Close button */}
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

        <iframe
          src={pdfUrl}
          width="100%"
          height="600px" // Adjusted height for larger display
          className="border rounded-lg"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PDFViewer;
