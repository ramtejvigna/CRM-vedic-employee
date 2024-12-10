import { utils, writeFile } from 'xlsx';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const ExcelTemplateButton = () => {
    const handleTemplateDownload = () => {
        try {
            // Define your headers
            const headers = [
                'bookName',
                'gender',
                'nameEnglish',
                'nameDevanagari',
                'meaning',
                'numerology',
                'zodiac',
                'rashi',
                'nakshatra',
                'planetaryinfluence',
                'element',
                'pageNo',
                'syllableCount',
                'characterSignificance',
                'mantraRef',
                'relatedFestival',
                'extraNote',
                'researchTag'
            ];

            // Create an array with one row containing empty strings for each header
            const templateData = [
                Object.fromEntries(headers.map(header => [header, '']))
            ];

            // Create worksheet from the template data
            const ws = utils.json_to_sheet(templateData);

            // Create workbook and append worksheet
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "Template");

            // Save file
            writeFile(wb, "baby_names_template.xlsx");

            toast.success("Template downloaded successfully", {
                onClose: () => { },
                toastId: 'template-success'
            });
        } catch (error) {
            console.error("Template download error:", error);
            toast.error("Failed to download template", {
                onClose: () => { },
                toastId: 'template-error'
            });
        }
    };

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} >
            <button
                onClick={handleTemplateDownload}
                className="bg-slate-700 w-full text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer flex items-center justify-center"
            >
                <Download className="h-5 w-5 mr-2" />
                <span className="text-sm md:text-base">Template</span>
            </button>
        </motion.div>
    );
};

export default ExcelTemplateButton;