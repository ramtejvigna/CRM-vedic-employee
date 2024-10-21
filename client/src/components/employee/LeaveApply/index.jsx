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
import {
  Info as InfoIcon,
  Close as CloseIcon,
  EventNote as EventNoteIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Pending as PendingIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { differenceInDays, addDays } from "date-fns";

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

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
        differenceInDays(leaveData.endDate, leaveData.startDate) + 1;
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
        "http://localhost:3000/api/employees/leave-balance",
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
        "http://localhost:3000/api/employees/leaves/history",
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
        "http://localhost:3000/api/employees/leaves/pending",
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
    try {
      const token = Cookies.get("token");
      const employeeId = "your-employee-id"; // Replace with actual logic to get the employee ID
      const leaveWithEmployee = { ...leaveData, employee: employeeId };
      await axios.post(
        "http://localhost:3000/api/employees/leaves/apply",
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
              { id: "pending", icon: <HistoryIcon />, label: "Pending" },
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
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-6">
                    <form onSubmit={handleApplyLeave} className="space-y-6">
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <DatePicker
                            label="Start Date"
                            value={leaveData.startDate}
                            onChange={(date) =>
                              setLeaveData({ ...leaveData, startDate: date })
                            }
                            renderInput={(params) => (
                              <TextField {...params} fullWidth />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DatePicker
                            label="End Date"
                            value={leaveData.endDate}
                            onChange={(date) =>
                              setLeaveData({ ...leaveData, endDate: date })
                            }
                            renderInput={(params) => (
                              <TextField {...params} fullWidth />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Leave Type</InputLabel>
                            <Select
                              value={leaveData.leaveType}
                              onChange={(e) =>
                                setLeaveData({
                                  ...leaveData,
                                  leaveType: e.target.value,
                                })
                              }
                            >
                              <MenuItem value="Loss of pay">Loss of Pay</MenuItem>
                              <MenuItem value="Sick">Sick</MenuItem>
                              <MenuItem value="Privileged">Privileged</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Total Days"
                            value={leaveDuration}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Reason"
                            value={leaveData.reason}
                            onChange={(e) =>
                              setLeaveData({
                                ...leaveData,
                                reason: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box className="flex items-center justify-between mb-2">
                            <Typography variant="body2">
                              Leave Balance
                            </Typography>
                            <Typography variant="body2">
                              {leaveBalance} / 15 days
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(leaveBalance / 15) * 100}
                            color="primary"
                          />
                        </Grid>
                      </Grid>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        className="mt-4"
                      >
                        Submit Leave Application
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "pending" && (
                <Grid container spacing={4}>
                  {pendingLeaves.map((leave, index) => (
                    <Grid item xs={12} md={6} lg={4} key={leave._id}>
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full">
                          <CardContent className="p-6">
                            <Box className="flex items-center mb-4">
                              <Avatar
                                className="mr-4"
                                src={leave.employee.avatar}
                              >
                                {leave.employee.firstName[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="h6">
                                  {leave.employee.firstName}{" "}
                                  {leave.employee.lastName}
                                </Typography>
                                {/* <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Employee ID: {leave.employee.id}
                                </Typography> */}
                              </Box>
                            </Box>
                            <Box className="flex items-center mb-3">
                              <CalendarIcon
                                className="mr-2"
                                color="primary"
                              />
                              <Typography variant="body2">
                                {new Date(leave.startDate).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(leave.endDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box className="flex items-center mb-3">
                              <AccessTimeIcon
                                className="mr-2"
                                color="primary"
                              />
                              <Typography variant="body2">
                                Duration:{" "}
                                {Math.ceil(
                                  (new Date(leave.endDate) -
                                    new Date(leave.startDate)) /
                                    (1000 * 60 * 60 * 24)
                                )}{" "}
                                days
                              </Typography>
                            </Box>
                            <Box className="flex items-center mb-4">
                              <CategoryIcon
                                className="mr-2"
                                color="primary"
                              />
                              <Chip
                                label={leave.leaveType}
                                color="primary"
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" className="mb-4">
                              <strong>Reason:</strong> {leave.reason}
                            </Typography>
                            <Box className="flex justify-end mt-4">
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleLeaveDetails(leave)}
                                startIcon={<InfoIcon />}
                              >
                                View Details
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              )}

              {activeTab === "history" && (
                <Grid container spacing={3}>
                  {leaveHistory.map((leave, index) => (
                    <Grid item xs={12} md={6} lg={4} key={leave._id}>
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          onClick={() => handleLeaveDetails(leave)}
                          className="cursor-pointer h-full"
                        >
                          <CardContent className="p-4">
                            <Box className="flex justify-between items-center mb-3">
                              <Typography variant="h6">
                                {leave.leaveType}
                              </Typography>
                              <Chip
                                label={leave.status}
                                style={{
                                  backgroundColor: getStatusColor(leave.status),
                                  color: "#ffffff",
                                }}
                                size="small"
                              />
                            </Box>
                            <Box className="flex items-center mb-2">
                              <CalendarIcon
                                className="mr-2"
                                color="primary"
                                fontSize="small"
                              />
                              <Typography variant="body2">
                                {new Date(leave.startDate).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(leave.endDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box className="flex items-center mb-3">
                              <AccessTimeIcon
                                className="mr-2"
                                color="primary"
                                fontSize="small"
                              />
                              <Typography variant="body2">
                                Duration:{" "}
                                {differenceInDays(
                                  new Date(leave.endDate),
                                  new Date(leave.startDate)
                                ) + 1}{" "}
                                days
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              className="line-clamp-2"
                            >
                              <strong>Reason:</strong> {leave.reason}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
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
                <Box className="space-y-4">
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
                      {new Date(selectedLeave.startDate).toLocaleDateString()}{" "}
                      -{" "}
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
                      )}{" "}
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
