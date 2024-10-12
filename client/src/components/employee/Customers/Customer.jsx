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
    const { customerData, section } = location.state || {};
    const [customerDetails, setCustomerDetails] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getCustomerDetails = async () => {
            setCustomerDetails(customerData);
            console.log(customerData)
            setLoading(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { isDarkMode } = useStore();

    useEffect(() => {
        const getCustomerDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/customers/getCustomerDetails/${fatherName}`);
                console.log(response.data)
                setCustomerDetails(response.data);

                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching customer details');
                setLoading(false);
            }
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

    if (!customerDetails) {
        return <div className="text-center mt-10">No customer details found.</div>;
    }

    return (
        <div className={`min-h-screen p-4 sm:p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Customer Details</h1>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Profile Card */}
                    <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h2>
                            <div className="flex space-x-2">
                                <button onClick={() => setShowEditModal(true)} className="text-blue-500 hover:text-blue-700">
                                    <Edit size={20} />
                                </button>
                                <button onClick={() => setShowDeleteModal(true)} className="text-red-500 hover:text-red-700">
                                    <Delete size={20} />
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

                    {/* Generated PDFs Card */}
                    <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Generated PDFs</h2>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            {pdfs.map((pdf, index) => (
                                <div key={index} className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-300"><strong>{new Date(pdf.createdAt).toLocaleDateString()}</strong></p>
                                        <p className="text-gray-600 dark:text-gray-300">#{pdf.uniqueId}</p>
                                    </div>
                                    <button onClick={() => viewPdf(pdf.base64Pdf)} className="text-blue-500 hover:text-blue-700">
                                        <FileText size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-8">
                    {/* Assigned Employee Card */}
                    <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Assigned Employee</h2>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            {customerDetails.assignedEmployee ? (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Name:</strong> {customerDetails.assignedEmployee.name}</p>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Email:</strong> {customerDetails.assignedEmployee.email}</p>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Contact:</strong> {customerDetails.assignedEmployee.phone}</p>
                                    <p className="text-gray-600 dark:text-gray-300"><strong>Created At:</strong> {new Date(customerDetails.createdDateTime).toLocaleString()}</p>
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300">No employee assigned.</p>
                            )}
                        </div>
                    </div>

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

            {/* Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
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
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Delete Customer</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this customer?</p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
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
