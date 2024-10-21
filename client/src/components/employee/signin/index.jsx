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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { email, phone });
      
      // Extract token and user details from the response
      const token = response.data.token;
      const employeeId = response.data.userId;
      
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
            Enter your email and phone to Sign In.
          </Typography>
        </div>
        <form className="mt-8 mb-2" onSubmit={handleLogin}>
          <div className="mb-4">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-gray-600 dark:text-gray-400">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com "
              className="border-t-blue-gray-200 focus:border-t-gray-900 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
