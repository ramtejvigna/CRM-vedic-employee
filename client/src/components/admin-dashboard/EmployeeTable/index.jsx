import React, { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardBody, Typography, Button, Avatar, 
  Chip, Input, Tooltip
} from '@material-tailwind/react';
import { 
  PlusIcon, BellIcon, PencilIcon, TrashIcon, 
  ChevronLeftIcon, ChevronRightIcon 
} from '@heroicons/react/24/solid';
import axios from 'axios';
import SendNotificationModal from './SendNotificationModal';
import { useStore } from '../../../store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie'
const EmployeeTablle = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ username: '', password: '', email: '', name: '' });
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const { isDarkMode } = useStore();
  const token = Cookies.get('token')
  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employees?page=${currentPage}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/employees', newEmployee, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAddingEmployee(false);
      setNewEmployee({ username: '', password: '', email: '', name: '' });
      setEmployees([...employees, response.data]);
      toast.success('Employee added successfully');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`mt-8 mb-8 flex flex-col gap-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
    >
      <Card className={`shadow-xl rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <CardHeader 
          floated={false} 
          shadow={false} 
          color={isDarkMode ? "blue-gray" : "blue"} 
          className="m-0 p-6"
        >
          <div className="flex justify-between items-center">
            <Typography variant="h4" color={isDarkMode ? "white" : "blue-gray"} className="font-bold">
              Employee Management
            </Typography>
            <Button
              color={isDarkMode ? "blue" : "blue-gray"}
              size="sm"
              className="flex items-center gap-2 rounded-full px-4 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
              onClick={() => setIsNotificationModalOpen(true)}
            >
              <BellIcon className="h-4 w-4" /> Send Notification
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="p-6 flex justify-between items-center">
            <Button 
              color={isDarkMode ? "blue" : "blue"}
              className="flex items-center gap-2 rounded-full px-4 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
              onClick={() => setIsAddingEmployee(!isAddingEmployee)}
            >
              <PlusIcon className="h-4 w-4" />
              {isAddingEmployee ? 'Cancel' : 'Add Employee'}
            </Button>
          </div>
          <AnimatePresence>
            {isAddingEmployee && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleAddEmployee} 
                className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-gray-50 dark:bg-gray-700"
              >
                <Input
                  type="text"
                  name="username"
                  value={newEmployee.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  value={newEmployee.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  required
                />
                <Input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  required
                />
                <Button type="submit" color="green" ripple="light" className="col-span-2">
                  Add Employee
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {["Employee", "Email", "Status", "Actions"].map((head) => (
                    <th key={head} className={`border-b ${isDarkMode ? 'border-blue-gray-800' : 'border-blue-gray-100'} p-4`}>
                      <Typography
                        variant="small"
                        color={isDarkMode ? "blue-gray" : "blue-gray"}
                        className="font-bold leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees?.map((employee, index) => {
                  const isLast = index === employees.length - 1;
                  const classes = isLast ? "p-4" : `p-4 border-b ${isDarkMode ? 'border-blue-gray-800' : 'border-blue-gray-50'}`;
 
                  return (
                    <tr key={employee._id} className={`${isDarkMode ? 'hover:bg-blue-gray-800' : 'hover:bg-blue-gray-50'} transition-colors duration-300`}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar 
                            src={`https://i.pravatar.cc/150?u=${employee._id}`} 
                            alt={employee.name} 
                            size="sm"
                            className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                          />
                          <Typography variant="small" color={isDarkMode ? "white" : "blue-gray"} className="font-bold">
                            {employee.name}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color={isDarkMode ? "white" : "blue-gray"} className="font-normal">
                          {employee.email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            size="sm"
                            variant="ghost"
                            value="Active"
                            color={isDarkMode ? "green" : "blue-gray"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <Tooltip content="Edit Employee">
                            <Button size="sm" color={isDarkMode ? "blue" : "blue-gray"} variant="text" className="flex items-center gap-1">
                              <PencilIcon className="h-4 w-4" /> Edit
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete Employee">
                            <Button size="sm" color="red" variant="text" className="flex items-center gap-1">
                              <TrashIcon className="h-4 w-4" /> Delete
                            </Button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4">
            <Button
              variant="text"
              color={isDarkMode ? "blue" : "blue-gray"}
              className="flex items-center gap-2"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
            </Button>
            <Typography color={isDarkMode ? "white" : "blue-gray"} className="font-normal">
              Page <strong className="text-blue-gray-900">{currentPage}</strong> of{" "}
              <strong className="text-blue-gray-900">{totalPages}</strong>
            </Typography>
            <Button
              variant="text"
              color={isDarkMode ? "blue" : "blue-gray"}
              className="flex items-center gap-2"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
          </div>
        </CardBody>
      </Card>
      <SendNotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        employees={employees}
        isDarkMode={isDarkMode}
      />
      <ToastContainer position="bottom-right" theme={isDarkMode ? "dark" : "light"} />
    </motion.div>
  );
};

export default EmployeeTablle;