import React from 'react';
import { Box, Typography } from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa';

const EmptyState = ({text}) => {
  return (
    <Box className="flex flex-col w-full  bg-white  border-2  h-[400px] rounded-lg items-center justify-center p-6">
      <FaExclamationTriangle size={64} className="text-gray-400 mb-4" />
      <Typography variant="h6" className="text-gray-500 text-center">
        No {text} leaves at the moment.
      </Typography>
      <Typography variant="body2" className="text-gray-500 text-center mt-2">
        Check back later or apply for a new leave.
      </Typography>
    </Box>
  );
};

export default EmptyState;
