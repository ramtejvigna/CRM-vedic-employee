import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BabyNameModal = ({ isOpen, onClose }) => {
    const [numberOfNames, setNumberOfNames] = useState(0);
    const [babyNames, setBabyNames] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    const handleNumberOfNamesChange = (e) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        setNumberOfNames(value);
        setBabyNames(new Array(value).fill({ name: '', meaning: '' }));
    };

    const handleInputChange = (index, field, value) => {
        const newBabyNames = [...babyNames];
        newBabyNames[index] = { ...newBabyNames[index], [field]: value };
        setBabyNames(newBabyNames);
    };

    const handleSubmit = () => {
        console.log('Baby Names:', babyNames[0].name);
        onClose();
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (index) => setCurrentStep(index),
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <h2 className="text-2xl font-semibold text-center mb-6">Baby Names Input</h2>
                
                {/* Input for number of names */}
                <div className="mb-4">
                    <input
                        type="number"
                        value={numberOfNames}
                        onChange={handleNumberOfNamesChange}
                        placeholder="Enter number of names"
                        min="0"
                        className="border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:border-indigo-500"
                    />
                    
                </div>

                {/* Carousel for input fields */}
                {numberOfNames > 0 && (
                    <Slider {...settings} className="mb-6">
                        {babyNames.map((_, index) => (
                            <div key={index} className="p-4 flex flex-col items-center">
                                <h3 className="text-xl font-medium mb-4">Entry {index + 1}</h3>
                                <label className="w-full mb-2">
                                    <span className="text-sm font-medium">Baby Name:</span>
                                    <input
                                        type="text"
                                        value={babyNames[index]?.name || ''}
                                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                        className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:border-indigo-500"
                                    />
                                </label>
                                <label className="w-full mb-2">
                                    <span className="text-sm font-medium">Meaning:</span>
                                    <input
                                        type="text"
                                        value={babyNames[index]?.meaning || ''}
                                        onChange={(e) => handleInputChange(index, 'meaning', e.target.value)}
                                        className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:border-indigo-500"
                                    />
                                </label>
                            </div>
                        ))}
                    </Slider>
                )}

                {/* Next/Add Button */}
                <div className="flex justify-between mt-4">
                    {currentStep === numberOfNames - 1 ? (
                        <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                            Add
                        </button>
                    ) : (
                        <button onClick={() => setCurrentStep(currentStep + 1)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                            Next
                        </button>
                    )}
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BabyNameModal;
