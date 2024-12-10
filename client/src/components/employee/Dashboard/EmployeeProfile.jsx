import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Building, Briefcase,
    Calendar, CreditCard, Users, FileText, Clock
} from 'lucide-react';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const ProfileCard = ({ icon: Icon, title, value, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-start gap-3"
    >
        <div className="p-2 bg-blue-100 rounded-full">
            <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
            <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
            <p className="text-gray-800 font-semibold mt-1">{value}</p>
        </div>
    </motion.div>
);

const EmployeeProfile = ({ employee }) => {
    const [activeTab, setActiveTab] = useState('personal');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-2">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-6 mb-8 text-white">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-6"
                    >
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-4xl font-bold">
                                {employee.firstName[0]}{employee.lastName[0]}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{`${employee.firstName} ${employee.lastName}`}</h1>
                            <p className="text-blue-100 mt-2">{employee.jobTitle}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-8">
                    {['personal', 'work', 'stats'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content Sections */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {activeTab === 'personal' && (
                        <>
                            <ProfileCard icon={Mail} title="Email" value={employee.email} delay={0.1} />
                            <ProfileCard icon={Phone} title="Phone" value={employee.phone} delay={0.2} />
                            <ProfileCard
                                icon={MapPin}
                                title="Location"
                                value={`${employee.city}, ${employee.state}, ${employee.country}`}
                                delay={0.3}
                            />
                            <ProfileCard icon={Building} title="Address" value={employee.address} delay={0.4} />
                            <ProfileCard icon={MapPin} title="Pincode" value={employee.pincode} delay={0.5} />
                        </>
                    )}

                    {activeTab === 'work' && (
                        <>
                            <ProfileCard icon={Briefcase} title="Job Title" value={employee.jobTitle} delay={0.1} />
                            <ProfileCard icon={Building} title="Employer" value={employee.employerName} delay={0.2} />
                            <ProfileCard
                                icon={Calendar}
                                title="Start Date"
                                value={formatDate(employee.startDate)}
                                delay={0.3}
                            />
                            <ProfileCard
                                icon={Calendar}
                                title="End Date"
                                value={formatDate(employee.endDate)}
                                delay={0.4}
                            />
                            <ProfileCard
                                icon={FileText}
                                title="Reason for Leaving"
                                value={employee.reasonForLeaving}
                                delay={0.5}
                            />
                        </>
                    )}

                    {activeTab === 'stats' && (
                        <>
                            <ProfileCard
                                icon={Users}
                                title="Total Customers"
                                value={employee.customers.length}
                                delay={0.1}
                            />
                            <ProfileCard
                                icon={Clock}
                                title="Leave Balance"
                                value={`${employee.leaveBalance} days`}
                                delay={0.2}
                            />
                            <ProfileCard
                                icon={FileText}
                                title="PDFs Generated"
                                value={employee.pdfGenerated.length}
                                delay={0.3}
                            />
                        </>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default EmployeeProfile;