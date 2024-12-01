import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import {
  EventNote as EventNoteIcon,
  History as HistoryIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import LeaveApplication from "./LeaveApplication";
import LeaveHistory from "./LeaveHistory";
import PendingLeaves from "./PendingLeaves";

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
    fetchLeaveBalance();
  }, []);

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


  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-white bg-green-500";
      case "Rejected":
        return "text-white bg-red-500";
      default:
        return "text-white bg-yellow-500";
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            {activeTab === "apply" && (
              <LeaveApplication
                leaveData={leaveData}
                setLeaveData={setLeaveData}
                leaveBalance={leaveBalance}
                setLeaveBalance={setLeaveBalance}
                leaveDuration={leaveDuration}
                setLeaveDuration={setLeaveDuration}
                errors={errors}
                setErrors={setErrors}
                snackbar={snackbar}
                setSnackbar={setSnackbar}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            )}
            {activeTab === "pending" && (
              <PendingLeaves
                pendingLeaves={pendingLeaves}
                setPendingLeaves={setPendingLeaves}
                selectedLeave={selectedLeave}
                setSelectedLeave={setSelectedLeave}
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                deleteConfirmationOpen={deleteConfirmationOpen}
                setDeleteConfirmationOpen={setDeleteConfirmationOpen}
                leaveToDelete={leaveToDelete}
                setLeaveToDelete={setLeaveToDelete}
                snackbar={snackbar}
                setSnackbar={setSnackbar}
                getStatusColor={getStatusColor}
                theme={theme}
              />
            )}
            {activeTab === "history" && (
              <LeaveHistory
                leaveHistory={leaveHistory}
                setLeaveHistory={setLeaveHistory}
                selectedLeave={selectedLeave}
                setSelectedLeave={setSelectedLeave}
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                snackbar={snackbar}
                setSnackbar={setSnackbar}
                getStatusColor={getStatusColor}
                theme={theme}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </ThemeProvider>
  );
};

export default LeaveManagement;
