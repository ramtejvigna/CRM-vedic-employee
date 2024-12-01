import React from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
const EmptyState = ({ message }) => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center justify-center h-64 text-center p-8"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="bg-blue-50 rounded-full p-6 mb-4"
    >
      <AlertCircle className="w-12 h-12 text-blue-500" />
    </motion.div>
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xl font-semibold text-gray-900 mb-2"
    >
      No  Records Found
    </motion.h3>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-gray-500 max-w-md"
    >
      There are no customer records available in this tab at the moment
      
    </motion.p>
  </motion.div>
  );
};

export default EmptyState;
