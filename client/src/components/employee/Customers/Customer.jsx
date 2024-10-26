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
    AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { handleDownload, handleSendMail, handleSendWhatsApp } from './CheckBoxList';
import { generatePdf } from './pdfDisplayComponent';
import PDFViewer from './PDFviewer';



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
    const [mailUrl,setMailUrl]=useState(null);
    const [pdfId, setPdfId] = useState(null);

    
   
    
    const handleActionClick = async (action, pdf) => {
        setActiveDropdown(null);
        if (action === 'view') {
            handleShowPdf(pdf.babyNames,pdf.additionalBabyNames );
        } else if (action === 'mail') {
            await handleSetPdfUrl(pdf.babyNames,pdf.additionalBabyNames);
            setPdfId(pdf._id);
        } else if (action === 'whatsapp') {

        } else if (action === 'feedback') {

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

    const refreshPdfs = useCallback(async () => {
        try {
            setPdfsLoading(true);
            const response = await axios.get(`https://vedic-backend-neon.vercel.app/api/generatedpdf?customerId=${customerId}`);
            if (response.data.length > 0) {
                setPdfs(response.data);
            }
            setPdfsLoading(false);
        } catch (error) {
            console.error('Error fetching PDFs:', error);
            setPdfsLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        if (customerId) {
            refreshPdfs();
        }
    }, [customerId, refreshPdfs]);


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
        if (mailUrl && pdfId) {
          handleSendMail(mailUrl, pdfId, customerData.email);
        }
      }, [mailUrl, pdfId]);


    const handleShowPdf = async (babyNames,additionalBabyNames ) => {
        const generatedPdfUrl = await generatePdf(babyNames,additionalBabyNames); // Call the generatePdf function
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

        if (toSection === 'inProgress') {
            updatedCustomer.paymentStatus = paymentStatus;
            updatedCustomer.customerStatus = 'inProgress';
            updatedCustomer.paymentDate = paymentDate;
            updatedCustomer.paymentTime = paymentTime;
            updatedCustomer.amountPaid = amountPaid;
            updatedCustomer.transactionId = transactionId;
        } else if (toSection === 'completed') {
            updatedCustomer.feedback = feedback;
            updatedCustomer.pdfGenerated = generatePdf
                ? customer.pdfGenerated + 1
                : customer.pdfGenerated;
            updatedCustomer.customerStatus = 'completed';
        } else if (toSection === 'newRequests') {
            updatedCustomer.feedback = '';
            updatedCustomer.pdfGenerated = 0;
            updatedCustomer.paymentStatus = paymentStatus;
            updatedCustomer.customerStatus = 'newRequests';
        } else if (toSection === 'rejected') {
            updatedCustomer.customerStatus = 'rejected';
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

    const handleNavigate = () => {
        navigate("generate-pdf", {
            state: {
                customerData
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
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 gap-5 ">

                    {/* Profile Card */}
                    <div className="w-full  bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative overflow-hidden">
                        <div className="absolute inset-0  opacity-30 rounded-lg"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Profile</h2>
                                <button onClick={() => setShowEditModal(true)} className="text-blue-500 hover:text-blue-700 transition duration-200">
                                    <Edit size={20} />
                                </button>
                            </div>
                            <div className="border-t border-gray-200 flex flex-col gap-1 dark:border-gray-700 pt-4">
                                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Customer ID :</strong> {customerDetails.customerID || 'N/A'}</p>
                                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Father's Name:</strong> {customerDetails.fatherName || 'N/A'}</p>
                                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Mother's Name:</strong> {customerDetails.motherName || 'N/A'}</p>
                                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Email:</strong> {customerDetails.email || 'N/A'}</p>
                                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>WhatsApp Number:</strong> {customerDetails.whatsappNumber || 'N/A'}</p>
                                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Baby's Gender:</strong> {customerDetails.babyGender || 'N/A'}</p>
                                <hr className='my-2' />
                                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3">
                                    <strong>Payment Date:</strong> {customerDetails?.paymentDate ? new Date(customerDetails.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                </p>

                                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Payment Time:</strong> {customerDetails.paymentTime || 'N/A'}</p>
                                <p className="text-gray-600 dark:text-gray-300"><strong className='mr-1'>Payment Transaction ID:</strong> {customerDetails?.payTransactionID || 'N/A'}</p>
                                <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Amount paid:</strong> {customerDetails?.amountPaid || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Astrological Details Card */}
                    <div className="w-full  bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative overflow-hidden">
                        <div className="absolute inset-0  opacity-30 rounded-lg"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Astrological Details</h2>
                            <div className="border-t flex flex-col gap-3 border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-gray-600 dark:text-gray-300"><strong>Zodiac Sign:</strong> Leo</p>
                                <p className="text-gray-600 dark:text-gray-300"><strong>Nakshatra:</strong> Ashwini</p>
                                <p className="text-gray-600 dark:text-gray-300"><strong>Destiny Number:</strong> 5</p>
                                <p className="text-gray-600 dark:text-gray-300"><strong>Gemstone:</strong> Ruby</p>
                                <p className="text-gray-600 dark:text-gray-300"><strong>Lucky Metal:</strong> Gold</p>
                                <p className="text-gray-600 dark:text-gray-300"><strong>Numerology:</strong> 3</p>
                                <p className="text-gray-600 dark:text-gray-300"><strong>Preferred Starting Letter:</strong> A</p>
                                <p className="text-gray-600 dark:text-gray-300"><strong>Suggested Baby Names:</strong> Aryan, Aadhya</p>
                            </div>
                        </div>
                    </div>
                </div>
                {fromSection === 'inProgress' ? (
                    <>
                        <div className="flex justify-between items-center my-10">
                            <button
                                onClick={handleNavigate}
                                className={`bg-blue-500 text-white px-4 py-2 rounded `}
                                
                                >
                                Generate Pdf
                                </button>
                                </div>
                    </>
                            ) : (
                    <></>
                )}
                                      
                {/* Generated PDFs Card */}
                <div className="w-full bg-white mt-10 dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex w-full items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Generated PDFs</h2>
                        <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{pdfs.length} PDFs Generated</span>
                        </div>
                    </div>

                    {pdfsLoading ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <div className="relative w-16 h-16">
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            SNo.
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Generated Time/Date
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {pdfs.map((pdf, index) => (
                                        <React.Fragment key={pdf._id}>
                                            <tr
                                                className={`group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer
                      ${expandedRow === pdf._id ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                                                onClick={() => setExpandedRow(expandedRow === pdf._id ? null : pdf._id)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{index + 1}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {new Date(pdf.createdAt).toLocaleDateString('en-US', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(pdf.createdAt).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center space-x-4">
                                                        <div className="flex items-center space-x-2">
                                                            <div className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-300 
                            ${pdf.whatsappStatus ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                                                {pdf.whatsappStatus ? (
                                                                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                                ) : (
                                                                    <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-500">WhatsApp</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <div className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-300 
                            ${pdf.mailStatus ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                                                {pdf.mailStatus ? (
                                                                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                                ) : (
                                                                    <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-500">Email</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveDropdown(activeDropdown === pdf._id ? null : pdf._id);
                                                                }}
                                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                                                            >
                                                                <MoreHorizontal className="h-5 w-5" />
                                                            </button>

                                                            {activeDropdown === pdf._id && (
                                                                <>
                                                                    <div
                                                                        className="fixed inset-0 z-10"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActiveDropdown(null);
                                                                        }}
                                                                    />
                                                                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 animate-in slide-in-from-top-2 duration-200">
                                                                        {[
                                                                            { icon: FileText, label: 'View PDF', action: 'view' },
                                                                            { icon: MessageCircle, label: 'Send to WhatsApp', action: 'whatsapp' },
                                                                            { icon: Mail, label: 'Send to Mail', action: 'mail' },
                                                                            { icon: ThumbsUp, label: 'Give Feedback', action: 'feedback' },
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
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>


                {fromSection === 'inProgress' ? (
                    <>
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
                        <div className="mt-8">
                            {showViewer && (
                                <PDFViewer
                                    pdfUrl={pdfUrl}
                                    handleDownload={handleDownload}
                                    handleSendMail={handleSendMail}
                                    email={customerData.email}
                                    enabledRow={enabledRow}
                                    pdfId={enabledRow}
                                    onClose={handleClose} // Pass the close handler
                                />
                            )}
                        </div>
                        <div className="w-1/2 mt-10">

                            <div className="mt-10">
                                <button onClick={()=>{setShowConfirmModal(true)}} className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Move To Completed
                                </button>
                                
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>

            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Edit Customer Details</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">Father's Name</label>
                                <input
                                    type="text"
                                    value={editData.fatherName}
                                    onChange={(e) => setEditData({ ...editData, fatherName: e.target.value })}
                                    className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">Mother's Name</label>
                                <input
                                    type="text"
                                    value={editData.motherName}
                                    onChange={(e) => setEditData({ ...editData, motherName: e.target.value })}
                                    className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">WhatsApp Number</label>
                                <input
                                    type="text"
                                    value={editData.whatsappNumber}
                                    onChange={(e) => setEditData({ ...editData, whatsappNumber: e.target.value })}
                                    className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">Baby's Gender</label>
                                <input
                                    type="text"
                                    value={editData.babyGender}
                                    onChange={(e) => setEditData({ ...editData, babyGender: e.target.value })}
                                    className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded"
                                />
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setCustomerDetails({
                                            ...customerDetails,
                                            ...editData,
                                        });
                                        setShowEditModal(false);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
        </div>
    );
};

export default Customer;