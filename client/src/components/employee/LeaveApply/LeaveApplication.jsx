import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { differenceInDays } from "date-fns";

const LeaveApplication = ({
  leaveData,
  setLeaveData,
  leaveBalance,
  setLeaveBalance,
  leaveDuration,
  setLeaveDuration,
  errors,
  setErrors,
  snackbar,
  setSnackbar,
  isSubmitting,
  setIsSubmitting,
}) => {
  useEffect(() => {
    if (leaveData.startDate && leaveData.endDate) {
      const duration =
        differenceInDays(
          new Date(leaveData.endDate),
          new Date(leaveData.startDate)
        ) + 1;
      setLeaveDuration(duration > 0 ? duration : 0);
    } else {
      setLeaveDuration(0);
    }
  }, [leaveData.startDate, leaveData.endDate]);

  const validateForm = () => {
    const newErrors = {};
    if (!leaveData.startDate) newErrors.startDate = "Start date is required";
    if (!leaveData.endDate) newErrors.endDate = "End date is required";
    if (!leaveData.leaveType) newErrors.leaveType = "Leave type is required";
    if (!leaveData.reason) newErrors.reason = "Reason is required";
    if (leaveData.reason && leaveData.reason.length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }
    if (leaveData.startDate && leaveData.endDate) {
      const start = new Date(leaveData.startDate);
      const end = new Date(leaveData.endDate);
      if (end < start)
        newErrors.endDate = "End date cannot be before start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Leave Application</h2>
        <p className="mt-1">Submit your leave request</p>
      </div>

      <form onSubmit={handleApplyLeave} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={leaveData.startDate}
                onChange={(e) =>
                  setLeaveData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={leaveData.endDate}
                onChange={(e) =>
                  setLeaveData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type
            </label>
            <div className="relative">
              <select
                value={leaveData.leaveType}
                onChange={(e) =>
                  setLeaveData((prev) => ({
                    ...prev,
                    leaveType: e.target.value,
                  }))
                }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Days)
            </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Leave
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              value={leaveData.reason}
              onChange={(e) =>
                setLeaveData((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
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
            <span className="text-sm font-medium text-gray-700">
              Leave Balance
            </span>
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
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
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

      <Snackbar
        anchorOrigin={{
          vertical: "top",
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
    </div>
  );
};

export default LeaveApplication;
