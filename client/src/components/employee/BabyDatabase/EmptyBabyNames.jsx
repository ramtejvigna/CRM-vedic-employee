import React from 'react';
import { motion } from 'framer-motion';
import { Baby, Search, Stars, Moon, Sun } from 'lucide-react';

const EmptyBabyNames = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center py-16 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background decorative elements */}
            <motion.div
                className="absolute"
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <Stars className="w-32 h-32 text-blue-100" />
            </motion.div>

            {/* Main illustration */}
            <motion.div
                className="relative mb-8"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="absolute -right-12 top-0"
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Moon className="w-8 h-8 text-blue-400" />
                </motion.div>

                <motion.div
                    className="absolute -left-12 top-0"
                    animate={{
                        y: [0, 10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                >
                    <Sun className="w-8 h-8 text-yellow-400" />
                </motion.div>

                <div className="relative">
                    <motion.div
                        className="bg-blue-50 rounded-full p-8"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Baby className="w-24 h-24 text-blue-500" />
                    </motion.div>
                    <motion.div
                        className="absolute -right-4 -bottom-4 bg-pink-100 rounded-full p-2"
                        animate={{
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Search className="w-6 h-6 text-pink-500" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Text content */}
            <motion.h3
                className="text-xl font-semibold text-gray-800 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                No Baby Names Found
            </motion.h3>

            <motion.p
                className="text-gray-500 text-center max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                We couldn't find any baby names matching your search criteria. Try adjusting your filters or try a different search term.
            </motion.p>

            <motion.button
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Clear Filters
            </motion.button>
        </motion.div>
    );
};

export default EmptyBabyNames;