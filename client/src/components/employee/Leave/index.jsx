import React, { useState } from 'react';

export const Leave = () => {
    const [activeTab, setActiveTab] = useState('Apply');

    const renderContent = () => {
        switch (activeTab) {
            case 'Apply':
                return <div>Apply Content</div>;
            case 'Pending':
                return <div>Pending Content</div>;
            case 'History':
                return <div>History Content</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center p-10">
            <div className="flex mb-4">
                <button
                    onClick={() => setActiveTab('Apply')}
                    className={`px-4 py-2 text-sm rounded-l-md ${
                        activeTab === 'Apply'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                    }`}
                >
                    Apply
                </button>
                <button
                    onClick={() => setActiveTab('Pending')}
                    className={`px-4 py-2 text-sm ${
                        activeTab === 'Pending'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                    }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setActiveTab('History')}
                    className={`px-4 py-2 text-sm rounded-r-md ${
                        activeTab === 'History'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white transition-colors'
                    }`}
                >
                    History
                </button>
            </div>

            <div className="p-4 bg-white shadow-md w-full max-w-md">
                {renderContent()}
            </div>
        </div>
    );
};
