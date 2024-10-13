import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit } from 'lucide-react';
import axios from 'axios';
import CheckBoxListPage from './CheckBoxList';

const Customer = () => {
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
                <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Customer Details</h1>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h2>
                            <button onClick={() => setShowEditModal(true)} className="text-blue-500 hover:text-blue-700">
                                <Edit size={20} />
                            </button>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <p className="text-gray-600 dark:text-gray-300"><strong>Father's Name:</strong> {customerDetails.fatherName || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300"><strong>Mother's Name:</strong> {customerDetails.motherName || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300"><strong>Email:</strong> {customerDetails.email || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300"><strong>WhatsApp Number:</strong> {customerDetails.whatsappNumber || 'N/A'}</p>
                            <p className="text-gray-600 dark:text-gray-300"><strong>Baby's Gender:</strong> {customerDetails.babyGender || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-8">
                    <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
                <div className="mt-8">
            <CheckBoxListPage customerData={customerDetails} />
            </div>
                {fromSection === 'inProgress' ? (
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
