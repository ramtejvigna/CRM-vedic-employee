import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  Modal,
  Box,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useStore } from "../../../store"; // Custom hook for dark mode
import Cookies from "js-cookie";
import { useSnackbar } from "notistack"; // Import for notistack

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false); // New loading state for adding comment
  const [modalOpen, setModalOpen] = useState(false);
  const [statusOptions] = useState(["Pending", "In Progress", "Completed"]);
  const employeeId = "66fec75778f1878ad8dd4c9b";
  const token = Cookies.get("token");
  const { isDarkMode } = useStore();
  const { enqueueSnackbar } = useSnackbar(); // Snackbar for toast notifications

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/employee/tasks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [employeeId]);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/employee/tasks/${taskId}/status`,
        { status: newStatus }
      );
      setTasks((tasks) =>
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      if (selectedTask) {
        setSelectedTask({ ...selectedTask, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddComment = async (taskId) => {
    try {
      const username = Cookies.get("username");
      const newComment = { text: comment, createdBy: username };
  
      // API call to add the comment to the backend
      await axios.post(`http://localhost:3000/api/tasks/${taskId}/comment`, newComment);
  
      // Update the 'tasks' state with the new comment
      setTasks((tasks) =>
        tasks.map((task) =>
          task._id === taskId
            ? { ...task, comments: [...task.comments, newComment] }
            : task
        )
      );
  
      // If the modal is open and the task is selected, update the selectedTask as well
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask((prevTask) => ({
          ...prevTask,
          comments: [...prevTask.comments, newComment],
        }));
      }
  
      // Clear the comment input field
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "In Progress":
        return "info";
      case "Completed":
        return "success";
      default:
        return "default";
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: isDarkMode ? "#1e1e1e" : "#fff",
    color: isDarkMode ? "#fff" : "#000",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };

  return (
    <div className={`container mx-auto py-8 ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" fontWeight="bold">My Tasks</Typography>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : tasks.length === 0 ? (
        <Typography>No tasks assigned.</Typography>
      ) : (
        <TableContainer component={Paper} className={isDarkMode ? "bg-black text-white" : "bg-white"}>
          <Table aria-label="tasks table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", fontSize: "1.2em", color: "#1976d2" }}>Title</TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: "1.2em", color: "#1976d2" }}>Description</TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: "1.2em", color: "#1976d2" }}>Status</TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: "1.2em", color: "#1976d2" }}>Due</TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: "1.2em", color: "#1976d2" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <Chip label={task.status} color={getStatusColor(task.status)} />
                  </TableCell>
                  <TableCell>{new Date(task.endTime).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(task)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Task Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-task-title"
        aria-describedby="modal-task-description"
      >
        <Box sx={modalStyle}>
          {selectedTask && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography id="modal-task-title" variant="h5" fontWeight="bold">
                  {selectedTask.title}
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Typography id="modal-task-description" variant="body1" mt={2}>
                {selectedTask.description}
              </Typography>

              <Typography variant="caption" mt={2}>
                Due: {new Date(selectedTask.endTime).toLocaleDateString()}
              </Typography>

              <Box mt={2}>
                <TextField
                  select
                  label="Status"
                  value={selectedTask.status}
                  onChange={(e) => updateTaskStatus(selectedTask._id, e.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Comments Section */}
              <Box mt={4}>
                <Typography variant="h6">Comments</Typography>
                <List sx={{maxHeight:250,overflowY:'auto'}} dense>
                  {selectedTask.comments.map((comment, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>{comment.createdBy.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={comment.text}
                          secondary={comment.createdBy}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
                <Box mt={2} display="flex" alignItems="center">
                  <TextField
                    label="Add a comment"
                    variant="outlined"
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    onClick={() => handleAddComment(selectedTask._id)}
                    color="primary"
                    variant="contained"
                    disabled={addingComment || !comment}
                    sx={{ ml: 2 }}
                  >
                    {addingComment ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Add Comment"
                    )}
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Tasks;
