import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Divider,
    CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Delete, FileText } from 'lucide-react';
import { useStore } from "../../../store"; // Assuming you have a store for dark mode

const Customer = () => {
    const location = useLocation();
    const { customerData, section, fromSection } = location.state || {};
    const [customerDetails, setCustomerDetails] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getCustomerDetails = async () => {
            setCustomerDetails(customerData);
            setLoading(false);
        };


        getCustomerDetails();
    }, [customerData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleEdit = () => {
        console.log("Edit customer");
        setShowEditModal(false);
    };

    const handleAccept = useCallback(() => {
        if (customerData) {
            moveCustomer(
                customerData,
                fromSection, // From section
                section, // To section
                details
            );
            setShowModal(false); // Close modal
        }
    }, []);

    if (!customerDetails) {
        return <div className="text-center mt-10">No customer details found.</div>;
    }

    return (
        <div className={`min-h-screen p-4 sm:p-8`}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Customer Details</h1>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Profile Card */}
                    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h2>
                            <div className="flex space-x-2">
                                <button onClick={() => setShowEditModal(true)} className="text-blue-500 hover:text-blue-700">
                                    <Edit size={20} />
                                </button>
                            </div>
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
                    {/* Astrological Details Card */}
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
                    <div className='w-1/2'>
                        <h1 className='mb-5 text-lg font-medium'>Enter Customer Feedback : </h1>
                        <textarea
                            onChange={(e) => setFeedback(e.target.value)}
                            className="rounded-xl p-2 mb-4 h-1/2 w-full resize-none bg-slate-200 border-none text-lg"
                        />
                        <button
                            className="p-2 px-4 bg-blue-500 text-white rounded-lg"
                            onClick={() => {
                                navigate('generate-pdf', {
                                    state: {
                                        customerData: customerData
                                    },
                                })
                            }}
                        >
                            Generate PDF
                        </button>
                        <div className='mt-10'>
                            <button
                                onClick={handleAccept}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Confirm
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Edit Customer</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Father's Name"
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Mother's Name"
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="WhatsApp Number"
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Baby's Gender"
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mt-10 flex justify-end space-x-2">
                                <button
                                    onClick={handleEdit}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Customer;
