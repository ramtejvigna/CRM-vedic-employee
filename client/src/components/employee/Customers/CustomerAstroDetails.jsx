import React, { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerAstroDetails = ({ customerId }) => {
  const [astroDetails, setAstroDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableAstroDetails, setEditableAstroDetails] = useState({});

  const fetchAstroData = async () => {
    try {
      const response = await fetch(`https://vedic-backend-neon.vercel.app/api/customers/${customerId}/astro`);
      if (response.ok) {
        const data = await response.json();
        setAstroDetails(data);
        setEditableAstroDetails(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching astrology data:', error);
      setLoading(false);
      toast.error('Failed to fetch astrology details');
    }
  };

  useEffect(() => {
    fetchAstroData();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableAstroDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const updatedFields = {};
    for (const key in editableAstroDetails) {
      if (editableAstroDetails[key] !== astroDetails[key]) {
        updatedFields[key] = editableAstroDetails[key];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info('No changes detected.');
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(`https://vedic-backend-neon.vercel.app/api/customers/${customerId}/astro`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        setAstroDetails((prevDetails) => ({
          ...prevDetails,
          ...updatedFields,
        }));
        setIsEditing(false);
        toast.success('Details updated successfully.');
      } else {
        toast.error('Failed to update details.');
      }
    } catch (error) {
      console.error('Error updating astrology details:', error);
      toast.error('An error occurred while saving changes.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!astroDetails) {
    return <div>No astrology details available</div>;
  }

  return (
    
    <div className="relative">
      {/* Astrology Details */}
      <h2 className="text-lg font-medium mb-4">      Astrological Details
      </h2>
      <button 
  onClick={() => setIsEditing(true)} 
  style={{ 
    position: 'absolute', 
    top: '0', 
    right: '-200px',   
  }} 
  className="text-white bg-blue-500 hover:bg-blue-700 flex items-center px-3 py-2 rounded"
>
  <Edit className="mr-2" /> 
  
</button>
  


      <div className="grid grid-cols-2 gap-y-4 w-full mt-12  max-w-4xl" style={{ columnGap: '15rem' }}>
        
        <div>
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">Zodiac Sign:</p>
          <p className="mt-1 text-gray-900 whitespace-nowrap">{astroDetails.zodiacSign || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">Nakshatra:</p>
          <p className="mt-1 text-gray-900 whitespace-nowrap">{astroDetails.nakshatra || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">Numerology No:</p>
          <p className="mt-1 text-gray-900 whitespace-nowrap">{astroDetails.numerologyNo || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">Lucky Colour:</p>
          <p className="mt-1 text-gray-900 whitespace-nowrap">{astroDetails.luckyColour || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">Gemstone:</p>
          <p className="mt-1 text-gray-900 whitespace-nowrap">{astroDetails.gemstone || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">Destiny Number:</p>
          <p className="mt-1 text-gray-900 whitespace-nowrap">{astroDetails.destinyNumber || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">Lucky Day:</p>
          <p className="mt-1 text-gray-900 whitespace-nowrap">{astroDetails.luckyDay || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">Lucky God:</p>
          <p className="mt-1 text-gray-900 whitespace-nowrap">{astroDetails.luckyGod || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 whitespace-nowrap">Lucky Metal:</p>
          <p className="mt-1 text-gray-900 whitespace-nowrap">{astroDetails.luckyMetal || 'N/A'}</p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black backdrop-blur bg-opacity-30 flex items-center justify-center z-50 overflow-hidden">
          <div className="relative border p-6 w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-lg">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Astrology Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="zodiacSign" className="block text-sm font-medium text-gray-700">
                  Zodiac Sign
                </label>
                <input
                  type="text"
                  id="zodiacSign"
                  name="zodiacSign"
                  value={editableAstroDetails.zodiacSign || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="nakshatra" className="block text-sm font-medium text-gray-700">
                  Nakshatra
                </label>
                <input
                  type="text"
                  id="nakshatra"
                  name="nakshatra"
                  value={editableAstroDetails.nakshatra || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="numerologyNo" className="block text-sm font-medium text-gray-700">
                  Numerology No
                </label>
                <input
                  type="text"
                  id="numerologyNo"
                  name="numerologyNo"
                  value={editableAstroDetails.numerologyNo || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="luckyColour" className="block text-sm font-medium text-gray-700">
                  Lucky Colour
                </label>
                <input
                  type="text"
                  id="luckyColour"
                  name="luckyColour"
                  value={editableAstroDetails.luckyColour || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="gemstone" className="block text-sm font-medium text-gray-700">
                  Gemstone
                </label>
                <input
                  type="text"
                  id="gemstone"
                  name="gemstone"
                  value={editableAstroDetails.gemstone || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="destinyNumber" className="block text-sm font-medium text-gray-700">
                  Destiny Number
                </label>
                <input
                  type="text"
                  id="destinyNumber"
                  name="destinyNumber"
                  value={editableAstroDetails.destinyNumber || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="luckyDay" className="block text-sm font-medium text-gray-700">
                  Lucky Day
                </label>
                <input
                  type="text"
                  id="luckyDay"
                  name="luckyDay"
                  value={editableAstroDetails.luckyDay || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="luckyGod" className="block text-sm font-medium text-gray-700">
                  Lucky God
                </label>
                <input
                  type="text"
                  id="luckyGod"
                  name="luckyGod"
                  value={editableAstroDetails.luckyGod || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="luckyMetal" className="block text-sm font-medium text-gray-700">
                  Lucky Metal
                </label>
                <input
                  type="text"
                  id="luckyMetal"
                  name="luckyMetal"
                  value={editableAstroDetails.luckyMetal || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CustomerAstroDetails;