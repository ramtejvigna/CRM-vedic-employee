import React, { useState, useEffect} from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { FaDownload, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import {toast} from "react-toastify"

export const handleDownload = (pdfContent,uniqueId) => {
  if (!pdfContent) return;
  const link = document.createElement("a");
  link.href = `data:application/pdf;base64,${pdfContent}`;
  link.download = `${uniqueId}.pdf`;
  link.click();
};  

 export const handleSendMail = async (pdfContent, uniqueId,email) => {
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

export const handleSendWhatsApp = async (pdfContent, uniqueId,phoneNumber) => {
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


const CheckBoxListPage = ({customerData , pdfContent , setPdfContent, iframeRef}) => {
  const location = useLocation();
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  //const { customerData } = location.state || {};
  const [email, setEmail] = useState(customerData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    customerData?.whatsappNumber || ""
  );

  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isloading, setIsloading] = useState(false)
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/names")
      .then((response) => {
        setNames(response.data);
        filterNames(response.data);
      })
      .catch((error) => console.error("Error fetching names:", error));
  }, [customerData?.babyGender, customerData?.preferredStartingLetter]);

  useEffect(() => {
    if (pdfContent) {
      let blobUrl;
      try {
        // Convert base64 to binary data
        const byteCharacters = atob(pdfContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
  
        // Create Blob URL
        blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);
      } catch (error) {
        console.error("Error processing PDF content:", error);
      }
  
      // Cleanup function to revoke Blob URL
      return () => {
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
        }
      };
    }
  }, [pdfContent]);
  
  
  

  
  
  

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

  const handleItemSelection = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  const handleGeneratePdf = async () => {
    if (selectedItems.length === 0) {
      alert("No items selected!");
      return;
    }
  
    try {
      setIsloading(true);
      const response = await axios.post("http://localhost:3000/api/create-pdf", {
        names: selectedItems.map((item) => ({
          name: item.name,
          meaning: item.meaning,
        })),
        customerId: customerData._id,
      });
      setPdfContent(response.data.base64Pdf); // Only set this if response is successful
      setUniqueId(response.data.uniqueId);
      toast.success("PDF generated");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("PDF generation failed");
    } finally {
      setIsloading(false); // Ensure loading state is set to false in any case
    }
  };
  

   

  const handleClose = () => {
    window.history.back();
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNames = filteredNames.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredNames.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Baby Names</h1>
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
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-blue-500 hover:bg-gray-100"
          }`}
        >
          &lt; Previous
        </button>
        <span className="text-sm text-gray-600 mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-blue-500 hover:bg-gray-100"
          }`}
        >
          Next &gt;
        </button>
      </div>

      <div className="flex justify-between items-center my-10">
  <button
    onClick={handleGeneratePdf}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Generate PDF
  </button>

  {pdfContent && (
    <div className="flex items-center space-x-4">
      <motion.button
        onClick={() => handleDownload(pdfContent, uniqueId)}
        whileTap={{ scale: 0.9 }}
        className="flex items-center space-x-2 text-green-600 hover:underline"
      >
        <FaDownload />
        <span>Download PDF</span>
      </motion.button>

      <motion.button
        onClick={()=>handleSendMail(pdfContent,uniqueId,email)}
        whileTap={{ scale: 0.9 }}
        className="flex items-center space-x-2 text-blue-500 hover:underline"
      >
        <FaEnvelope />
        <span>Send via Email</span>
      </motion.button>

      <motion.button
        onClick={()=>handleSendWhatsApp(pdfContent,uniqueId,phoneNumber)}
        whileTap={{ scale: 0.9 }}
        className="flex items-center space-x-2 text-green-500 hover:underline"
      >
        <FaWhatsapp />
        <span>Send via WhatsApp</span>
      </motion.button>
    </div>
  )}
</div>
  
  {isloading && (
    <div className="w-full flex items-center justify-center h-[500px]">
      <div className="rounded-full w-[50px] h-[50px] border border-gray-400 border-t-black animate-spin"></div>
    </div>
  )}
{pdfBlobUrl  && !isloading &&  (
        <div className="mt-4">
          <iframe
            ref={iframeRef}
            src={pdfBlobUrl}
            width="100%"
            height="500px"
            className="border rounded-lg shadow-lg"
            title="PDF Viewer"
          />
        </div>
      )}

    </div>
  );
};

export default CheckBoxListPage;