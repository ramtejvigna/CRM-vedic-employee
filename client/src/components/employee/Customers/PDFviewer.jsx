import React from 'react';
import { FaDownload, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const PDFViewer = ({ pdfUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[1000] bg-black bg-opacity-75 backdrop-blur-md overflow-scroll scrollbar-hide">
      <div className="bg-white rounded-lg shadow-xl p-7 w-full mx-auto max-w-[800px] h-full max-h-[600px] relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-1 right-1 text-gray-400 text-3xl p-2 hover:text-gray-600 transition duration-200"
        >
          &times;
        </button>

        <h2 className="mb-4 text-xl font-semibold">Generated PDF:</h2>
     

        {/* PDF Iframe Viewer */}
        <div className="flex items-center justify-center w-full h-[90%]">
          <iframe
            src={pdfUrl}
            className="w-full h-full border rounded-lg"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
