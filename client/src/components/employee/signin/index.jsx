import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

export function SignIn() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const response = await axios.post('http://localhost:3000/api/login', { username, phone });
      Cookies.set('token', response.data.token, { expires: 1 });
      const token = response.data.token
      // Decode the token to get user details
      const decodedToken = jwtDecode(token);
      const isAdmin = decodedToken.isAdmin;
      const usernameFromToken = decodedToken.username; // If username is encoded in the token
      console.log(decodedToken)
      // Store username in cookies (you can also store email or any other user details)
      Cookies.set('username', usernameFromToken, { expires: 1 });
=======
      const response = await axios.post('http://localhost:3000/login', { username, phone });
      
      // Extract token and user details from the response
      const token = response.data.token;
      const employeeId = response.data.userId;
>>>>>>> d42d69b7b71477d9a4438438b6ff8ac4f498433c
      
      // Set token and employeeId as cookies
      Cookies.set('token', token, { expires: 1 });
      Cookies.set('employeeId', employeeId, { expires: 1 });

      // Display success message
      toast.success('Login successful!');
      
      navigate('/employee/home');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4 text-gray-900 dark:text-white">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal text-gray-600 dark:text-gray-400">
            Enter your email or username and phone to Sign In.
          </Typography>
        </div>
        <form className="mt-8 mb-2" onSubmit={handleLogin}>
          <div className="mb-4">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-gray-600 dark:text-gray-400">
              Your email or username
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com or username"
              className="border-t-blue-gray-200 focus:border-t-gray-900 dark:bg-gray-700 dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="mb-4">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-gray-600 dark:text-gray-400">
              Phone
            </Typography>
            <Input
              type="text"
              size="lg"
              className="border-t-blue-gray-200 focus:border-t-gray-900 dark:bg-gray-700 dark:text-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button className="mt-6 w-full" type="submit">
            Sign In
          </Button>
        </form>
      </motion.div>
    </section>
  );
}

export default SignIn;
