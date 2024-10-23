import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Avatar,
  Grid,
  LinearProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Calendar, Clock, FileText, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

import {
  Info as InfoIcon,
  Close as CloseIcon,
  EventNote as EventNoteIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Pending as PendingIcon,
  Category as CategoryIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { differenceInDays } from "date-fns";
import EmptyState from "./Empty";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#3a86ff",
      light: "#60a5fa",
      dark: "#2563eb",
    },
    secondary: {
      main: "#f72585",
      light: "#f87fb1",
      dark: "#d61a6c",
    },
    background: {
      default: "#f3f4f6",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1.1rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.95rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("apply");
  const [leaveData, setLeaveData] = useState({
    startDate: null,
    endDate: null,
    leaveType: "",
    reason: "",
  });
  const [leaveBalance, setLeaveBalance] = useState(15);
  const [leaveDuration, setLeaveDuration] = useState(0);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState(null);

  useEffect(() => {
    if (activeTab === "history") {
      fetchLeaveHistory();
    } else if (activeTab === "pending") {
      fetchPendingLeaves();
    }
  }, [activeTab]);

  useEffect(() => {
    if (leaveData.startDate && leaveData.endDate) {
      const duration =
        differenceInDays(new Date(leaveData.endDate), new Date(leaveData.startDate)) + 1;
      setLeaveDuration(duration > 0 ? duration : 0);
    } else {
      setLeaveDuration(0);
    }
  }, [leaveData.startDate, leaveData.endDate]);

  useEffect(() => {
    fetchLeaveBalance();
  }, []);

  const fetchLeaveBalance = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://vedic-backend-neon.vercel.app/api/employees/leave-balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveBalance(response.data.leaveBalance);
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch leave balance",
        severity: "error",
      });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!leaveData.startDate) newErrors.startDate = 'Start date is required';
    if (!leaveData.endDate) newErrors.endDate = 'End date is required';
    if (!leaveData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!leaveData.reason) newErrors.reason = 'Reason is required';
    if (leaveData.reason && leaveData.reason.length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }
    if (leaveData.startDate && leaveData.endDate) {
      const start = new Date(leaveData.startDate);
      const end = new Date(leaveData.endDate);
      if (end < start) newErrors.endDate = 'End date cannot be before start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchLeaveHistory = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://vedic-backend-neon.vercel.app/api/employees/leaves/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveHistory(
        response.data.filter((leave) => leave.status !== "Pending")
      );
    } catch (error) {
      console.error("Error fetching leave history:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch leave history",
        severity: "error",
      });
    }
  };

  const fetchPendingLeaves = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://vedic-backend-neon.vercel.app/api/employees/leaves/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingLeaves(response.data);
    } catch (error) {
      console.error("Error fetching pending leaves:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch pending leaves",
        severity: "error",
      });
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const token = Cookies.get("token");
      const employeeId = "your-employee-id"; // Replace with actual logic to get the employee ID
      const leaveWithEmployee = { ...leaveData, employee: employeeId };
      await axios.post(
        "https://vedic-backend-neon.vercel.app/api/employees/leaves/apply",
        leaveWithEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveData({
        startDate: null,
        endDate: null,
        leaveType: "",
        reason: "",
      });
      setLeaveBalance((prevBalance) => prevBalance - leaveDuration);
      setSnackbar({
        open: true,
        message: "Leave application submitted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error applying for leave:", error);
      setSnackbar({
        open: true,
        message: "Failed to submit leave application",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLeaveDetails = (leave) => {
    setSelectedLeave(leave);
    setDialogOpen(true);
  };

  const handleDeleteLeave = (leave) => {
    setLeaveToDelete(leave);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteLeave = async () => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `https://vedic-backend-neon.vercel.app/api/employees/leaves/${leaveToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingLeaves(
        pendingLeaves.filter((leave) => leave._id !== leaveToDelete._id)
      );
      setSnackbar({
        open: true,
        message: "Leave request deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting leave request:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete leave request",
        severity: "error",
      });
    } finally {
      setDeleteConfirmationOpen(false);
      setLeaveToDelete(null);
    }
  };

  const tabVariants = {
    active: {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      scale: 1.05,
    },
    inactive: {
      backgroundColor: "#fff",
      color: theme.palette.text.primary,
      scale: 1,
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#10B981";
      case "Rejected":
        return "#EF4444";
      default:
        return "#F59E0B";
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, leaveHistory.length - page * rowsPerPage);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box className="container mx-auto p-6">
          <motion.h1
            className="text-3xl font-bold mb-8 text-center text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Leave Management System
          </motion.h1>

          <Box className="flex justify-center mb-8">
            {[
              { id: "apply", icon: <EventNoteIcon />, label: "Apply" },
              { id: "pending", icon: <PendingIcon />, label: "Pending" },
              { id: "history", icon: <HistoryIcon />, label: "History" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className="px-4 py-2 mx-2 rounded-full focus:outline-none flex items-center shadow-md"
                variants={tabVariants}
                animate={activeTab === tab.id ? "active" : "inactive"}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                <span className="ml-2 font-semibold">{tab.label}</span>
              </motion.button>
            ))}
          </Box>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === 'apply' && (
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold">Leave Application</h2>
                    <p className="mt-1">Submit your leave request</p>
                  </div>

                  <form onSubmit={handleApplyLeave} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Start Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={leaveData.startDate}
                            onChange={(e) => setLeaveData(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.startDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                          )}
                        </div>
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={leaveData.endDate}
                            onChange={(e) => setLeaveData(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.endDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Leave Type and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                        <div className="relative">
                          <select
                            value={leaveData.leaveType}
                            onChange={(e) => setLeaveData(prev => ({ ...prev, leaveType: e.target.value }))}
                            className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                          >
                            <option value="">Select Leave Type</option>
                            <option value="Sick">Sick</option>
                            <option value="Loss of pay">Loss of pay</option>
                            <option value="Privileged">Privileged</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                          {errors.leaveType && (
                            <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={leaveDuration}
                            readOnly
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          value={leaveData.reason}
                          onChange={(e) => setLeaveData(prev => ({ ...prev, reason: e.target.value }))}
                          rows={1}
                          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Please provide detailed reason for your leave request..."
                        />
                        {errors.reason && (
                          <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                        )}
                      </div>
                    </div>

                    {/* Leave Balance */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Leave Balance</span>
                        <span className="text-sm font-medium text-gray-900">
                          {leaveBalance} / 15 days
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${(leaveBalance / 15) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-lg text-white font-medium transition-all ${
                        isSubmitting
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Submit Leave Application
                          </>
                        )}
                      </div>
                    </button>
                  </form>
                </div>
              )}
  {activeTab === "pending" && (
                <div className="overflow-x-auto">
                  {pendingLeaves.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <>
                      <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              S.No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Leave Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Start Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              End Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Leave Applied Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <AnimatePresence>
                            {pendingLeaves
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((leave, index) => (
                                <motion.tr
                                  key={leave._id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {page * rowsPerPage + index + 1}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {leave.leaveType}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(
                                      leave.startDate
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(
                                      leave.endDate
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {differenceInDays(
                                      new Date(leave.endDate),
                                      new Date(leave.startDate)
                                    ) + 1}{" "}
                                    days
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                        leave.status
                                      )}`}
                                    >
                                      {leave.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {leave.createdAt
                                      ? new Date(
                                          leave.createdAt
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={() => handleLeaveDetails(leave)}
                                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-4"
                                    >
                                      <InfoIcon size={18} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLeave(leave)}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                                    >
                                      <DeleteIcon size={18} />
                                    </button>
                                  </td>
                                </motion.tr>
                              ))}
                          </AnimatePresence>
                        </tbody>
                      </table>

                      {/* Pagination */}
                      <div
                        className={`px-4 py-3 flex items-center justify-between border-t sm:px-6`}
                      >
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() =>
                              setPage((prev) => Math.max(prev - 1, 0))
                            }
                            disabled={page === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() =>
                              setPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(
                                    pendingLeaves.length / rowsPerPage
                                  ) - 1
                                )
                              )
                            }
                            disabled={
                              page ===
                              Math.ceil(pendingLeaves.length / rowsPerPage) - 1
                            }
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing {page * rowsPerPage + 1} to{" "}
                              {Math.min(
                                (page + 1) * rowsPerPage,
                                pendingLeaves.length
                              )}{" "}
                              of {pendingLeaves.length} results
                            </p>
                          </div>
                          <div>
                            <nav
                              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                              aria-label="Pagination"
                            >
                              <button
                                onClick={() =>
                                  setPage((prev) => Math.max(prev - 1, 0))
                                }
                                disabled={page === 0}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                                  theme.palette.mode === "dark"
                                    ? "border-gray-700 bg-gray-800"
                                    : "border-gray-300 bg-white"
                                } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                              >
                                Previous
                              </button>
                              {Array.from(
                                {
                                  length: Math.ceil(
                                    pendingLeaves.length / rowsPerPage
                                  ),
                                },
                                (_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`relative inline-flex items-center px-4 py-2 border ${
                                      theme.palette.mode === "dark"
                                        ? "border-gray-700 bg-gray-800"
                                        : "border-gray-300 bg-white"
                                    } text-sm font-medium ${
                                      page === i
                                        ? "text-indigo-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {i + 1}
                                  </button>
                                )
                              )}
                              <button
                                onClick={() =>
                                  setPage((prev) =>
                                    Math.min(
                                      prev + 1,
                                      Math.ceil(
                                        pendingLeaves.length / rowsPerPage
                                      ) - 1
                                    )
                                  )
                                }
                                disabled={
                                  page ===
                                  Math.ceil(
                                    pendingLeaves.length / rowsPerPage
                                  ) -
                                    1
                                }
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                                  theme.palette.mode === "dark"
                                    ? "border-gray-700 bg-gray-800"
                                    : "border-gray-300 bg-white"
                                } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                              >
                                Next
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="overflow-x-auto">
                  <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          S.No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Leave Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Leave Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <AnimatePresence>
                        {leaveHistory
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((leave, index) => (
                            <motion.tr
                              key={leave._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                {page * rowsPerPage + index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {leave.leaveType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(leave.startDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(leave.endDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {differenceInDays(
                                  new Date(leave.endDate),
                                  new Date(leave.startDate)
                                ) + 1}{" "}
                                days
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                    leave.status
                                  )}`}
                                >
                                  {leave.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {leave.createdAt
                                  ? new Date(
                                      leave.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleLeaveDetails(leave)}
                                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-4"
                                >
                                  <InfoIcon size={18} />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                  <div
                    className={`px-4 py-3 flex items-center justify-between border-t sm:px-6`}
                  >
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => {
                          setPage((prev) => Math.max(prev - 1, 0));
                        }}
                        disabled={page === 0}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          setPage((prev) =>
                            Math.min(
                              prev + 1,
                              Math.ceil(leaveHistory.length / rowsPerPage) - 1
                            )
                          );
                        }}
                        disabled={
                          page ===
                          Math.ceil(leaveHistory.length / rowsPerPage) - 1
                        }
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing {page * rowsPerPage + 1} to{" "}
                          {Math.min(
                            (page + 1) * rowsPerPage,
                            leaveHistory.length
                          )}{" "}
                          of {leaveHistory.length} results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() => {
                              setPage((prev) => Math.max(prev - 1, 0));
                            }}
                            disabled={page === 0}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                              theme.palette.mode === "dark"
                                ? "border-gray-700 bg-gray-800"
                                : "border-gray-300 bg-white"
                            } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                          >
                            Previous
                          </button>
                          {Array.from(
                            {
                              length: Math.ceil(
                                leaveHistory.length / rowsPerPage
                              ),
                            },
                            (_, i) => (
                              <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`relative inline-flex items-center px-4 py-2 border ${
                                  theme.palette.mode === "dark"
                                    ? "border-gray-700 bg-gray-800"
                                    : "border-gray-300 bg-white"
                                } text-sm font-medium ${
                                  page === i
                                    ? "text-indigo-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {i + 1}
                              </button>
                            )
                          )}
                          <button
                            onClick={() => {
                              setPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(leaveHistory.length / rowsPerPage) -
                                    1
                                )
                              );
                            }}
                            disabled={
                              page ===
                              Math.ceil(leaveHistory.length / rowsPerPage) - 1
                            }
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                              theme.palette.mode === "dark"
                                ? "border-gray-700 bg-gray-800"
                                : "border-gray-300 bg-white"
                            } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              style: {
                borderRadius: 16,
                padding: 24,
              },
            }}
          >
            <DialogTitle>
              <Typography variant="h6">Leave Details</Typography>
              <IconButton
                aria-label="close"
                onClick={() => setDialogOpen(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {selectedLeave && (
                <Box className="space-y-4 p-0 h-[150px]">
                  <Box className="flex items-center justify-between">
                    <Typography variant="h6">
                      {selectedLeave.leaveType} Leave
                    </Typography>
                    <Chip
                      label={selectedLeave.status}
                      style={{
                        backgroundColor: getStatusColor(selectedLeave.status),
                        color: "#ffffff",
                      }}
                    />
                  </Box>
                  <Box className="flex items-center">
                    <CalendarIcon className="mr-2" color="primary" />
                    <Typography>
                      <strong>Date Range:</strong>{" "}
                      {new Date(selectedLeave.startDate).toLocaleDateString()} -{" "}
                      {new Date(selectedLeave.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box className="flex items-center">
                    <AccessTimeIcon className="mr-2" color="primary" />
                    <Typography>
                      <strong>Duration:</strong>{" "}
                      {Math.ceil(
                        (new Date(selectedLeave.endDate) -
                          new Date(selectedLeave.startDate)) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}{" "}
                      days
                    </Typography>
                  </Box>
                  <Typography>
                    <strong>Reason:</strong> {selectedLeave.reason}
                  </Typography>
                  {selectedLeave.adminComments && (
                    <Typography>
                      <strong>Admin Comments:</strong>{" "}
                      {selectedLeave.adminComments}
                    </Typography>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={deleteConfirmationOpen}
            onClose={() => setDeleteConfirmationOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              style: {
                borderRadius: 16,
                padding: 24,
              },
            }}
          >
            <DialogTitle>
              <Typography variant="h6">Confirm Delete</Typography>
              <IconButton
                aria-label="close"
                onClick={() => setDeleteConfirmationOpen(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this leave request?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteConfirmationOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={confirmDeleteLeave} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbar.message}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleCloseSnackbar}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default LeaveManagement;
