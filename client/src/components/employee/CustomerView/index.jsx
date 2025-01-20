import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2, Users, Calendar, FileText, Check, X, Edit, CircleArrowRight } from 'lucide-react';
import axios from 'axios';
import Cookies from "js-cookie";

function CustomerTable() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        hasPdf: 'all',
    });
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [editedNotes, setEditedNotes] = useState({});
    const [isEditingNote, setIsEditingNote] = useState({});
    const employeeId = Cookies.get('employeeId');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`https://vedic-backend-neon.vercel.app/customers/assigned/${employeeId}`);
                const filteredCustomers = response.data.data.filter(
                    (customer) => customer.customerStatus !== 'newRequests' &&
                        customer.customerStatus !== 'rejected'
                );
                setCustomers(filteredCustomers);
                setFilteredCustomers(filteredCustomers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [employeeId]);

    useEffect(() => {
        const applyFiltersAndSearch = () => {
            let result = [...customers];

            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                result = result.filter(customer =>
                    customer.customerID?.toLowerCase().includes(searchLower) ||
                    customer.customerName?.toLowerCase().includes(searchLower) ||
                    customer.socialMediaId?.toLowerCase().includes(searchLower)
                );
            }

            if (filters.status !== 'all') {
                result = result.filter(customer =>
                    filters.status === 'completed' ? 
                    customer.customerStatus === 'completed' :
                    customer.customerStatus !== 'completed'
                );
            }

            if (filters.hasPdf !== 'all') {
                result = result.filter(customer =>
                    filters.hasPdf === 'yes' ? 
                    (customer.pdfGenerated?.length > 0) :
                    (!customer.pdfGenerated || customer.pdfGenerated.length === 0)
                );
            }

            setFilteredCustomers(result);
        };

        applyFiltersAndSearch();
    }, [searchTerm, filters, customers]);

    const handleNoteChange = (e, customerID) => {
        const updatedNotes = e.target.value;
        setEditedNotes(prev => ({
            ...prev,
            [customerID]: updatedNotes,
        }));
    };

    const handleEditToggle = (customerID) => {
        if (isEditingNote[customerID]) {
            const updatedCustomers = customers.map((customer) =>
                customer.customerID === customerID
                    ? { ...customer, note: editedNotes[customerID] || '' }
                    : customer
            );
            setCustomers(updatedCustomers);

            setEditedNotes(prev => {
                const newState = { ...prev };
                delete newState[customerID];
                return newState;
            });
        }

        setIsEditingNote(prev => ({ ...prev, [customerID]: !prev[customerID] }));
    };

    const handleUpdateNote = async (customerID) => {
        const updatedNote = editedNotes[customerID];
        if (!updatedNote) return;

        try {
            await axios.patch(`https://vedic-backend-neon.vercel.app/customers/updateNote/${customerID}`, { note: updatedNote });
            setCustomers((prevCustomers) =>
                prevCustomers.map((customer) =>
                    customer.customerID === customerID
                        ? { ...customer, note: updatedNote }
                        : customer
                )
            );

            setEditedNotes((prevNotes) => {
                const updatedNotes = { ...prevNotes };
                delete updatedNotes[customerID];
                return updatedNotes;
            });
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const FilterBadge = ({ active, onClick, children }) => (
        <button
            onClick={onClick}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                active 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
            {children}
        </button>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg m-4 md:m-8">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                    <Users className="w-6 h-6 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                </div>
                
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by ID, name, or Instagram handle..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Filters:</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            <FilterBadge 
                                active={filters.status === 'all'} 
                                onClick={() => setFilters(f => ({ ...f, status: 'all' }))}
                            >
                                All Status
                            </FilterBadge>
                            <FilterBadge 
                                active={filters.status === 'completed'} 
                                onClick={() => setFilters(f => ({ ...f, status: 'completed' }))}
                            >
                                Completed
                            </FilterBadge>
                            <FilterBadge 
                                active={filters.status === 'pending'} 
                                onClick={() => setFilters(f => ({ ...f, status: 'pending' }))}
                            >
                                Pending
                            </FilterBadge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <FilterBadge 
                                active={filters.hasPdf === 'all'} 
                                onClick={() => setFilters(f => ({ ...f, hasPdf: 'all' }))}
                            >
                                All PDFs
                            </FilterBadge>
                            <FilterBadge 
                                active={filters.hasPdf === 'yes'} 
                                onClick={() => setFilters(f => ({ ...f, hasPdf: 'yes' }))}
                            >
                                Has PDFs
                            </FilterBadge>
                            <FilterBadge 
                                active={filters.hasPdf === 'no'} 
                                onClick={() => setFilters(f => ({ ...f, hasPdf: 'no' }))}
                            >
                                No PDFs
                            </FilterBadge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Customer ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Customer Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Instagram Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Payment Date</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">PDFs</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr
                                    key={customer.customerID}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{customer.customerID}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-800">{customer.customerName || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-blue-500 hover:text-blue-600">{customer.socialMediaId || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {customer.paymentDate
                                                ? new Date(customer.paymentDate).toLocaleDateString()
                                                : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
                                            customer.pdfGenerated?.length 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            <FileText className="w-4 h-4 mr-1" />
                                            {customer.pdfGenerated ? customer.pdfGenerated.length : 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {customer.customerStatus}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {isEditingNote[customer.customerID] ? (
                                                <input
                                                    type="text"
                                                    value={editedNotes[customer.customerID] || ''}
                                                    onChange={(e) => handleNoteChange(e, customer.customerID)}
                                                    className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                />
                                            ) : (
                                                <span className="text-gray-700">{customer.note || '-'}</span>
                                            )}
                                            <button
                                                onClick={() => handleEditToggle(customer.customerID)}
                                                className="px-3 py-1 text-blue-500 rounded-full text-xs hover:text-blue-600 transition-all duration-200"
                                            >
                                                {isEditingNote[customer.customerID] ? (
                                                    <CircleArrowRight />
                                                ) : (
                                                    <Edit />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No customers found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerTable;