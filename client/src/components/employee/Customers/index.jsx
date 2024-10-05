import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const Customers = () => {
    const [customerData, setCustomerData] = useState({
        newRequests: [],
        inProgress: [],
        completed: [],
    });
    const [activeTab, setActiveTab] = useState('New Requests');

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
                </tr>
            </thead>
            <tbody>
                {customers.map((customer) => (
                    <tr key={customer._id}>
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
                        {fromSection === 'inProgress' && (
                            <td className="py-2 px-4 border">
                                <input
                                    type="text"
                                    placeholder="Enter feedback"
                                    onBlur={(e) => {
                                        const feedback = e.target.value;
                                        if (feedback && customer.paymentStatus === 'Paid') {
                                            moveCustomer(customer, 'inProgress', 'completed');
                                        }
                                    }}
                                    className="border p-1 w-full"
                                />
                            </td>
                        )}
                    </tr>
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
