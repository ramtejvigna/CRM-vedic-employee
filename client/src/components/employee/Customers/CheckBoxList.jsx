import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Filter } from "lucide-react";
import { toast } from "react-toastify";
import { generatePdf } from './pdfDisplayComponent';

// Constants
const ITEMS_PER_PAGE = 20;
const API_BASE_URL = "https://vedic-backend-neon.vercel.app/api";

export const handleDownload = (pdfUrl, uniqueId) => {
  if (!pdfUrl) {
    alert('No PDF URL found. Please generate the PDF first.');
    return;
  }
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = `${uniqueId}.pdf`;
  link.click();
};

// Function to convert Blob to base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]); // Get base64 content without the data type prefix
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const handleSendMail = async (pdfUrl, uniqueId, email) => {
  if (!email) {
    alert("Provide a valid email");
    return;
  }

  try {
    // Fetch the Blob from the Blob URL
    const response = await fetch(pdfUrl);
    const pdfBlob = await response.blob(); // Convert the response to a Blob

    // Convert the Blob to base64
    const base64Pdf = await blobToBase64(pdfBlob);

    // Send the base64-encoded PDF to the backend
    await axios.post("https://vedic-backend-neon.vercel.app/api/send-pdf-email", {
      email,
      base64Pdf,
      uniqueId,
    });

    alert("PDF sent to email");
  } catch (error) {
    console.error("Error sending PDF to email", error);
    alert("Error sending email");
  }
};



export const handleSendWhatsApp = async (pdfUrl, uniqueId, phoneNumber) => {
  if (!phoneNumber || !pdfUrl || !uniqueId) {
    alert("Provide a valid phone number and ensure the PDF is generated.");
    return;
  }

  try {
    await axios.post("https://vedic-backend-neon.vercel.app/api/send-pdf-whatsapp", {
      phoneNumber,
      pdfUrl,
      uniqueId,
    });
    alert("PDF sent to WhatsApp");
  } catch (error) {
    console.error("Error sending PDF via WhatsApp", error);
    alert("Error sending WhatsApp message");
  }
};



// Filter tag component
const FilterTag = ({ label, onRemove }) => (
  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center space-x-2">
    <span>{label}</span>
    <button
      className="ml-2 text-red-500 hover:text-red-700"
      onClick={onRemove}
    >
      &#10005;
    </button>
  </span>
);

// Table header component
const TableHeader = () => (
  <thead className="bg-gray-100">
    <tr>
      {["Select", "Book Name", "Gender", "Name", "Meaning", "Name In Hindi", "Meaning In Hindi", "Shlok No", "Page No"].map((header) => (
        <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-600">
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

const CheckBoxListPage = ({ customerData, setPdfUrl, setShowViewer, onPdfGenerated }) => {
  // State management
  const [names, setNames] = useState([]);
  const [filters, setFilters] = useState({
    gender: customerData?.babyGender || "",
    startingLetter: customerData?.preferredStartingLetter || "",
    book: "",
    meaning: ""
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Memoized filtered names
  const filteredNames = useMemo(() => {
    return names.filter(item => {
      const matchesGender = !filters.gender || item.gender === filters.gender;
      const matchesLetter = !filters.startingLetter || 
        item.name.charAt(0).toLowerCase() === filters.startingLetter.toLowerCase();
      const matchesBook = !filters.book || 
        item.bookName?.toLowerCase().includes(filters.book.toLowerCase());
      const matchesMeaning = !filters.meaning || 
        item.meaning?.toLowerCase().includes(filters.meaning.toLowerCase());
      
      return matchesGender && matchesLetter && matchesBook && matchesMeaning;
    });
  }, [names, filters]);

  // Memoized paginated names
  const paginatedNames = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNames.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNames, currentPage]);

  const totalPages = Math.ceil(filteredNames.length / ITEMS_PER_PAGE);

  // Fetch names on component mount
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/names`);
        setNames(response.data);
      } catch (error) {
        toast.error("Failed to fetch names");
        console.error("Error fetching names:", error);
      }
    };
    fetchNames();
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      gender: customerData?.babyGender || "",
      startingLetter: customerData?.preferredStartingLetter || "",
      book: "",
      meaning: ""
    });
    setSelectedItems([]);
    setCurrentPage(1);
  }, [customerData]);

  // PDF generation
  const handleGeneratePdf = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Please select items first");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${API_BASE_URL}/create-pdf`, {
        names: selectedItems.map(item => item.name),
        customerId: customerData._id
      });
      const pdfUrl = await generatePdf(selectedItems);
      setPdfUrl(pdfUrl);
      setShowViewer(true);
      toast.success("PDF generated successfully");
      setSelectedItems([]);
      onPdfGenerated();
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Baby Names</h1>
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          {showFilters && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(filters).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {key === 'gender' ? (
                      <select
                        value={value}
                        onChange={e => handleFilterChange(key, e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={e => handleFilterChange(key, e.target.value)}
                        maxLength={key === 'startingLetter' ? 1 : undefined}
                        className="mt-1 p-2 w-full border rounded-md"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleResetFilters}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse bg-white">
              <TableHeader />
              <tbody>
                {paginatedNames.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item)}
                        onChange={() => {
                          setSelectedItems(prev =>
                            prev.includes(item)
                              ? prev.filter(i => i !== item)
                              : [...prev, item]
                          );
                        }}
                        className="rounded"
                      />
                    </td>
                    {['bookName', 'gender', 'name', 'meaning', 'nameInHindi', 'meaningInHindi', 'shlokNo', 'pageNo'].map(key => (
                      <td key={key} className="px-4 py-2">{item[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-400 bg-white text-blue-500 hover:bg-gray-100"
            >
              &lt; Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-400 bg-white text-blue-500 hover:bg-gray-100"
            >
              Next &gt;
            </button>
          </div>

          {/* Generate PDF Button */}
          <div className="mt-6">
            <button
              onClick={handleGeneratePdf}
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Generate PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckBoxListPage;