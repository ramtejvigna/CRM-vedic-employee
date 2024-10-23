import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { FaDownload, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { Filter } from "lucide-react";
import { toast } from "react-toastify";
import { generatePdf } from './pdfDisplayComponent';


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

export const handleSendMail = async (pdfUrl, uniqueId, email) => {
  if (!email || !pdfUrl) {
    alert("Provide a valid email and ensure the PDF is generated.");
    return;
  }

  try {
    await axios.post("http://localhost:3000/api/send-pdf-email", {
      email,
      pdfUrl,
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
    await axios.post("http://localhost:3000/api/send-pdf-whatsapp", {
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


const CheckBoxListPage = ({ customerData, pdfContent, setPdfContent, iframeRef, pdfUrl, setPdfUrl, setShowViewer }) => {
  const location = useLocation();
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [email, setEmail] = useState(customerData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(customerData?.whatsappNumber || "");
  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [genderFilter, setGenderFilter] = useState(customerData?.babyGender || "");
  const [startingLetterFilter, setStartingLetterFilter] = useState(customerData?.preferredStartingLetter || "");
  const [bookFilter, setBookFilter] = useState("");
  const [meaningFilter, setMeaningFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tags, setTags] = useState([
    { type: 'gender', label: `Gender: ${customerData?.babyGender}`, value: customerData?.babyGender },
    { type: 'startingLetter', label: `Starting Letter: ${customerData?.preferredStartingLetter}`, value: customerData?.preferredStartingLetter }
  ]);
 


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
        // Create Blob URL
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
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

  const removeTag = (type) => {
    // Remove the tag from the tags list
    const updatedTags = tags.filter((tag) => tag.type !== type);
    setTags(updatedTags);
  
    // Handle removing the corresponding filter
    switch (type) {
      case "gender":
        setGenderFilter("");  // Remove gender filter
        break;
      case "startingLetter":
        setStartingLetterFilter("");  // Remove starting letter filter
        break;
      case "book":
        setBookFilter("");  // Remove book filter
        break;
      case "meaning":
        setMeaningFilter("");  // Remove meaning filter
        break;
      default:
        break;
    }
  
    // Reapply filters based on the remaining tags
    filterNames(names);
  };
  
  

  // Update the filterNames function to ensure it always reflects current filter states
const filterNames = (allNames) => {
  let filtered = allNames;

  // Apply gender filter
  if (genderFilter) {
      filtered = filtered.filter((item) => item.gender === genderFilter);
  }

  // Apply starting letter filter
  if (startingLetterFilter) {
      filtered = filtered.filter((item) => item.name.startsWith(startingLetterFilter));
  }

  // Apply additional filters
  if (bookFilter) {
      filtered = filtered.filter((item) =>
          item.bookName?.toLowerCase().includes(bookFilter.toLowerCase())
      );
  }

  if (meaningFilter) {
      filtered = filtered.filter((item) =>
          item.meaning?.toLowerCase().includes(meaningFilter.toLowerCase())
      );
  }

  // Set filtered names and reset the page to the first page
  setFilteredNames(filtered);
  setCurrentPage(1);
};

// Update the input handling for gender
const handleGenderChange = (e) => {
  const selectedGender = e.target.value;
  setGenderFilter(selectedGender);
  
  // Update the tag
  const updatedTags = tags.filter(tag => tag.type !== 'gender');
  if (selectedGender) {
      updatedTags.push({ type: 'gender', label: `Gender: ${selectedGender}`, value: selectedGender });
  }
  setTags(updatedTags);

  // Reapply filters
  filterNames(names);
};

// Update the input handling for starting letter
const handleStartingLetterChange = (e) => {
  const letter = e.target.value;
  setStartingLetterFilter(letter);
  
  // Update the tag
  const updatedTags = tags.filter(tag => tag.type !== 'startingLetter');
  if (letter) {
      updatedTags.push({ type: 'startingLetter', label: `Starting Letter: ${letter}`, value: letter });
  }
  setTags(updatedTags);

  // Reapply filters
  filterNames(names);
};

// Update other input handlers similarly...

  
  

  // Function to remove a tag and its associated filter
  const handleResetFilters = () => {
    // Reset additional filters
    setBookFilter("");
    setMeaningFilter("");
  
    // Reset gender and starting letter filters to their default values
    setGenderFilter(customerData?.babyGender || "");
    setStartingLetterFilter(customerData?.preferredStartingLetter || "");
  
    // Reset tags to only include the default filters
    setTags([
      { label: `Gender: ${customerData?.babyGender}`, type: "gender" },
      { label: `Starting Letter: ${customerData?.preferredStartingLetter}`, type: "startingLetter" },
    ]);
  
    // Reapply default filters
    filterNames(names);
  };
  
  

  const handleItemSelection = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  const handleShowPdf = async (babyNames) => {
    const generatedPdfUrl = await generatePdf(babyNames); // Call the generatePdf function
    setPdfUrl(generatedPdfUrl); // Set the URL state
    setShowViewer(true);
  };
  
  const handleGeneratePdf = async () => {
    if (selectedItems.length === 0) {
        alert("No items selected!");
        return;
    }

    try {
        setIsLoading(true);
        const response = await axios.post("http://localhost:3000/api/create-pdf", {
            names: selectedItems.map((item) => item.name),
            customerId: customerData._id,
        });
        handleShowPdf(selectedItems);
        toast.success("PDF generated");
        selectedItems([]);
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("PDF generation failed");
    } finally {
        setIsLoading(false); // Ensure loading state is set to false in any case
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
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {showFilters && (
  <div className="bg-white p-4 rounded-lg mb-6 shadow-md">
    <h2 className="text-xl font-semibold mb-4">Filters</h2>

    {/* Filter Input Fields */}
    <div className="grid grid-cols-3 gap-4">
      {/* Book Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Book</label>
        <input
          type="text"
          value={bookFilter}
          onChange={(e) => setBookFilter(e.target.value)}
          className="mt-1 p-2 block w-full border rounded-md"
        />
      </div>

      {/* Meaning Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Meaning</label>
        <input
          type="text"
          value={meaningFilter}
          onChange={(e) => setMeaningFilter(e.target.value)}
          className="mt-1 p-2 block w-full border rounded-md"
        />
      </div>

      {/* Gender Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          value={genderFilter}
          onChange={(e) => {
            setGenderFilter(e.target.value);
            filterNames(names);  // Reapply filters when gender is changed
          }}
          className="mt-1 p-2 block w-full border rounded-md"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Starting Letter Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Starting Letter</label>
        <input
          type="text"
          value={startingLetterFilter}
          onChange={(e) => setStartingLetterFilter(e.target.value)}
          maxLength={1}
          className="mt-1 p-2 block w-full border rounded-md"
        />
      </div>
    </div>

    {/* Tags Display Area */}
    <div className="mt-4">
      {tags.length > 0 && (
        <div className="flex flex-wrap space-x-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center space-x-2"
            >
              <span>{tag.label}</span>
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeTag(tag.type)}
              >
                &#10005;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Apply Filters and Reset Buttons */}
    <div className="flex justify-between mt-4">
      <button
        onClick={() => filterNames(names)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Apply Filters
      </button>

      <button
        onClick={handleResetFilters}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Reset
      </button>
    </div>
  </div>
)}





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
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate PDF"}
        </button>

        
      </div>
      
    
    </div>
  );
};

export default CheckBoxListPage;