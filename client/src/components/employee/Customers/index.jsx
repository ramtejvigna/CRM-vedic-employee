import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { TextField, Button, MenuItem } from "@mui/material";
import CheckBoxListPage from './CheckBoxList';
import { select } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';


export const Customers = () => {
    const [customerData, setCustomerData] = useState({});
    const [activeTab, setActiveTab] = useState('newRequests');
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [nextSection, setNextSection] = useState('');
    const [details, setDetails] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(false); // For new requests
    const [feedback, setFeedback] = useState(''); // For inProgress
    const [generatePdf, setGeneratePdf] = useState(false); // For PDF generation
    const [paymentDate, setPaymentDate] = useState();
    const [paymentTime, setPaymentTime] = useState();
    const [amountPaid, setAmountPaid] = useState();
    const [transactionId, setTransactionId] = useState()
    const [showCheckBoxList, setShowCheckBoxList] = useState(false);
    const navigate = useNavigate();


    // Get employeeId from cookies
    const employeeId = Cookies.get('employeeId');

    // Fetch customer data from backend
    useEffect(() => {
        if (employeeId) {
            axios
                .get(`http://localhost:3000/customers/employees/${employeeId}/customers`)
                .then((response) => {
                    setCustomerData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching customer data:', error);
                });
        } else {
            console.error('Employee ID not found in cookies');
            return;
        }
    }, [employeeId]);

    const overlayStyle = {
        position: 'absolute', // Or 'fixed' depending on your needs
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 999, // High value to ensure it appears above other elements
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: for dimming the background
    };

    const handleGeneratePdfClick = (customer) => {
        setSelectedCustomer(customer); // Set the selected customer data
        setShowCheckBoxList(true); // Show the modal
    };
    const handleClose = () => {
        setShowCheckBoxList(false); // Hide the modal when close button is clicked
    };


    // Move customer from one section to another (trigger backend call)
    const moveCustomer = (customer, fromSection, toSection, details) => {
        const updatedCustomer = { ...customer, additionalDetails: details };

        // Handle different section moves
        if (toSection === 'inProgress') {
            updatedCustomer.paymentStatus = paymentStatus; // Payment status for new requests
            updatedCustomer.customerStatus = 'inProgress';
            updatedCustomer.paymentDate = paymentDate;
            updatedCustomer.paymentTime = paymentTime;
            updatedCustomer.amountPaid = amountPaid;
            updatedCustomer.transactionId = transactionId;
            console.log('Updated customer data:', updatedCustomer);
        } else if (toSection === 'completed') {
            updatedCustomer.feedback = feedback; // Adding feedback for completed
            updatedCustomer.pdfGenerated = generatePdf ? customer.pdfGenerated + 1 : customer.pdfGenerated; // Increment PDF count if generated
            updatedCustomer.customerStatus = 'completed';
        } else if (toSection === 'newRequests') {
            updatedCustomer.feedback = '';
            updatedCustomer.pdfGenerated = 0;
            updatedCustomer.paymentStatus = paymentStatus;
            updatedCustomer.customerStatus = 'newRequests';
        } else if (toSection === 'rejected') {
            updatedCustomer.customerStatus = 'rejected'; // Set the status to rejected
        }

        // Update customer data based on the section
        setCustomerData((prevData) => {
            // Remove customer from fromSection
            const updatedFromSection = prevData[fromSection].filter(
                (c) => c._id !== customer._id
            );

            // Add customer to toSection
            return {
                ...prevData,
                [fromSection]: updatedFromSection,
                [toSection]: [...prevData[toSection], updatedCustomer],
            };
        });


        // Make the API call to update the customer in the backend
        axios
            .put(`http://localhost:3000/customers/${customer._id}`, updatedCustomer)
            .catch((error) => {
                console.error('Error moving customer:', error);
            });
    };

    const handleAccept = useCallback(() => {
        if (selectedCustomer) {
            if (paymentDate && paymentTime) {
                setPaymentStatus(true);
            } else {
                setPaymentStatus(false);
            }

            moveCustomer(
                selectedCustomer,
                activeTab, // From section
                nextSection, // To section
                details
            );
            setShowModal(false); // Close modal
        }
    }, [selectedCustomer, paymentDate, paymentTime, nextSection, details, activeTab, amountPaid, transactionId, paymentStatus]);


    // Render table content based on customerStatus
    const renderTable = (customers, fromSection, nextSection) => (
        <>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Father Name</th>
                        <th className="py-2 px-4 border">Mother Name</th>
                        <th className="py-2 px-4 border">W/A number</th>
                        <th className="py-2 px-4 border">Baby Gender</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer._id}>
                            <td className="text-center border">{customer.fatherName}</td>
                            <td className="text-center border">{customer.motherName}</td>
                            <td className="text-center border">{customer.whatsappNumber}</td>
                            <td className="text-center border">{customer.babyGender}</td>
                            <td className="text-center border flex flex-row justify-around p-3">
                                {(fromSection === 'newRequests' || fromSection === 'rejected') && (
                                    <button
                                        className={`p-2 px-4 bg-green-500 bg-opacity-80 rounded-lg
                                        ${fromSection === 'completed' && 'hidden'}`}
                                        onClick={() => {
                                            setSelectedCustomer(customer); // Set customer for modal
                                            setNextSection(nextSection); // Set target section
                                            setShowModal(true); // Show modal
                                            if (fromSection === 'newRequests') {
                                                setPaymentStatus(false); // Reset payment status
                                            }
                                        }}
                                    >
                                        Accept
                                    </button>
                                )}
                                {(fromSection !== 'newRequests' && fromSection !== 'rejected') && (
                                    <button
                                        className={`p-2 bg-black px-4 text-white rounded-lg`}
                                        onClick={() => {
                                            setSelectedCustomer(customer); // Set customer for modal
                                            setNextSection(nextSection); // Set target section
                                            (fromSection !== 'inProgress' ? (
                                                setShowModal(true)
                                            ) : (
                                                navigate('viewDetailsIn', {
                                                    state: {
                                                        customerData: customer, // Pass customer data
                                                        section: nextSection    // Pass section info
                                                    }
                                                })
                                            ))
                                        }}
                                    >
                                        View
                                    </button>
                                )}
                                {fromSection === 'newRequests' && (
                                    <button
                                        className='p-2 px-4 bg-red-500 bg-opacity-80 rounded-lg'
                                        onClick={() => moveCustomer(customer, fromSection, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                )}
                            </td>

                            {showCheckBoxList && (
                                <div style={overlayStyle}>
                                    <CheckBoxListPage
                                        selectedCustomer={selectedCustomer}
                                        handleClose={handleClose}
                                    />
                                </div>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {customers.length == 0 && (
                <div className='text-center p-4 py-8'>
                    <h1 className='text-xl'>No customers available in this section</h1>
                </div>
            )}
        </>
    );

    // Render content based on activeTab and customerStatus
    const renderContent = () => {
        const filteredCustomers = Array.isArray(customerData[activeTab])
            ? customerData[activeTab]
            : [];
        switch (activeTab) {
            case 'newRequests':
                return renderTable(filteredCustomers, 'newRequests', 'inProgress');
            case 'inProgress':
                return renderTable(filteredCustomers, 'inProgress', 'completed');
            case 'completed':
                return renderTable(filteredCustomers, 'completed', 'inProgress'); // Allow moving back to 'In Progress'
            case 'rejected':
                return renderTable(filteredCustomers, 'rejected', 'newRequests');
            default:
                return null;
        }
    };

    // Calculate new requests count
    const newRequestsCount = Array.isArray(customerData['newRequests'])
        ? customerData['newRequests'].length
        : 0;


    return (
        <div className="flex flex-col items-center p-10 gap-10">
            {/* Tab Buttons */}
            <div className="flex mb-4 gap-5">
                {['newRequests', 'inProgress', 'completed', 'rejected'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-4 py-2 text-sm rounded-lg ${activeTab === tab
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                        {tab === 'newRequests' && newRequestsCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white p-1 px-2 rounded-full">
                                {newRequestsCount}
                            </span>
                        )}
                    </button>

                ))}
            </div>

            {/* Tab Content - Customer Tables */}
            <div className="bg-white shadow-md w-full py-10 rounded-xl">
                {renderContent()}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                        <div className='flex flex-row justify-between'>
                            {selectedCustomer.fatherName && (
                                <h2 className="text-lg font-semibold">
                                    Father Name : {selectedCustomer?.fatherName}
                                </h2>
                            )}
                            {selectedCustomer.motherName && (
                                <h2 className='text-lg font-semibold'>
                                    Mother Name : {selectedCustomer?.motherName}
                                </h2>
                            )}
                        </div>
                        {activeTab === 'newRequests' && (
                            <div>
                                <div>
                                    <TextField
                                        label="Payment Date"
                                        name="paymentDate"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        type="date"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        label="Payment Time"
                                        name="paymentTime"
                                        value={paymentTime}
                                        onChange={(e) => setPaymentTime(e.target.value)}
                                        type="time"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        label="Amount Paid"
                                        name="amountPaid"
                                        value={amountPaid}
                                        onChange={(e) => setAmountPaid(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <TextField
                                        label="Transaction ID"
                                        name="transactionId"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </div>
                            </div>
                        )}
                        {activeTab === 'inProgress' && (
                            <>
                                <div>
                                    <p>{selectedCustomer.email}</p>
                                    <p>
                                        Payment Date & Time: {new Date(selectedCustomer.paymentDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })} - {selectedCustomer.paymentTime}
                                    </p>
                                    <p>Preferred God : {selectedCustomer.preferredGod}</p>
                                    <p>PDF's Generated - {selectedCustomer.pdfGenerated}</p>
                                    <label className="block my-2 mt-4">Feedback</label>
                                    <textarea
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="border border-gray-300 h-20 rounded-xl p-2 mb-4 w-full resize-none"
                                    />
                                    <button
                                        className="p-2 px-4 bg-blue-500 text-white rounded-lg"
                                        onClick={() => {
                                            setSelectedCustomer(selectedCustomer); // Set selected customer correctly
                                            setShowCheckBoxList(true);
                                        }}
                                    >
                                        Generate PDF
                                    </button>
                                </div>
                            </>
                        )}
                        {activeTab === 'completed' && (
                            <>
                                <p>{selectedCustomer.email}</p>
                                <p>
                                    Payment Date & Time: {new Date(selectedCustomer.paymentDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })} - {selectedCustomer.paymentTime}
                                </p>
                                <p>Preferred God : {selectedCustomer.preferredGod}</p>
                                <p>Given Feedback : {selectedCustomer.feedback}</p>
                                <button
                                    className="p-2 px-4 bg-yellow-500 bg-opacity-80 rounded-lg my-10"
                                    onClick={() => moveCustomer(selectedCustomer, 'completed', 'inProgress')}
                                >
                                    Move to In Progress
                                </button>
                            </>
                        )}

                        <div className='mt-10'>
                            <button
                                onClick={handleAccept}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
