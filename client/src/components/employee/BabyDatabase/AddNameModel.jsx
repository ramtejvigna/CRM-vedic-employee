import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AddNameModal = ({ isOpen, onClose, onAdd }) => {
    const [categoryData, setCategoryData] = useState({
        gender: [],
        zodiac: [],
        rashi: [],
        nakshatra: [],
        planet: [],
        element: [],
        bookName: [],
        festival: []
    });

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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://vedic-backend-neon.vercel.app/categories');
                const data = await response.json();
                setCategoryData(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

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

    const renderSelect = (field, label, options, required = false) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                value={newName[field]}
                onChange={(e) => setNewName({ ...newName, [field]: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                required={required}
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );

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
                        {/* Dropdowns for collections */}
                        {renderSelect('bookName', 'Book Name', categoryData.bookName, true)}
                        {renderSelect('gender', 'Gender', categoryData.gender, true)}
                        
                        {/* Text inputs */}
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

                        {/* Astrological Information Dropdowns */}
                        {renderSelect('zodiac', 'Zodiac', categoryData.zodiac)}
                        {renderSelect('rashi', 'Rashi', categoryData.rashi)}
                        {renderSelect('nakshatra', 'Nakshatra', categoryData.nakshatra)}
                        {renderSelect('planetaryInfluence', 'Planetary Influence', categoryData.planet)}
                        {renderSelect('element', 'Element', categoryData.element)}

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

                        {renderSelect('relatedFestival', 'Related Festival', categoryData.festival)}

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

export default AddNameModal;