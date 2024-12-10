import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, AlertCircle } from 'lucide-react';

const RequestConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <motion.button
                        whileHover={{ rotate: 0 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-4 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </motion.button>

                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Send className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Request Baby Names Access
                        </h2>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <p className="text-gray-600 leading-relaxed">
                                Are you sure you want to request access to the add baby names?
                                This request will be sent for approval.
                            </p>
                        </div>
                    </motion.div>

                    {/* Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-3 justify-end"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium transition-colors hover:bg-blue-700 flex items-center gap-2"
                            onClick={onConfirm}
                        >
                            <Send className="h-4 w-4" />
                            Confirm Request
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RequestConfirmationModal;