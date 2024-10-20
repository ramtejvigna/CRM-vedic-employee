import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TextField, Button, Select, MenuItem, FormControl, InputLabel, 
  Card, CardContent, Typography, Chip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Snackbar, IconButton, Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Info as InfoIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const LeaveManagement = () => {
    const [activeTab, setActiveTab] = useState('apply');
    const [leaveData, setLeaveData] = useState({
      startDate: null,
      endDate: null,
      leaveType: '',
      reason: ''
    });
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
  
    useEffect(() => {
        if (activeTab === 'pending') {
          fetchPendingLeaves();
        } else if (activeTab === 'history') {
          fetchLeaveHistory();
        }
      }, [activeTab]);
    
      const fetchPendingLeaves = async () => {
        try {
          const response = await axios.get('/api/leaves/pending');
          setPendingLeaves(response.data);
        } catch (error) {
          console.error('Error fetching pending leaves:', error);
        }
      };
    
      const fetchLeaveHistory = async () => {
        try {
          const response = await axios.get('/api/leaves/history');
          setLeaveHistory(response.data);
        } catch (error) {
          console.error('Error fetching leave history:', error);
        }
      };
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leaves/apply', leaveData);
      setLeaveData({
        startDate: null,
        endDate: null,
        leaveType: '',
        reason: ''
      });
      setSnackbar({ open: true, message: 'Leave application submitted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error applying for leave:', error);
      setSnackbar({ open: true, message: 'Failed to submit leave application. Please try again.', severity: 'error' });
    }
  };

  const handleLeaveAction = async (id, status) => {
    try {
      await axios.patch(`/api/leaves/${id}`, { status });
      fetchPendingLeaves();
      setSnackbar({ open: true, message: `Leave ${status.toLowerCase()} successfully`, severity: 'success' });
    } catch (error) {
      console.error('Error updating leave status:', error);
      setSnackbar({ open: true, message: 'Failed to update leave status. Please try again.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const tabVariants = {
    active: { backgroundColor: '#3f51b5', color: '#fff', scale: 1.05 },
    inactive: { backgroundColor: '#f0f0f0', color: '#000', scale: 1 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="container mx-auto p-4">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-center text-blue-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Leave Management System
        </motion.h1>
        
        <div className="flex justify-center mb-6">
          {['apply', 'pending', 'history'].map((tab) => (
            <motion.button
              key={tab}
              className="px-4 py-2 mx-2 rounded-full focus:outline-none"
              variants={tabVariants}
              animate={activeTab === tab ? 'active' : 'inactive'}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'apply' && (
              <Card className="max-w-md mx-auto">
                <CardContent>
                  <form onSubmit={handleApplyLeave} className="space-y-4">
                    <DatePicker
                      label="Start Date"
                      value={leaveData.startDate}
                      onChange={(date) => setLeaveData({ ...leaveData, startDate: date })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    <DatePicker
                      label="End Date"
                      value={leaveData.endDate}
                      onChange={(date) => setLeaveData({ ...leaveData, endDate: date })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Leave Type</InputLabel>
                      <Select
                        value={leaveData.leaveType}
                        onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
                      >
                        <MenuItem value="Vacation">Vacation</MenuItem>
                        <MenuItem value="Sick">Sick</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Reason"
                      value={leaveData.reason}
                      onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Apply for Leave
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'pending' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingLeaves.map((leave, index) => (
                  <motion.div
                    key={leave._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent>
                        <Typography variant="h6">{leave.employee.firstName} {leave.employee.lastName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </Typography>
                        <Chip label={leave.leaveType} color="primary" className="mt-2" />
                        <Typography variant="body1" className="mt-2">{leave.reason}</Typography>
                        <div className="mt-4 space-x-2">
                          <Button variant="outlined" color="primary" onClick={() => handleLeaveAction(leave._id, 'Approved')}>
                            Approve
                          </Button>
                          <Button variant="outlined" color="secondary" onClick={() => handleLeaveAction(leave._id, 'Rejected')}>
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaveHistory.map((leave, index) => (
                  <motion.div
                    key={leave._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card onClick={() => handleLeaveDetails(leave)} className="cursor-pointer">
                      <CardContent>
                        <Typography variant="h6">{leave.leaveType}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </Typography>
                        <Chip 
                          label={leave.status} 
                          color={leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'error' : 'default'} 
                          className="mt-2" 
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>
            Leave Details
            <IconButton
              aria-label="close"
              onClick={() => setDialogOpen(false)}
              sx={{
                position: 'absolute',
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
              <div className="space-y-4">
                <Typography variant="h6">{selectedLeave.leaveType} Leave</Typography>
                <Typography>
                  <strong>Date Range:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Status:</strong> 
                  <Chip 
                    label={selectedLeave.status} 
                    color={selectedLeave.status === 'Approved' ? 'success' : selectedLeave.status === 'Rejected' ? 'error' : 'default'} 
                    size="small"
                    className="ml-2"
                  />
                </Typography>
                <Typography>
                  <strong>Reason:</strong> {selectedLeave.reason}
                </Typography>
                {selectedLeave.adminComments && (
                  <Typography>
                    <strong>Admin Comments:</strong> {selectedLeave.adminComments}
                  </Typography>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
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
    </LocalizationProvider>
  );
};

export default LeaveManagement;