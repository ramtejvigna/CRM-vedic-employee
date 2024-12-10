import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { FaHome, FaCog, FaChevronDown, FaSearch, FaBars, FaTimes, FaMoon, FaSun, FaUserCircle } from 'react-icons/fa'; // Import dark/light mode icons
import { useStore } from '../../../store';
import NotificationButton from './NotificationButton';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'
const Navbar = () => {
  const navigate = useNavigate();
  const { setOpenSidenav } = useStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State to control user dropdown
  const { activeRoute, isDarkMode } = useStore(); // Access theme state and toggle function
  const token = Cookies.get('token')


  const handleLogout = async () => {

    
    try {
      const response = await fetch('https://vedic-backend-neon.vercel.app/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token }) 
      });
  
      if (response.ok) {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate('/signin');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      toast.error('Logout failed');
    }
  };


  return (
    <nav className={`${isDarkMode ? 'bg-gray-900 text-white' : ' text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="logo"></span>
          </div>

          <div className="flex flex-row justify-between items-center w-full">
            <div className={`${isDarkMode ? ' text-white ' : ''} py-2 px-4`}>
              <div className="max-w-7xl mx-auto flex items-end opacity-70 space-x-2 text-sm">
                <FaHome className="h-4 w-4" />
                <span className="mx-1">/</span>
                <span className='font-semibold capitalize'>{activeRoute ? activeRoute : "Dashboard"}</span>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-4">
              <NotificationButton />
              <div className="relative">
                {/* User Icon */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} // Toggle the user menu dropdown
                  className="focus:outline-none"
                >
                  <FaUserCircle />
                </button>

                {/* User Dropdown */}
                <Transition
                  show={isUserMenuOpen}
                  enter="transition ease-out duration-100 transform"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75 transform"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div
                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} absolute right-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'} hover:bg-gray-100`}
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <p
                      onClick={handleLogout}
                      className={`block px-4 py-2 text-sm cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-700'} hover:bg-gray-100`}
                      role="menuitem"
                    >
                      Logout
                    </p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setOpenSidenav(true)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {<FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
