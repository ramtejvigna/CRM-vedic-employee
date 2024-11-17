
import { motion } from "framer-motion";

export const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full">
                    <motion.div
                        className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        </div>
    )
}