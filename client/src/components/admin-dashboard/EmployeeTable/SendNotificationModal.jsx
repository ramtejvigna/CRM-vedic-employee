import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
} from "@mui/material";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from 'js-cookie'
const SendNotificationModal = ({ isOpen, onClose, employees, isDarkMode }) => {
  const [message, setMessage] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const token = Cookies.get('token')
  const handleSendNotification = async () => {
    if (message.trim() === "" || selectedEmployees.length === 0) {
      toast.error("Please enter a message and select at least one recipient");
      return;
    }
    try {
      await axios.post(
        "https://vedic-backend-neon.vercel.app/api/notifications",
        {
          message,
          recipients: selectedEmployees,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onClose();
      setMessage("");
      setSelectedEmployees([]);
      toast.success("Notification sent successfully");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp._id));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={onClose}
          PaperProps={{
            style: {
              width: "100%",
              maxWidth: "1000px",
              height: "80%",
              overflowY: "scroll",
              backgroundColor: isDarkMode ? "#121212" : "white",
              padding: "16px",
              borderRadius: "8px",
              position: "relative",
            },
          }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h5"
              color={isDarkMode ? "white" : "textPrimary"}
            >
              Send Notification
            </Typography>
            <XMarkIcon
              className="h-5 w-5 cursor-pointer text-blue-gray-500 transition-colors hover:text-red-500"
              onClick={onClose}
            />
          </DialogTitle>
          <DialogContent sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <TextField
              label="Notification Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              multiline
              fullWidth
              sx={{
                mb: 4,
                mt: 2,
                bgcolor: isDarkMode ? "black" : "white",
                color: isDarkMode ? "white" : "black",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "white" : "black",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "white" : "black",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "white" : "black",
                },
              }}
              InputProps={{
                style: {
                  color: isDarkMode ? "white" : "black",
                  padding: "12px",
                },
              }}
              InputLabelProps={{
                style: {
                  color: isDarkMode ? "white" : "black",
                },
              }}
            />
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <Typography
                  variant="h6"
                  color={isDarkMode ? "white" : "textPrimary"}
                  className="font-semibold"
                >
                  Select Recipients
                </Typography>
                <Button
                  color={isDarkMode ? "primary" : "default"}
                  variant="text"
                  size="small"
                  startIcon={<UserGroupIcon className="h-4 w-4" />}
                  onClick={handleSelectAll}
                >
                  {selectedEmployees.length === employees.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {employees.map((employee) => (
                  <motion.div
                    key={employee._id}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          id={`employee-${employee._id}`}
                          checked={selectedEmployees.includes(employee._id)}
                          onChange={() => handleEmployeeSelect(employee._id)}
                          sx={{ color: isDarkMode ? "white" : "textPrimary" }}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          color={isDarkMode ? "white" : "textPrimary"}
                        >
                          {employee.name}
                        </Typography>
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              color="default"
              onClick={onClose}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendNotification}
              startIcon={<PaperAirplaneIcon className="h-4 w-4" />}
            >
              Send Notification
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SendNotificationModal;
