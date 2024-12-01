import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/employee/home", { replace: true });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center p-6">
      <ErrorOutlineIcon
        fontSize="large"
        className="text-red-500 mb-4"
        style={{ fontSize: "120px" }}
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Button
        variant="contained"
        color="primary"
        size="large"
        className="capitalize bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg"
        onClick={handleNavigate} // Call the function when the button is clicked
      >
        Go to Home
      </Button>
    </div>
  );
};
