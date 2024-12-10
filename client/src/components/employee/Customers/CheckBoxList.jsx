import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation,useNavigate } from "react-router-dom";
import { FaDownload, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { Search,Filter } from "lucide-react";
import { ToastContainer,toast } from "react-toastify";
import { generatePdf } from './pdfDisplayComponent';
import 'react-toastify/dist/ReactToastify.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Cookies from "js-cookie";
import {
  Edit,
  
  ArrowRight,
} from 'lucide-react';
import { FaAngleLeft,FaAngleRight,FaArrowLeft } from "react-icons/fa";
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
    const response = await fetch(pdfUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const pdfBlob = await response.blob();
            const base64Pdf = await blobToBase64(pdfBlob);
    await axios.post("https://vedic-backend-neon.vercel.app/api/send-pdf-email", {
      email,
      base64Pdf,
      uniqueId,
    });
  } catch (error) {
    console.error("Error sending PDF to email", error);
  }
};



export const handleSendWhatsApp = async (pdfUrl, uniqueId, phoneNumber) => {
  
  if (!phoneNumber || !uniqueId) {
    alert("Provide a valid phone number and ensure the PDF is generated.");
    return;
  }
  try {

    const response = await fetch(pdfUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const pdfBlob = await response.blob();
    const base64Pdf = await blobToBase64(pdfBlob);

    const res = await axios.post("http://localhost:9000/api/send-pdf-whatsapp", {
      phoneNumber,
      base64Pdf,
      uniqueId,
    } , {withCredentials : true});

    if(res.status === 200) {
      const message = `Dear User,

Greetings from CRM-Vedics!

We are pleased to share your suggested baby names PDF. You can access it using the following link: ${res.data.firebasePdfUrl}

Thank you for choosing CRM-Vedics. We hope this information meets your expectations. If you have any questions or need further assistance, please do not hesitate to contact us.

Warm regards,  
CRM-Vedics Team`;

window.open(`https://wa.me/+919059578959?text=${encodeURIComponent(message)}`);
    }
  } catch (error) {
    console.error("Error sending PDF via WhatsApp", error);
    alert("Error sending WhatsApp message");
  }
};


const CheckBoxListPage = () => {
  const { state } = useLocation();
  const { customerDetails  } = state || {};
  const customerData  = customerDetails;
  const [email, setEmail] = useState(customerData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(customerData?.whatsappNumber || "");
  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [filters, setFilters] = useState({
    gender: customerData?.babyGender || "",
    startingLetter: customerData?.preferredStartingLetter || "",
    book: "",
    meaning: "",
    zodiac: "",
    nakshatra: "",
    element: "",
  });
  const [tags, setTags] = useState([]);
  const [uniqueValues, setUniqueValues] = useState({
    zodiacs: [],
    nakshatras: [],
    elements: [],
    bookNames: [],
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  
  const [isLoading, setIsLoading] = useState(false);
   const [showFilters, setShowFilters] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false);
    const [numberOfNames, setNumberOfNames] = useState();
    const [additionalBabyNames, setAdditionalBabyNames] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [showNumberInput, setShowNumberInput]=useState(true);
    const sliderRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [employee, setEmployee] = useState(null);

    const employeeId = Cookies.get("employeeId");
    

    useEffect(() => {
      const fetchEmployee = async () => {
          try {
              const id=employeeId;
              const response = await axios.get(`https://vedic-backend-neon.vercel.app/api/employees/get-employee?id=${id}`);
              setEmployee(response.data.employee);
          } catch (err) {
              setError(err.response ? err.response.data : 'Error fetching employee details');
          }
      };
      
      fetchEmployee();
  }, [employeeId]);
    
    const handleCloseModal = () => {
        setModalOpen(false);
        setNumberOfNames();
        setShowNumberInput(true);
        
    };

    const handleNumberOfNamesChange = (e) => {
        const count = parseInt(e.target.value, 10);
        setNumberOfNames(count);
        setAdditionalBabyNames(Array.from({ length: count }, () => ({ nameEnglish: '', meaning: '' })));
    };

    const handleInputChange = (index, field, value) => {
        const updatedNames = [...additionalBabyNames];
        updatedNames[index][field] = value;
        setAdditionalBabyNames(updatedNames);
    };

    const handleSubmit = () => {
        console.log(additionalBabyNames);
        setModalOpen(false);


    };

    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      beforeChange: (_, next) => setCurrentStep(next),
      appendDots: (dots) => (
        <div className="overflow-hidden flex items-center justify-center mt-4">
          {dots
            .filter((_, index) => Math.abs(currentStep - index) <= 1) // Show only previous, current, and next dots
            .map((dot, index) => (
              <span key={index} className="transition-opacity duration-300 ease-in-out mx-1">
                {dot}
              </span>
            ))}
        </div>
      ),
      customPaging: (i) => (
        <div
          className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
            currentStep === i
              ? "bg-gray-800"  // Current dot color
              : "bg-gray-300 opacity-75"  // Previous and next dots color
          }`}
        />
      ),
    };
    
    


  const navigate = useNavigate();

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Filter names based on the search term
    const filtered = filteredNames.filter(babyName => 
        babyName.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNames(filtered);
};

useEffect(() => {
    // Reset filtered names if the search term is cleared
    if (!searchTerm) {
        setFilteredNames(names);
    }
}, [searchTerm]);



  useEffect(() => {
    axios
      .get("https://vedic-backend-neon.vercel.app/api/names")
      .then((response) => {
        const allNames = response.data;

        const extractUniqueValues = (field) =>
          [...new Set(allNames.map((item) => item[field]).filter(Boolean))].sort(
            (a, b) => a.localeCompare(b)
          );

        const uniqueValues = {
          zodiacs: extractUniqueValues("zodiac"),
          nakshatras: extractUniqueValues("nakshatra"),
          elements: extractUniqueValues("element"),
          bookNames: extractUniqueValues("bookName"),
        };

        setNames(allNames);
        setUniqueValues(uniqueValues);
        filterNames({ allNames, filters })
              })
      .catch((error) => console.error("Error fetching names:", error));
  }, [customerData?.babyGender, customerData?.preferredStartingLetter]);


  const filterNames = ({ allNames, filters }) => {
    const filtered = Object.keys(filters).reduce((result, key) => {
      if (!filters[key]) return result; // Skip if no filter value
      if (key === "startingLetter") {
        return result.filter((item) =>
          item.nameEnglish.charAt(0).toLowerCase() === filters[key].toLowerCase()
        );
      }
      return result.filter((item) =>
        item[key]?.toLowerCase().includes(filters[key].toLowerCase())
      );
    }, allNames);
    setFilteredNames(filtered);
  };


  useEffect(() => {
    const newTags = Object.entries(filters)
      .filter(([key, value]) => value) // Only include active filters
      .map(([key, value]) => ({
        type: key,
        label: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
      }));
    setTags(newTags);
  }, [filters]);

  const removeTag = (type) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: "",
    }));
    filterNames({
      allNames: names,
      filters: { ...filters, [type]: "" },
    });
  };




  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    filterNames({
      allNames: names,
      filters: { ...filters, [key]: value },
    });
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      gender: customerData?.babyGender || "",
      startingLetter: customerData?.preferredStartingLetter || "",
      book: "",
      meaning: "",
      zodiac: "",
      nakshatra: "",
      element: "",
    };
    setFilters(defaultFilters);
    setTags([]);
    filterNames({ allNames: names, filters: defaultFilters });
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
      setIsLoading(true);
      const response = await axios.post(`${api}/api/create-pdf`, {
          names: selectedItems.map((item) => item._id), // Use item._id instead of item.name
          customerId: customerData._id,
          additionalBabyNames: additionalBabyNames,
          generatedBy:"Manager",
          userId: Cookies.get('employeeId')
      });
      toast.success("PDF Generated Successfully");
      setSelectedItems([]);
      setTimeout(() => {
          navigate(-1);
      }, 3000); // Adjust the timeout duration as needed (3000 ms = 3 seconds)
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
  const totalPages = Math.ceil((filteredNames?.length || 0) / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedNames = Array.isArray(filteredNames)
    ? filteredNames.slice(startIndex, startIndex + rowsPerPage)
    : [];

  const handleChangePage = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when rows per page change
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <ToastContainer
                position="top-right"
                autoClose={3000}
                // Unique container ID
            />
      
      <button 
        onClick={()=>{navigate(-1)}}
        className="top-4 left-4 flex mb-3 items-center text-gray-500 hover:text-gray-700"
      >
        <FaArrowLeft size={15} />
        <span className="ml-2">Customer Details</span>

      </button>
      <h1 className="text-4xl font-bold mb-6">Baby Names</h1>

      <div className="mb-5 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
    {/* Search and Filter Section */}
    <div className="flex items-center space-x-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
        <input
                type="text"
                placeholder="Search Names"
                value={searchTerm} // Controlled input value
                onChange={handleSearch} // Update search term and filter names
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters((prev) => !prev)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white transition duration-300 flex items-center"
        >
            <Filter className="h-5 w-5 mr-2" />
            Filters
        </motion.button>
    </div>

    {/* Additional Baby Names Button */}
    <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300"
    >
        Additional Baby Names
    </button>
</div>

      
{showFilters && (
  <div className="bg-white p-4 rounded-lg mb-6 shadow-md">
  <h2 className="text-xl font-semibold mb-4">Filters</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {/* Gender Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Gender</label>
      <select
        value={filters.gender}
        onChange={(e) => handleFilterChange("gender", e.target.value)}
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
        value={filters.startingLetter}
        onChange={(e) => handleFilterChange("startingLetter", e.target.value)}
        maxLength={1}
        className="mt-1 p-2 block w-full border rounded-md"
      />
    </div>
    {/* Book Name Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Book</label>
      <select
        value={filters.book}
        onChange={(e) => handleFilterChange("book", e.target.value)}
        className="mt-1 p-2 block w-full border rounded-md"
      >
        <option value="">Select Book</option>
        {uniqueValues.bookNames.map((book, index) => (
          <option key={index} value={book}>
            {book}
          </option>
        ))}
      </select>
    </div>
    {/* Zodiac Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Zodiac</label>
      <select
        value={filters.zodiac}
        onChange={(e) => handleFilterChange("zodiac", e.target.value)}
        className="mt-1 p-2 block w-full border rounded-md"
      >
        <option value="">Select Zodiac</option>
        {uniqueValues.zodiacs.map((zodiac, index) => (
          <option key={index} value={zodiac}>
            {zodiac}
          </option>
        ))}
      </select>
    </div>
    {/* Nakshatra Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Nakshatra</label>
      <select
        value={filters.nakshatra}
        onChange={(e) => handleFilterChange("nakshatra", e.target.value)}
        className="mt-1 p-2 block w-full border rounded-md"
      >
        <option value="">Select Nakshatra</option>
        {uniqueValues.nakshatras.map((nakshatra, index) => (
          <option key={index} value={nakshatra}>
            {nakshatra}
          </option>
        ))}
      </select>
    </div>
    {/* Element Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Element</label>
      <select
        value={filters.element}
        onChange={(e) => handleFilterChange("element", e.target.value)}
        className="mt-1 p-2 block w-full border rounded-md"
      >
        <option value="">Select Element</option>
        {uniqueValues.elements.map((element, index) => (
          <option key={index} value={element}>
            {element}
          </option>
        ))}
      </select>
    </div>
  </div>
  {tags.length > 0 && (
    <div className="flex flex-wrap space-x-2 mt-4">
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
  <div className="flex justify-end mt-4">
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
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name(English)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Meaning</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Gender</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">BookName</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name(Devangari)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Numerology</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Zodiac</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Rashi</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Nakshatra</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Planetary Influence</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Element</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Page No</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Syllable Count</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Character Significance</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Mantra Ref</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Related Festival</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Extra Note</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Research Tag</th>
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
                <td className="px-4 py-2">{item.nameEnglish}</td>
                <td className="px-4 py-2">{item.meaning}</td>
                <td className="px-4 py-2">{item.gender}</td>
                <td className="px-4 py-2">{item.bookName}</td>
                <td className="px-4 py-2">{item.nameDevanagari}</td>
                <td className="px-4 py-2">{item.numerology}</td>
                <td className="px-4 py-2">{item.zodiac}</td>
                <td className="px-4 py-2">{item.rashi}</td>
                <td className="px-4 py-2">{item.nakshatra}</td>
                <td className="px-4 py-2">{item.planetaryInfluence}</td>
                <td className="px-4 py-2">{item.element}</td>
                <td className="px-4 py-2">{item.pageNo}</td>
                <td className="px-4 py-2">{item.syllableCount}</td>
                <td className="px-4 py-2">{item.characterSignificance}</td>
                <td className="px-4 py-2">{item.mantraRef}</td>
                <td className="px-4 py-2">{item.relatedFestival}</td>
                <td className="px-4 py-2">{item.extraNote}</td>
                <td className="px-4 py-2">{item.researchTag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex justify-between items-center rounded-lg px-4 py-3">
        {/* Rows per Page Selector */}
        <div className="flex items-center">
          <span className="mr-2">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="border border-gray-300 rounded-2xl pl-2 pr-5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          >
            {[5, 10, 25].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300"
          >
            Previous
          </button>
          <span>{`Page ${Math.min(currentPage, totalPages)} of ${totalPages}`}</span>
          <button
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300"
          >
            Next
          </button>
        </div>
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
      <div className="mt-8">
      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
    <button 
          onClick={handleCloseModal}
          className="absolute top-1 right-1 text-gray-400 text-3xl p-2 hover:text-gray-600 transition duration-200"
        >
          &times;
        </button>
      <h2 className="text-2xl font-semibold text-center mb-6">Additional Baby Names</h2>

      {/* Step 1: Enter the number of names */}
      {showNumberInput ? (
        <div className="mb-4 flex items-center justify-center">
          
          <input
            type="number"
            value={numberOfNames}
            onChange={handleNumberOfNamesChange}
            placeholder="Enter number of names"
            min="0"
            className="border border-gray-300 rounded-md w-1/3 p-2 focus:outline-none focus:border-indigo-500 mr-2 text-center"
          />
          <button
            onClick={() => setShowNumberInput(false)}
            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
          >
            Enter
          </button>
        </div>
      ) : (
        <>
          <p className="flex items-center  mb-6">
  <span>No of Names: {numberOfNames}</span>
  <button
    onClick={() => setShowNumberInput(true)}
    className="text-blue-700 py-2 px-4 rounded-md"
  >
    <Edit size={20} />
  </button>
</p>

{numberOfNames > 0 && (
  <div className="relative">
    {/* Navigation Buttons */}
    <button
      onClick={() => {
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
          sliderRef.current.slickGoTo(currentStep - 1);
        }
      }}
      className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-200 ${currentStep === 0 ? "text-gray-300 cursor-not-allowed" : "text-blue-500 hover:bg-gray-300"}`}
      disabled={currentStep === 0}
    >
      <FaAngleLeft size={20} />
    </button>

    {/* Slider for additional baby names */}
    <Slider {...settings} ref={sliderRef} className="mb-4 ml-11 w-full max-w-[calc(100%-100px)] relative"> {/* Ensure relative positioning */}
      {additionalBabyNames.map((_, index) => (
        <div key={index} className="p-4 flex flex-col items-center">
          {/* Baby Name Input */}
          <label className="w-full mb-4">
            <span className="text-sm font-medium">Baby Name: <span className="text-red-500">*</span></span>
            <input
              type="text"
              value={additionalBabyNames[index].nameEnglish}
              onChange={(e) => handleInputChange(index, 'nameEnglish', e.target.value)}
              required
              className="border border-gray-300 rounded-md w-full max-w-xs p-2 mt-1 focus:outline-none focus:border-indigo-500 text-left"
            />
          </label>

          {/* Meaning Input */}
          <label className="w-full mb-4">
            <span className="text-sm font-medium">Meaning: <span className="text-red-500">*</span></span>
            <input
              type="text"
              value={additionalBabyNames[index].meaning}
              onChange={(e) => handleInputChange(index, 'meaning', e.target.value)}
              required
              className="border border-gray-300 rounded-md w-full max-w-xs p-2 mt-1 focus:outline-none focus:border-indigo-500 text-left"
            />
          </label>
        </div>
      ))}
    </Slider>

    <button
      onClick={() => {
        if (currentStep < numberOfNames - 1) {
          setCurrentStep(currentStep + 1);
          sliderRef.current.slickGoTo(currentStep + 1);
        }
      }}
      className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-200 ${currentStep === numberOfNames - 1 ? "text-gray-300 cursor-not-allowed" : "text-blue-500 hover:bg-gray-300"}`}
      disabled={currentStep === numberOfNames - 1}
    >
      <FaAngleRight size={24} />
    </button>

    {/* Submit Button */}
    {currentStep === numberOfNames - 1 && ( // Only show button on last step
      <button
        onClick={() => {
          const allFilled = additionalBabyNames.every(entry => entry.nameEnglish && entry.meaning);
          if (!allFilled) {
            toast.error('Please fill out all fields before submitting.');
            return;
          }
          handleSubmit();
        }}
        className="bg-blue-300 text-gray-700 py-2 px-4 rounded-md mt-6 hover:bg-blue-400"
      >
        Add
      </button>
    )}
  </div>
)}
        </>
      )}

      
    </div>
  </div>
)}

  </div>

   </div>
  );
};

export default CheckBoxListPage;