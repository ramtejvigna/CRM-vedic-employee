import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CheckBoxListPage from './CheckBoxList';

export const Customers = () => {
    const [customerData, setCustomerData] = useState({
        newRequests: [],
        inProgress: [],
        completed: [],
    });
    const [activeTab, setActiveTab] = useState('New Requests');
    const [selectedCustomer, setSelectedCustomer] = useState(null); // Track selected customer for PDF generation

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
        }
    }, [employeeId]);

    // Move customer from one section to another (trigger backend call)
    const moveCustomer = (customer, fromSection, toSection) => {
        const updatedCustomer = { ...customer };

        // Handle different section moves
        if (toSection === 'inProgress') {
            updatedCustomer.paymentStatus = true; // Moving to In Progress, mark as paid
        } else if (toSection === 'completed') {
            updatedCustomer.pdfGenerated += 1; // Increment PDF count for completed
        } else if (toSection === 'newRequests') {
            updatedCustomer.paymentStatus = false; // Move to New Requests, mark as unpaid
            updatedCustomer.pdfGenerated = 0; // Reset PDF count for new requests
        }

        // Make PUT request to update customer using axios
        axios
            .put(`http://localhost:3000/customers/${customer._id}`, updatedCustomer)
            .then(() => {
                // Update customer data in the frontend
                setCustomerData((prevData) => ({
                    ...prevData,
                    [fromSection]: prevData[fromSection].filter((c) => c._id !== customer._id),
                    [toSection]: [...prevData[toSection], updatedCustomer],
                }));
            })
            .catch((error) => {
                console.error('Error moving customer:', error);
            });
    };

    const handleSelectCustomer = (customer) => {
        if (selectedCustomer && selectedCustomer._id === customer._id) {
          setSelectedCustomer(null); // Deselect if already selected
        } else {
          setSelectedCustomer(customer); // Select the customer
        }
      };

    // Render table content based on activeTab
    const renderTable = (customers, fromSection, nextSection) => (
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border">Select</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Payment Status</th>
                    <th className="py-2 px-4 border">No. of PDFs Generated</th>
                    {fromSection === 'inProgress' && <th className="py-2 px-4 border">Feedback</th>}
                    {fromSection === 'inProgress' && <th className="py-2 px-4 border">Generate PDF</th>}
                </tr>
            </thead>
            <tbody>
                {customers.map((customer) => (
                    <React.Fragment key={customer._id}>
                        <tr>
                            <td className="py-2 px-4 border text-center">
                                {nextSection ? (
                                    <input
                                        type="checkbox"
                                        onChange={() => moveCustomer(customer, fromSection, nextSection)}
                                    />
                                ) : (
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => moveCustomer(customer, 'completed', 'inProgress')}
                                            className="bg-gray-500 text-white px-2 py-1 rounded"
                                        >
                                            Move to In Progress
                                        </button>
                                        <button
                                            onClick={() => moveCustomer(customer, 'completed', 'newRequests')}
                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                        >
                                            Move to New Requests
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="py-2 px-4 border">{customer.username}</td>
                            <td className="py-2 px-4 border">{customer.email}</td>
                            {customer.paymentStatus ? (
                                <td className="py-2 px-4 border">Paid</td>
                            ) : (
                                <td className="py-2 px-4 border">Not Paid</td>
                            )}
                            <td className="py-2 px-4 border">{customer.pdfGenerated}</td>

                            {/* Display the "Feedback" input only for 'In Progress' customers */}
                            {fromSection === 'inProgress' && (
                                <td className="py-2 px-4 border">
                                    <input
                                        type="text"
                                        placeholder="Enter feedback"
                                        onBlur={(e) => {
                                            const feedback = e.target.value;
                                            if (feedback && customer.paymentStatus === true) {
                                                moveCustomer(customer, 'inProgress', 'completed');
                                            }
                                        }}
                                        className="border p-1 w-full"
                                    />
                                </td>
                            )}
                            
                            {fromSection === 'inProgress' && (
                                <td className="py-2 px-4 border">
                                <button
                                    onClick={() => setSelectedCustomer(selectedCustomer === customer._id ? null : customer._id)} 
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    {selectedCustomer === customer._id ? 'Hide PDF Form' : 'Generate PDF'}
                                </button>
                                </td>
                            )}
                            </tr>

                            {/* Show PDF content form below the selected customer row */}
                            {selectedCustomer === customer._id && (
                            <tr>
                                <td colSpan="7">
                                <div className="p-4 bg-gray-100">
                                    {/* Pass the customer to the CheckBoxListPage */}
                                    <CheckBoxListPage selectedCustomer={customer} handleClose={() => setSelectedCustomer(null)} />
                                </div>
                                </td>
                            </tr>
                            )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'New Requests':
                return renderTable(customerData.newRequests, 'newRequests', 'inProgress');
            case 'In progress':
                return renderTable(customerData.inProgress, 'inProgress', 'completed');
            case 'Completed':
                return renderTable(customerData.completed, 'completed', null);
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center p-10 gap-10">
            {/* Tab Buttons */}
            <div className="flex mb-4">
                <button
                    onClick={() => setActiveTab('New Requests')}
                    className={`px-4 py-2 text-sm rounded-l-md ${activeTab === 'New Requests'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                        }`}
                >
                    New Requests
                </button>
                <button
                    onClick={() => setActiveTab('In progress')}
                    className={`px-4 py-2 text-sm ${activeTab === 'In progress'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                        }`}
                >
                    In progress
                </button>
                <button
                    onClick={() => setActiveTab('Completed')}
                    className={`px-4 py-2 text-sm rounded-r-md ${activeTab === 'Completed'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                        }`}
                >
                    Completed
                </button>
            </div>

            {/* Tab Content - Customer Tables */}
            <div className="p-4 bg-white shadow-md w-full max-w-2xl">{renderContent()}</div>
        </div>
    );
};

export default Customers;
