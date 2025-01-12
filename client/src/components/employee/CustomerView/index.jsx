import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Cookies from "js-cookie";

function CustomerTable() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const employeeId = Cookies.get('employeeId');
    
    // Fetch customers from the backend
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                console.log(employeeId);
                const response = await axios.get(`http://localhost:9000/customers/assigned/${employeeId}`); // Adjust API endpoint as necessary
                const filteredCustomers = response.data.data.filter(
                    (customer) => customer.customerStatus !== 'newRequests'  &&
                        customer.customerStatus !== 'rejected'
                );
                setCustomers(filteredCustomers);                setLoading(false);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);
    
    const renderStatusIcon = (status) => {
        return status ? (
            <div className="flex justify-center items-center">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                    ✓
                </span>
            </div>
        ) : (
            <div className="flex justify-center items-center">
                <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                    ✗
                </span>
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">Customer List</h1>
            
            <div className="overflow-x-auto p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-xl"
            >
                <table className="min-w-full divide-y min-h-full divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                'Customer ID',
                                'Payment Name',
                                'Instagram Name',
                                'Payment Date',
                                'Pdfs Generated',
                                'Final',
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y text-sm divide-gray-200">
                        {customers.map((customer, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">{customer.customerID}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{customer.customerName || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{customer.socialMediaId || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.paymentDate
                                        ? new Date(customer.paymentDate).toLocaleDateString()
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.pdfGenerated ? customer.pdfGenerated.length : 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{renderStatusIcon(customer.customerStatus==="completed")}</td>
                                
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {customers.length === 0 && !loading && (
                    <div className="p-4 text-center text-gray-500">No customers found.</div>
                )}
            </motion.div>
            </div>
        </div>
    );
}

export default CustomerTable;
