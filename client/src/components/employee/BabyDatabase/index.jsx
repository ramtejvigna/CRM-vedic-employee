import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from "axios";
import { Search, Upload, Edit, Save, Filter, Download } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import 'react-toastify/dist/ReactToastify.css';

const BabyDatabase = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [startingLetterFilter, setStartingLetterFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [babyNames, setBabyNames] = useState([]);
    const [editingName, setEditingName] = useState(null);

    const fetchBabyNames = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/names");
            setBabyNames(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch baby names", {
                onClose: () => { }, // Empty callback to prevent undefined error
                toastId: 'fetch-error' // Unique ID to prevent duplicate toasts
            });
        }
    };

    useEffect(() => {
        fetchBabyNames();

        // Cleanup function to dismiss all toasts when component unmounts
        return () => {
            toast.dismiss();
        };
    }, []);

    const filteredNames = babyNames.filter(
        (baby) =>
            (baby.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                baby.nameInHindi.includes(searchTerm)) &&
            (genderFilter === 'all' || baby.gender.toLowerCase() === genderFilter) &&
            (startingLetterFilter === '' || baby.name.toLowerCase().startsWith(startingLetterFilter.toLowerCase()))
    );

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleGenderFilter = (gender) => {
        setGenderFilter(gender);
        setPage(0);
    };

    const handleStartingLetterFilter = (event) => {
        setStartingLetterFilter(event.target.value);
        setPage(0);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Handle CSV upload
    const handleCsvUpload = async (event) => {
        const formData = new FormData();
        formData.append('csv', event.target.files[0]);
        try {
            await axios.post("http://localhost:3000/uploadCsvNames", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchBabyNames();
            toast.success("File uploaded successfully!", {
                onClose: () => { }, // Empty callback to prevent undefined error
                toastId: 'upload-success'
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload the file", {
                onClose: () => { }, // Empty callback to prevent undefined error
                toastId: 'upload-error'
            });
        }
    };

    // Handle editing
    const startEdit = (baby) => {
        setEditingName(baby);
    };

    const saveEdit = async () => {
        try {
            await axios.put(`http://localhost:3000/updateBabyName/${editingName._id}`, editingName);
            setEditingName(null);
            fetchBabyNames();
            toast.success("Baby name updated successfully!", {
                onClose: () => { }, // Empty callback to prevent undefined error
                toastId: 'update-success'
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to update the baby name", {
                onClose: () => { }, // Empty callback to prevent undefined error
                toastId: 'update-error'
            });
        }
    };

    const csvData = filteredNames.map(({ _id, _v, ...rest }) => rest);

    return (
        <div className="p-8 min-h-screen">
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={3} // Limit number of toasts shown at once
                enableMultiContainer={false} // Disable multi-container feature
                containerId="main-toast" // Unique container ID
            />
            <h1 className="text-4xl font-bold mb-20">Baby Names Database</h1>

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search Names"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFilters}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white transition duration-300"
                    >
                        <Filter className="h-5 w-5 inline-block mr-2" />
                        Filters
                    </motion.button>
                </div>
                <div className="flex space-x-4">
                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                    >
                        <Upload className="h-5 w-5 inline-block mr-2" />
                        Upload Baby Names
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleCsvUpload}
                            className="hidden"
                        />
                    </motion.label>
                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CSVLink
                            data={csvData}
                            filename="filtered_baby_names.csv"
                            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer flex items-center"
                        >
                            <Download className="h-5 w-5 inline-block mr-2" />
                            Export Names
                        </CSVLink>
                    </motion.label>

                </div>
            </div>

            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 rounded-lg"
                >
                    <div className="flex flex-wrap items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="gender" className="text-gray-700">Gender:</label>
                            <select
                                id="gender"
                                value={genderFilter}
                                onChange={(e) => handleGenderFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg pr-8 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            >
                                <option value="all">All</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <label htmlFor="startingLetter" className="text-gray-700">Starting Letter:</label>
                            <input
                                id="startingLetter"
                                type="text"
                                value={startingLetterFilter}
                                onChange={handleStartingLetterFilter}
                                maxLength={1}
                                className="w-12 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden"
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Book Name', 'Gender', 'Name', 'Meaning', 'Name in Hindi', 'Meaning in Hindi', 'Shlok No.', 'Page No.', 'Edit'].map((header) => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y text-sm divide-gray-200">
                        {filteredNames
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((baby, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="hover:bg-gray-50"
                                >
                                    {editingName && editingName._id === baby._id ? (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    value={editingName.bookName}
                                                    onChange={(e) => setEditingName({ ...editingName, bookName: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    value={editingName.gender}
                                                    onChange={(e) => setEditingName({ ...editingName, gender: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    value={editingName.name}
                                                    onChange={(e) => setEditingName({ ...editingName, name: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    value={editingName.meaning}
                                                    onChange={(e) => setEditingName({ ...editingName, meaning: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    value={editingName.nameInHindi}
                                                    onChange={(e) => setEditingName({ ...editingName, nameInHindi: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    value={editingName.meaningInHindi}
                                                    onChange={(e) => setEditingName({ ...editingName, meaningInHindi: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    value={editingName.shlokNo}
                                                    onChange={(e) => setEditingName({ ...editingName, shlokNo: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    value={editingName.pageNo}
                                                    onChange={(e) => setEditingName({ ...editingName, pageNo: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-md px-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    className="px-4 py-2 rounded-lg"
                                                    onClick={saveEdit}
                                                >
                                                    <Save className="h-5 w-5 text-green-600 inline-block mr-2" />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">{baby.bookName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{baby.gender}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{baby.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{baby.meaning}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{baby.nameInHindi}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{baby.meaningInHindi}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{baby.shlokNo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{baby.pageNo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    className="px-4 py-2 rounded-lg"
                                                    onClick={() => startEdit(baby)}
                                                >
                                                    <Edit className="h-5 w-5 text-blue-800 inline-block mr-2" />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </motion.tr>
                            ))}
                    </tbody>
                </table>
            </motion.div>

            <div className="mt-4 flex justify-between items-center rounded-lg px-4 py-3">
                <div className="flex items-center">
                    <span className="mr-2">Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        className="border border-gray-300 rounded-2xl pl-2 pr-5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                    >
                        {[5, 10, 25].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                        className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300"
                    >
                        Previous
                    </button>
                    <span>{`Page ${page + 1} of ${Math.ceil(filteredNames.length / rowsPerPage)}`}</span>
                    <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= Math.ceil(filteredNames.length / rowsPerPage) - 1}
                        className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BabyDatabase;
