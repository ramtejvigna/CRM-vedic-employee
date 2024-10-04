import React, { useState } from 'react';
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie'; // Correct import for js-cookie
import {jwtDecode} from "jwt-decode"; // Correct way to import jwt_decode

export function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make API request to login
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      const token = response.data.token;
      
      // Store token in cookies
      Cookies.set('token', token, { expires: 1 });
      
      // Decode the token to get user details
      const decodedToken = jwtDecode(token);
      const isAdmin = decodedToken.isAdmin;
      const usernameFromToken = decodedToken.username; // If username is encoded in the token
      
      // Store username in cookies (you can also store email or any other user details)
      Cookies.set('username', usernameFromToken, { expires: 1 });
      
      // Show success message and navigate based on user role
      toast.success('Login successful!');
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/home');
      }
    } catch (error) {
      console.error(error);
      toast.error('Invalid credentials');
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
          <Typography variant="h2" className="font-bold mb-4 text-gray-900 dark:text-white">
            Sign In
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal text-gray-600 dark:text-gray-400">
            Enter your email or username and password to Sign In.
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
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="border-t-blue-gray-200 focus:border-t-gray-900 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
