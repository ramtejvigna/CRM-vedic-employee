import React, { useState } from 'react';

export const Customers = () => {
    const [activeTab, setActiveTab] = useState('New Requests');

    const renderContent = () => {
        switch (activeTab) {
            case 'New Requests':
                return <div>Apply Content</div>;
            case 'In progress':
                return <div>Pending Content</div>;
            case 'Completed':
                return <div>History Content</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center p-10">
            <div className="flex mb-4">
                <button
                    onClick={() => setActiveTab('New Requests')}
                    className={`px-4 py-2 text-sm rounded-l-md ${
                        activeTab === 'New Requests'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                    }`}
                >
                    New Requests
                </button>
                <button
                    onClick={() => setActiveTab('In progress')}
                    className={`px-4 py-2 text-sm ${
                        activeTab === 'In progress'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                    }`}
                >
                    In progress
                </button>
                <button
                    onClick={() => setActiveTab('Completed')}
                    className={`px-4 py-2 text-sm rounded-r-md ${
                        activeTab === 'Completed'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                    }`}
                >
                    Completed
                </button>
            </div>

            <div className="p-4 bg-white shadow-md w-full max-w-md">
                {renderContent()}
            </div>
        </div>
    );
};
