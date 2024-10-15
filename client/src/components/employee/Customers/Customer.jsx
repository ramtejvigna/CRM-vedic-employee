import React, { useEffect, useState, useCallback,useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit } from 'lucide-react';
import axios from 'axios';
import CheckBoxListPage from './CheckBoxList';
import { FaDownload, FaEnvelope , FaStar, FaEye, FaWhatsapp } from "react-icons/fa";
import {format} from "date-fns"
import {handleDownload,handleSendMail,handleSendWhatsApp} from './CheckBoxList';

const Customer = () => {
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pdfsLoading , setPdfsLoading] = useState(false);
    const [pdfContent, setPdfContent] = useState("")
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
    const iframeRef = useRef(null);

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

    useEffect(() => {
        if (pdfBlobUrl) {
          // Convert base64 string to Blob
          const byteCharacters = atob(pdfContent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          
          // Create URL for the Blob and set it in the state
          const blobUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(blobUrl);
        }
      }, [pdfBlobUrl]);
    
    
    useEffect(() => {
        const fetchPdfs = async () => {
          try {
            setPdfsLoading(true);
            const response = await axios.get(`http://localhost:3000/api/generatedpdf?customerId=${customerId}`);
            setPdfs(response.data);
            setPdfsLoading(false);
          } catch (error) {
            console.error('Error fetching PDFs:', error);
          }
        };
    
        if (customerId) {
          fetchPdfs();
        }
      }, [customerId ,pdfContent ]);


      const handleViewClick = (base64Pdf) => {
        setPdfContent(base64Pdf); // Set the PDF content
        
        // Delay scrolling slightly to ensure iframe has rendered
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300); // 300ms delay to allow rendering
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
            .put(`http://localhost:3000/customers/${customer._id}`, updatedCustomer)
            .then(() => {
                setCustomerDetails(updatedCustomer);
            })
            .catch((error) => console.error('Error moving customer:', error));
    };

    const handleAccept = useCallback(() => {
        if (customerDetails) {
            moveCustomer(customerDetails, fromSection, section, feedback);
            setShowEditModal(false);
            if (section === 'inProgress') {
                navigate(-1);
            }
        }
    }, [customerDetails, fromSection, section, feedback]);

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
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h2>
                            <button onClick={() => setShowEditModal(true)} className="text-blue-500 hover:text-blue-700 transition duration-200">
                                <Edit size={20} />
                            </button>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Father's Name:</strong> {customerDetails.fatherName || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Mother's Name:</strong> {customerDetails.motherName || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Email:</strong> {customerDetails.email || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>WhatsApp Number:</strong> {customerDetails.whatsappNumber || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Baby's Gender:</strong> {customerDetails.babyGender || 'N/A'}</p>
                            <hr className='my-2' />
                            <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>payment date:</strong> {customerDetails?.paymentDate || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>payment time:</strong> {customerDetails.paymentTime || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>payment transaction id:</strong> {customerDetails?.payTransactionID || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300 grid grid-cols-2 w-2/3"><strong>Amount paid:</strong> {customerDetails?.amountPaid || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Astrological Details Card */}
                <div className="w-full  bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative overflow-hidden">
                    <div className="absolute inset-0  opacity-30 rounded-lg"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Astrological Details</h2>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
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

                {/* Generated PDFs Card */}
                <div className="w-full col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative overflow-hidden">
                    <div className="absolute inset-0  opacity-30 rounded-lg"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Generated PDFs</h2>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            {pdfsLoading ? (
                                <div className='flex items-center justify-center w-full h-[300px]'>
                                    <div className="rounded-full w-[50px] h-[50px] border border-gray-400 border-t-black animate-spin"></div>
                                </div>
                            ) : (
                                <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-700 ">
                                            <th className="border  border-gray-200 dark:border-gray-700 p-2 text-center">S.No</th>
                                            <th className="border  border-gray-200 dark:border-gray-700 p-2 text-center">pdf</th>
                                            <th className="border border-gray-200 dark:border-gray-700 p-2 text-center">Generated Time/Date</th>
                                            <th className="border border-gray-200 dark:border-gray-700 p-2 text-center">Actions</th>
                                            <th className="border border-gray-200 dark:border-gray-700 p-2 text-center">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pdfs.map((pdf, index) => (
                                            <tr key={pdf.uniqueId} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200">
                                                <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">{index + 1}</td>
                                                <td onClick={() => handleViewClick(pdf.base64Pdf)} className="border border-gray-200 dark:border-gray-700 p-2 cursor-pointer text-center">show</td>
                                                <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                                                    <span>
                                                        {new Date(pdf.createdAt).toLocaleDateString('en-US', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                        })} {" "}
                                                        {new Date(pdf.createdAt).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </td>
                                                <td className="border border-gray-200 dark:border-gray-700 p-2 text-center">
                                                    <button className=" text-blue-700 rounded-lg px-4 py-1 transition duration-200" onClick={() => handleDownload(pdf.base64Pdf, pdf.uniqueId)}> <FaDownload/> </button>
                                                    <button className=" text-green-700 rounded-lg px-4 py-1 transition duration-200" onClick={() => handleSendWhatsApp(pdf.base64Pdf, pdf.uniqueId,customerData.whatsappNumber)}> <FaWhatsapp/> </button>
                                                    <button className=" text-red-700 rounded-lg px-4 py-1 transition duration-200" onClick={() => handleSendMail(pdf.base64Pdf, pdf.uniqueId,customerData.email)}> <FaEnvelope/> </button>
                                                </td>
                                                <td className="border justify-center flex gap-2 border-gray-200 dark:border-gray-700 p-2 text-center">
                                                    <button 
                                                        className="flex items-center text-gray-700 rounded-lg px-4 py-1 bg-gray-200 hover:bg-gray-300 transition duration-200" 
                                                    >
                                                        <FaEye className="mr-2" /> {/* Eye icon */}
                                                        view
                                                    </button>
                                                    <button 
                                                        className="flex items-center text-red-700 rounded-lg px-4 py-1 bg-red-200 hover:bg-red-300 transition duration-200" 
                                                    >
                                                        <FaStar className="mr-2" /> {/* Star icon */}
                                                        edit
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            )}

                        </div>
                    </div>
                </div>


            </div>



                <div className="mt-8">
                    <CheckBoxListPage pdfContent={pdfContent} setPdfContent={setPdfContent} customerData={customerDetails} iframeRef={iframeRef} />
                </div>



                {/* {fromSection === 'inProgress' ? (
                    <div className="w-1/2 mt-10">
                        <h1 className="mb-5 text-lg font-medium">Enter Customer Feedback:</h1>
                        <textarea
                            onChange={(e) => setFeedback(e.target.value)}
                            value={feedback}
                            className="rounded-xl p-2 mb-4 h-1/2 w-full resize-none bg-slate-200 border-none text-lg"
                        />
                        
                        <div className="mt-10">
                            <button onClick={handleAccept} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Confirm
                            </button>
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <></>
                )} */}
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
            <AnimatePresence>
                {pdfBlobUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md    "
                    >
                        <div className="bg-white rounded-md w-[1000px]">
                            <iframe
                                src={pdfBlobUrl}
                                width="100%"
                                height="500px"
                                className="border rounded-lg shadow-lg"
                                title="PDF Viewer"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Customer;