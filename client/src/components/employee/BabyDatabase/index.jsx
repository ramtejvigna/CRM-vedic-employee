import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from "axios";
import { Search, Upload, Edit, Save, Filter, Download, Loader2, Plus } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { LoadingSpinner } from "./LoadingSpinner"
import 'react-toastify/dist/ReactToastify.css';

const AddNameModal = ({ isOpen, onClose, onAdd }) => {
    const [newName, setNewName] = useState({
        bookName: '',
        gender: 'male',
        nameEnglish: '',
        nameDevanagari: '',
        meaning: '',
        numerology: '',
        zodiac: '',
        rashi: '',
        nakshatra: '',
        planetaryInfluence: '',
        element: '',
        pageNo: '',
        syllableCount: '',
        characterSignificance: '',
        mantraRef: '',
        relatedFestival: '',
        extraNote: '',
        researchTag: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onAdd(newName);
            onClose();
            setNewName({
                bookName: '',
                gender: 'male',
                nameEnglish: '',
                nameDevanagari: '',
                meaning: '',
                numerology: '',
                zodiac: '',
                rashi: '',
                nakshatra: '',
                planetaryInfluence: '',
                element: '',
                pageNo: '',
                syllableCount: '',
                characterSignificance: '',
                mantraRef: '',
                relatedFestival: '',
                extraNote: '',
                researchTag: ''
            });
        } catch (error) {
            console.error('Error adding name:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[40rem] overflow-y-auto"
            >
                <h2 className="text-2xl font-bold mb-4">Add New Name</h2>
                <form onSubmit={handleSubmit} className="space-y-6 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Basic Information */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Book Name</label>
                            <input
                                type="text"
                                value={newName.bookName}
                                onChange={(e) => setNewName({ ...newName, bookName: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                value={newName.gender}
                                onChange={(e) => setNewName({ ...newName, gender: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="unisex">Unisex</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name (English)</label>
                            <input
                                type="text"
                                value={newName.nameEnglish}
                                onChange={(e) => setNewName({ ...newName, nameEnglish: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name (Devanagari)</label>
                            <input
                                type="text"
                                value={newName.nameDevanagari}
                                onChange={(e) => setNewName({ ...newName, nameDevanagari: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Meaning</label>
                            <input
                                type="text"
                                value={newName.meaning}
                                onChange={(e) => setNewName({ ...newName, meaning: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                required
                            />
                        </div>

                        {/* Astrological Information */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Zodiac</label>
                            <input
                                type="text"
                                value={newName.zodiac}
                                onChange={(e) => setNewName({ ...newName, zodiac: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rashi</label>
                            <input
                                type="text"
                                value={newName.rashi}
                                onChange={(e) => setNewName({ ...newName, rashi: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nakshatra</label>
                            <input
                                type="text"
                                value={newName.nakshatra}
                                onChange={(e) => setNewName({ ...newName, nakshatra: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Planetary Influence</label>
                            <input
                                type="text"
                                value={newName.planetaryInfluence}
                                onChange={(e) => setNewName({ ...newName, planetaryInfluence: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Element</label>
                            <input
                                type="text"
                                value={newName.element}
                                onChange={(e) => setNewName({ ...newName, element: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        {/* Technical Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Page No.</label>
                            <input
                                type="text"
                                value={newName.pageNo}
                                onChange={(e) => setNewName({ ...newName, pageNo: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Numerology</label>
                            <input
                                type="text"
                                value={newName.numerology}
                                onChange={(e) => setNewName({ ...newName, numerology: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Syllable Count</label>
                            <input
                                type="text"
                                value={newName.syllableCount}
                                onChange={(e) => setNewName({ ...newName, syllableCount: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        {/* Additional Information */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Character Significance</label>
                            <input
                                type="text"
                                value={newName.characterSignificance}
                                onChange={(e) => setNewName({ ...newName, characterSignificance: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mantra Reference</label>
                            <input
                                type="text"
                                value={newName.mantraRef}
                                onChange={(e) => setNewName({ ...newName, mantraRef: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Related Festival</label>
                            <input
                                type="text"
                                value={newName.relatedFestival}
                                onChange={(e) => setNewName({ ...newName, relatedFestival: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Extra Notes</label>
                            <textarea
                                value={newName.extraNote}
                                onChange={(e) => setNewName({ ...newName, extraNote: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                rows="3"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Research Tags</label>
                            <input
                                type="text"
                                value={newName.researchTag}
                                onChange={(e) => setNewName({ ...newName, researchTag: e.target.value })}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                                placeholder="Separate tags with commas"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Name
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const FilterDropdown = ({ label, options = [], value, onChange }) => (
    <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}:</label>
        <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-white"
        >
            <option value="">All</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

const BabyDatabase = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [startingLetterFilter, setStartingLetterFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [babyNames, setBabyNames] = useState([]);
    const [editingName, setEditingName] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [filterOptions, setFilterOptions] = useState({
        zodiacs: [],
        nakshatras: [],
        elements: [],
        bookNames: []
    });
    const [selectedFilters, setSelectedFilters] = useState({
        zodiac: '',
        nakshatra: '',
        element: '',
        bookName: ''
    });

    const fetchBabyNames = async () => {
        try {
            const response = await axios.get("https://vedic-backend-neon.vercel.app/api/names");
            setBabyNames(response.data);

            // Extract unique values with proper null checking and sorting
            const extractUniqueValues = (field) => {
                return [...new Set(response.data
                    .map(item => item[field])
                    .filter(value => value && value.trim() !== ''))]
                    .sort((a, b) => a.localeCompare(b));
            };

            const uniqueValues = {
                zodiacs: extractUniqueValues('zodiac'),
                nakshatras: extractUniqueValues('nakshatra'),
                elements: extractUniqueValues('element'),
                bookNames: extractUniqueValues('bookName')
            };

            setFilterOptions(uniqueValues);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch baby names");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBabyNames();

        // Cleanup function to dismiss all toasts when component unmounts
        return () => {
            toast.dismiss();
        };
    }, []);

    const filteredNames = babyNames.filter(baby => {
        const matchesSearch = !searchTerm ||
            (baby.nameEnglish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                baby.nameDevanagari?.includes(searchTerm));

        const matchesGender = genderFilter === 'all' ||
            baby.gender?.toLowerCase() === genderFilter.toLowerCase();

        const matchesStartingLetter = !startingLetterFilter ||
            baby.nameEnglish?.toLowerCase().startsWith(startingLetterFilter.toLowerCase());

        const matchesZodiac = !selectedFilters.zodiac ||
            baby.zodiac?.toLowerCase() === selectedFilters.zodiac.toLowerCase();

        const matchesNakshatra = !selectedFilters.nakshatra ||
            baby.nakshatra?.toLowerCase() === selectedFilters.nakshatra.toLowerCase();

        const matchesElement = !selectedFilters.element ||
            baby.element?.toLowerCase() === selectedFilters.element.toLowerCase();

        const matchesBookName = !selectedFilters.bookName ||
            baby.bookName?.toLowerCase() === selectedFilters.bookName.toLowerCase();

        return matchesSearch &&
            matchesGender &&
            matchesStartingLetter &&
            matchesZodiac &&
            matchesNakshatra &&
            matchesElement &&
            matchesBookName;
    });

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setPage(0); // Reset to first page when filter changes
    };

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

    const handleAddName = async (newName) => {
        try {
            await axios.post("https://vedic-backend-neon.vercel.app/api/names", newName);
            await fetchBabyNames();
            toast.success("Name added successfully!", {
                onClose: () => { },
                toastId: 'add-success'
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to add name", {
                onClose: () => { },
                toastId: 'add-error'
            });
            throw err;
        }
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
        const file = event.target.files[0];

        // Ensure a file is selected and is of type CSV
        if (!file || file.type !== "text/csv") {
            toast.error("Please upload a valid CSV file.", {
                toastId: 'invalid-file-type'
            });
            return;
        }

        const formData = new FormData();
        formData.append('csv', file);

        try {
            // Send the POST request with the formData
            await axios.post("https://vedic-backend-neon.vercel.app/uploadCsvNames", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Fetch updated data and notify the user
            fetchBabyNames();
            toast.success("File uploaded successfully!", {
                onClose: () => { },
                toastId: 'upload-success'
            });
        } catch (err) {
            console.error("File upload error:", err);
            toast.error("Failed to upload the file", {
                onClose: () => { },
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
            await axios.put(`https://vedic-backend-neon.vercel.app/updateBabyName/${editingName._id}`, editingName);
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

    console.log(csvData)

    const renderFilters = () => (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 rounded-lg bg-white shadow-sm"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Gender Filter */}
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Gender:</label>
                    <select
                        value={genderFilter}
                        onChange={(e) => handleGenderFilter(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 bg-white"
                    >
                        <option value="all">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                {/* Starting Letter Filter */}
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Starting Letter:</label>
                    <input
                        type="text"
                        value={startingLetterFilter}
                        onChange={handleStartingLetterFilter}
                        maxLength={1}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                    />
                </div>

                {/* Dropdown Filters */}
                <FilterDropdown
                    label="Rashi"
                    options={filterOptions.zodiacs}
                    value={selectedFilters.zodiac}
                    onChange={(value) => handleFilterChange('zodiac', value)}
                />

                <FilterDropdown
                    label="Nakshatra"
                    options={filterOptions.nakshatras}
                    value={selectedFilters.nakshatra}
                    onChange={(value) => handleFilterChange('nakshatra', value)}
                />

                <FilterDropdown
                    label="Element"
                    options={filterOptions.elements}
                    value={selectedFilters.element}
                    onChange={(value) => handleFilterChange('element', value)}
                />

                <FilterDropdown
                    label="Book Name"
                    options={filterOptions.bookNames}
                    value={selectedFilters.bookName}
                    onChange={(value) => handleFilterChange('bookName', value)}
                />
            </div>
        </motion.div>
    );

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnHover
                limit={3}
                containerId="main-toast"
            />
            <h1 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12">Baby Names Database</h1>
            {filteredNames.length > 0 && (
                <h1 className='text-lg pb-5'>Showing {filteredNames.length} results</h1>
            )}
            <div className="mb-6 space-y-4">
                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 min-w-0">
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
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white transition duration-300 flex items-center justify-center"
                    >
                        <Filter className="h-5 w-5 mr-2" />
                        <span>Filters</span>
                    </motion.button>
                </div>

                {/* Action Buttons Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer flex items-center justify-center"
                    >
                        <Upload className="h-5 w-5 mr-2" />
                        <span className="text-sm md:text-base">Upload</span>
                        <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                    </motion.label>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <CSVLink
                            data={csvData}
                            filename="filtered_baby_names.csv"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer flex items-center justify-center"
                            enclosingCharacter={`"`}
                            onClick={(event, done) => {
                                const utf8Bom = '\ufeff'; // UTF-8 BOM
                                const csvContent = utf8Bom + csvData.map(row => row.join(",")).join("\n");
                                console.log(csv)
                                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.setAttribute("href", url);
                                link.setAttribute("download", "filtered_baby_names.csv");
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                done(false); // Prevents default CSVLink action
                            }}
                        >
                            <Download className="h-5 w-5 mr-2" />
                            <span className="text-sm md:text-base">Export</span>
                        </CSVLink>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <a
                            href="#"
                            onClick={() => {
                                const utf8Bom = '\ufeff'; // UTF-8 BOM
                                const templateData = "bookName,gender,nameEnglish,nameDevanagari,meaning,numerology,zodiac,rashi,nakshatra,planetaryinfluence,element,pageNo,syllableCount,characterSignificance,mantraRef,relatedFestival,extraNote,researchTag"; // Example template content
                                const blob = new Blob([utf8Bom + templateData], { type: "text/csv;charset=utf-8;" });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.setAttribute("href", url);
                                link.setAttribute("download", "baby_names_template.csv");
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="bg-slate-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer flex items-center justify-center"
                        >
                            <Download className="h-5 w-5 mr-2" />
                            <span className="text-sm md:text-base">Template</span>
                        </a>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white transition duration-300 flex items-center justify-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        <span className="text-sm md:text-base">Add New</span>
                    </motion.button>
                </div>

            </div>

            <AddNameModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddName}
            />

            {showFilters && renderFilters()}

            <div className='overflow-x-auto'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-xl"
                >
                    <table className="min-w-full divide-y min-h-full divide-gray-200">
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[
                                            'Name (English)',
                                            'Name (Devanagari)',
                                            'Meaning',
                                            'Gender',
                                            'Numerology',
                                            'Zodiac',
                                            'Rashi',
                                            'Nakshatra',
                                            'Planetary Influence',
                                            'Element',
                                            'Book Name',
                                            'Page No',
                                            'Syllable Count',
                                            'Character Significance',
                                            'Mantra Ref',
                                            'Related Festival',
                                            'Extra Note',
                                            'Research Tag',
                                            'Actions'
                                        ].map((header) => (
                                            <th key={header} className="px-6 py-3 text-left text-sm font-semibold text-gray-500 tracking-wider">
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
                                                                value={editingName.nameEnglish}
                                                                onChange={(e) => setEditingName({ ...editingName, nameEnglish: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.nameDevanagari}
                                                                onChange={(e) => setEditingName({ ...editingName, nameDevanagari: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.meaning}
                                                                onChange={(e) => setEditingName({ ...editingName, meaning: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                value={editingName.gender}
                                                                onChange={(e) => setEditingName({ ...editingName, gender: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            >
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                                <option value="unisex">Unisex</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.numerology}
                                                                onChange={(e) => setEditingName({ ...editingName, numerology: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.zodiac}
                                                                onChange={(e) => setEditingName({ ...editingName, zodiac: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.rashi}
                                                                onChange={(e) => setEditingName({ ...editingName, rashi: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.nakshatra}
                                                                onChange={(e) => setEditingName({ ...editingName, nakshatra: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.planetaryInfluence}
                                                                onChange={(e) => setEditingName({ ...editingName, planetaryInfluence: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.element}
                                                                onChange={(e) => setEditingName({ ...editingName, element: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.bookName}
                                                                onChange={(e) => setEditingName({ ...editingName, bookName: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.pageNo}
                                                                onChange={(e) => setEditingName({ ...editingName, pageNo: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.syllableCount}
                                                                onChange={(e) => setEditingName({ ...editingName, syllableCount: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.characterSignificance}
                                                                onChange={(e) => setEditingName({ ...editingName, characterSignificance: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.mantraRef}
                                                                onChange={(e) => setEditingName({ ...editingName, mantraRef: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.relatedFestival}
                                                                onChange={(e) => setEditingName({ ...editingName, relatedFestival: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.extraNote}
                                                                onChange={(e) => setEditingName({ ...editingName, extraNote: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                value={editingName.researchTag}
                                                                onChange={(e) => setEditingName({ ...editingName, researchTag: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1"
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
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.nameEnglish}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.nameDevanagari}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.meaning}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap capitalize">{baby.gender}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.numerology}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.zodiac}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.rashi}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.nakshatra}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.planetaryInfluence}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.element}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.bookName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.pageNo}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.syllableCount}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.characterSignificance}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.mantraRef}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.relatedFestival}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.extraNote}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{baby.researchTag}</td>
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
                            </>
                        )}
                    </table>

                    {filteredNames.length === 0 && !loading && (
                        <div className="text-center py-12 w-full">
                            <p className="text-gray-500 text-lg">No baby names found matching your criteria.</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {!loading && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-lg px-4 py-3">
                    <div className="flex items-center">
                        <span className="mr-2 text-sm">Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            className="border border-gray-300 rounded-lg pl-2 pr-5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                        >
                            {[5, 10, 25].map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handleChangePage(page - 1)}
                            disabled={page === 0}
                            className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300 text-sm"
                        >
                            Previous
                        </button>
                        <span className="text-sm">{`Page ${page + 1} of ${Math.ceil(filteredNames.length / rowsPerPage)}`}</span>
                        <button
                            onClick={() => handleChangePage(page + 1)}
                            disabled={page >= Math.ceil(filteredNames.length / rowsPerPage) - 1}
                            className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-50 transition duration-300 text-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BabyDatabase;