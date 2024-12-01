import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Edit,
    FileText,
    MessageCircle,
    Mail,
    ThumbsUp,
    MoreHorizontal,
    Check,
    X,
    ChevronDown,
    Eye,
    AlertCircle,
    ArrowLeft,
    Star,
    FilePlus2,
} from 'lucide-react';
import axios, { formToJSON } from 'axios';
import { handleDownload, handleSendMail, handleSendWhatsApp } from './CheckBoxList';
import { generatePdf } from './pdfDisplayComponent';
import PDFViewer from './PDFviewer';

import CustomerAstroDetails from './CustomerAstroDetails';

const Customer = () => {
  const [pdfsLoading, setPdfsLoading] = useState(false);
  const location = useLocation();
  const { customerData, section, fromSection } = location.state || {};
  const [customerDetails, setCustomerDetails] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    fatherName: '',
    motherName: '',
    email: '',
    whatsappNumber: '',
    babyGender: ''
  });
  const [pdfs, setPdfs] = useState([]);
  const customerId = customerData?._id;
  const [pdfUrl, setPdfUrl] = useState(null);
  const [enabledRow, setEnabledRow] = useState(null); // State to track which row's buttons are enabled
  const [showViewer, setShowViewer] = useState(false); // State to control PDF viewer visibility
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mailUrl, setMailUrl] = useState(null);
  const [pdfId, setPdfId] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedPdf, setSelectedPdf]=useState(null);




  const toggleDropdown = (pdfId) => {
    setActiveDropdown(activeDropdown === pdfId ? null : pdfId);
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleActionClick = async (action, pdf) => {
    setActiveDropdown(null);
    if (action === 'view') {
      handleShowPdf(pdf.babyNames, pdf.additionalBabyNames);
    } else if (action === 'mail') {
      await handleSetPdfUrl(pdf.babyNames, pdf.additionalBabyNames);
      setPdfId(pdf._id);
    } else if (action === 'whatsapp') {

    } else if (action === 'feedback') {
      if (pdf.whatsappStatus || pdf.mailStatus) {
        // If at least one status is true, show the feedback modal
        setSelectedPdf(pdf); // Store the PDF object
        setShowFeedbackModal(true); // Show the feedback modal
      } else {
        // If both statuses are false, raise a message
        alert("Feedback can only be given if the PDF has been sent via WhatsApp or email.");
      }

    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const getCustomerDetails = async () => {
      if (customerData) {
        setCustomerDetails(customerData);
        setEditData({
          fatherName: customerData.fatherName || '',
          motherName: customerData.motherName || '',
          email: customerData.email || '',
          whatsappNumber: customerData.whatsappNumber || '',
          babyGender: customerData.babyGender || ''
        });
      }
      setLoading(false);
    };
    getCustomerDetails();
  }, [customerData]);

  const fetchPdfs = async () => {
    try {
      setPdfsLoading(true);
      const response = await axios.get(`https://vedic-backend-neon.vercel.app/api/generatedpdf?customerId=${customerId}`);
      if (response.data.length > 0) {
        setPdfs(response.data);
      }
      setPdfsLoading(false);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchPdfs();
    }
  }, [customerId]);




  const handleSetPdfUrl = async (babyNames, additionalBabyNames) => {
    try {
      const generatedPdfUrl = await generatePdf(babyNames, additionalBabyNames);
      setMailUrl(generatedPdfUrl);
    } catch (error) {
      console.error("Error generating PDF URL:", error);
      alert("Error generating PDF URL");
    }
  };

  // Watch for changes to mailUrl and pdfId and send mail if both are available
  useEffect(() => {
    const sendMailAndFetchPdfs = async () => {
      if (mailUrl && pdfId) {
        try {
          await handleSendMail(mailUrl, pdfId, customerData.email);
          await fetchPdfs(); // Re-fetch PDFs after sending mail
        } catch (error) {
          console.error("Error sending mail:", error);
        }
      }
    };

    sendMailAndFetchPdfs();
  }, [mailUrl, pdfId]);

  const handleShowPdf = async (babyNames, additionalBabyNames) => {
    const generatedPdfUrl = await generatePdf(babyNames, additionalBabyNames); // Call the generatePdf function
    setPdfUrl(generatedPdfUrl); // Set the URL state
    setShowViewer(true);
  };

  const handleClose = () => {
    setShowViewer(false); // Hide the PDF viewer
    setPdfUrl(''); // Reset PDF URL
    setEnabledRow(null); // Reset enabled row
  };

  const moveCustomer = (customer, fromSection, toSection, details) => {
    const updatedCustomer = { ...customer, additionalDetails: details };

    if (toSection === 'completed') {
      updatedCustomer.feedback = feedback;
      updatedCustomer.pdfGenerated = generatePdf
        ? customer.pdfGenerated + 1
        : customer.pdfGenerated;
      updatedCustomer.customerStatus = 'completed';
      updatedCustomer.completedOn = new Date();
    }

    axios
      .put(`https://vedic-backend-neon.vercel.app/customers/${customer._id}`, updatedCustomer)
      .then(() => {
        setCustomerDetails(updatedCustomer);
      })
      .catch((error) => console.error('Error moving customer:', error));
  };

  const handleAccept = useCallback(() => {
    if (customerDetails) {
      moveCustomer(customerDetails, fromSection, section, feedback);
      setShowEditModal(false);
      if (section === 'inProgress' || section === 'completed') {
        navigate(-1);
      }
    }
  }, [customerDetails, fromSection, section, feedback]);
  const confirmMoveToCompleted = () => {
    handleAccept();
    setShowConfirmModal(false); // Close modal
    // Place your action code here

  };

  const handleSubmitFeedback = async () => {
    if (selectedRating > 0 && selectedPdf) {
      console.log(selectedRating,selectedPdf._id);
      try {
        // Send pdfId and rating in the body of the PUT request
        const response = await axios.put(
          `https://vedic-backend-neon.vercel.app/api/feedback`, // No need to pass pdfId in the URL
          {
            pdfId: selectedPdf._id,  // Pass the pdfId in the body
            rating: selectedRating,   // Pass the selected rating
          }
        );        
        // Reset form and close modal
        setSelectedRating(0);
        setShowFeedbackModal(false);
      } catch (error) {
        console.error('Error submitting feedback:', error.message);
        alert('An error occurred while submitting feedback.');
      }
    } else {
      alert('Please select a rating');
    }
  };

  const handleNavigate = () => {
    navigate("generate-pdf", {
      state: {
        customerDetails,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!customerDetails) {
    return <div className="text-center mt-10">No customer details found.</div>;
  }

  return (

    <div className="min-h-screen p-4 sm:p-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-900 hover:text-blue-500"
        >
          <ArrowLeft size={20} className="mr-2" /> {/* Back arrow icon */}
        </button>
        <h2 className="text-lg font-semibold">Customer Details</h2>

      </div>

      <div className="flex justify-between items-center mb-4">
    <p className="text-2xl font-medium ml-4">{customerDetails.customerName
    }</p>
    {customerDetails.customerStatus !== 'completed' && (
        <button
            onClick={() => setShowConfirmModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
        >
            Move to Completed
        </button>
    )}
</div>

  <div className="bg-white rounded-xl shadow-lg p-6 mb-4  flex flex-col">
  {/* Customer Name in Large Font */}

  {showConfirmModal && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
            <p className="mb-6">Are you sure you want to move this Customer to completed?</p>
            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => setShowConfirmModal(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                    Cancel
                </button>
                <button
                    onClick={confirmMoveToCompleted}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Confirm
                </button>
            </div>
      </div>
    </div>
)}
  
{/* Bordered Box around Customer Info */}
<h2 className="text-lg font-semibold mb-4">Customer Summary</h2>

        {/* Grid Layout for Customer Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 ">
          {[
            { label: "customer Id", value: customerDetails.customerID },
            { label: "date Joined", value: new Date(customerDetails.createdDateTime).toLocaleDateString() },
            { label: "Contact No", value: customerDetails.whatsappNumber },
            { label: "Email", value: customerDetails.email }
          ].map((item, index) => (
            <div key={index} className="flex flex-col">

              {/* Label with Full-width HR Line */}
              <p className="text-sm font-bold text-gray-500 capitalize">{item.label}</p>
              <hr className="my-3 border-gray-300 w-full" />

              {/* Value with Full-width HR Line */}
              <p className=" text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baby Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4  flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Baby Details</h2>
          <hr className="my-3 border-gray-300 w-full" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Gender:</p>
              <p className="mt-1 text-gray-900">{customerDetails.babyGender || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Place of Birth:</p>
              <p className="mt-1 text-gray-900">{customerDetails.birthplace || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth:</p>
              <p className="mt-1 text-gray-900">
                {customerDetails.babyBirthDate
                  ? new Date(customerDetails.babyBirthDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Time of Birth:</p>
              <p className="mt-1 text-gray-900">{customerDetails.babyBirthTime || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mother's Name:</p>
              <p className="mt-1 text-gray-900">{customerDetails.motherName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Father's Name:</p>
              <p className="mt-1 text-gray-900">{customerDetails.fatherName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Preferred Starting Letter:</p>
              <p className="mt-1 text-gray-900">{customerDetails.preferredStartingLetter || "N/A"}</p>
            </div>

            {/* Horizontal Line */}
            <div className="col-span-2 my-4">
        <hr className="border-t border-gray-200" />
      </div>
      <CustomerAstroDetails customerId={customerId} />
    </div>
        </div>
        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Data Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4 flex flex-col">
            <h2 className="text-lg font-medium mb-4">Payment Data</h2>
            <hr className="my-3 border-gray-300 w-full" />

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Date</p>
                    <p className="mt-1">{customerDetails?.paymentDate ? new Date(customerDetails.paymentDate).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Time</p>
                    <p className="mt-1">{customerDetails?.paymentTime || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Astro Offer</p>
                    <p className="mt-1">{customerDetails?.offer || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Source (Instagram Lead)</p>
                    <p className="mt-1">{customerDetails?.otherSource || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 mb-4 flex flex-col overflow-y-auto relative" style={{ height: '420px' }} ><div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">PDFs Generated</h2>
    {(customerDetails.customerStatus === 'inProgress' || customerDetails.customerStatus === 'inWorking') && (
      <button
        onClick={handleNavigate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        <FilePlus2 />
      </button>
    )}
    
  </div> 
   <div className="overflow-visible"> {/* Changed this to allow dropdowns to overflow */}
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-2 text-gray-500 text-left">PDF</th>
          <th className="px-4 py-2 text-gray-500 text-left">Generated</th>
          <th className="px-4 py-2 text-center">
            <MessageCircle className="inline h-4 w-4" />
          </th>
          <th className="px-4 py-2 text-center">
            <Mail className="inline h-4 w-4" />
          </th>
          <th className="px-4 py-2 text-gray-500 text-center">Feedback</th>
          <th className="px-4 py-2 text-gray-500 text-center">Actions</th>
        </tr>
      </thead>
      
      <tbody>
        {pdfs.map((pdf) => (
          <tr key={pdf._id} className="border-b">
            <td className="px-4 py-2">
              <button onClick={() => handleShowPdf(pdf.babyNames, pdf._id)}>
                <FileText className="h-4 w-4 text-blue-600" />
              </button>
            </td>
            <td className="px-4 py-2">
              <div className="flex flex-col">
                <span className="text-sm">{new Date(pdf.createdAt).toLocaleDateString()}</span>
                <span className="text-xs text-gray-500">
                  {new Date(pdf.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </td>
            <td className="px-4 py-2 text-center">
              <div className={`h-3 w-3 rounded-full ${pdf.whatsappStatus ? 'bg-green-500' : 'bg-red-500'} mx-auto`} />
            </td>
            <td className="px-4 py-2 text-center">
              <div className={`h-3 w-3 rounded-full ${pdf.mailStatus ? 'bg-green-500' : 'bg-red-500'} mx-auto`} />
            </td>
            <td className="px-4 py-2 text-center">
              <span className="text-sm font-medium">
                {pdf.rating === 0
                  ? "-"
                  : pdf.rating === 5
                  ? "Outstanding"
                  : pdf.rating === 4
                  ? "Good"
                  : pdf.rating === 3
                  ? "Satisfactory"
                  : pdf.rating === 2
                  ? "Needs Improvement"
                  : "Poor"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right relative">
              <div className="flex items-center justify-end space-x-2">
             <div className="relative">
    <button
        onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(pdf._id);
        }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
    >
        <MoreHorizontal className="h-5 w-5" />
    </button>

    {activeDropdown === pdf._id && (
        <div
            className="absolute right-0 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
            style={{
                bottom: '-80%',
                right: '90%',
                marginBottom: '0.5rem',
            }}
        >
            {[
                { icon: FileText, label: 'View PDF', action: 'view' },
                { icon: MessageCircle, label: 'Send to WhatsApp', action: 'whatsapp' },
                { icon: Mail, label: 'Send to Mail', action: 'mail' },
                ...(pdf.rating === 0 ? [{ icon: ThumbsUp, label: 'Give Feedback', action: 'feedback' }] : []),
            ].map((item, i) => (
                <button
                    key={i}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(item.action, pdf);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    )}
</div>

              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
            </div>
          </div>
      
            <div className="mt-8">
            {showViewer && (
                <PDFViewer
                    pdfUrl={pdfUrl}
                    handleDownload={handleDownload}
                    handleSendMail={handleSendMail}
                    email={customerDetails.email}
                    enabledRow={enabledRow}
                    pdfId={enabledRow}
                    onClose={handleClose} // Pass the close handler
                />
            )}
        </div>

        {showFeedbackModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-80 text-center relative">
    <button
        onClick={() => { setShowFeedbackModal(false); setSelectedRating(0); }}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1"
      >
        ✖
      </button>
      <h2 className="text-xl font-semibold mb-4">Feedback For Pdf</h2>
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-3xl ${star <= selectedRating ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>
      <div>
        <button
          onClick={handleSubmitFeedback}
          className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 w-full hover:bg-blue-600"
        >
          Submit
        </button>
        {/* Close icon */}
      
      </div>
    </div>
  </div>
)}
    
    </div>
    );
};

export default Customer;