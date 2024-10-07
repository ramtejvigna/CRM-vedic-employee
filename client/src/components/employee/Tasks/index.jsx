import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Collapse,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useStore } from "../../../store";
import Cookies from 'js-cookie';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusOptions] = useState(['Pending', 'In Progress', 'Completed']);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');
  const [expanded, setExpanded] = useState({});
  const employeeId = '66fec75778f1878ad8dd4c9b';
  const token = Cookies.get('token');
  const { isDarkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/employee/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
      await axios.put(`http://localhost:3000/api/employee/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddComment = async (taskId) => {
    try {
      const username = Cookies.get('username');
      await axios.post(`http://localhost:3000/api/tasks/${taskId}/comment`, { text: comment, createdBy: username });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, comments: [...task.comments, { text: comment, createdBy: username }] } : task));
      setComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleExpandClick = (taskId) => {
    setExpanded(prevState => ({
      ...prevState,
      [taskId]: !prevState[taskId]
    }));
  };

  return (
    <div className={`container mx-auto py-8 ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" fontWeight="bold">My Tasks</Typography>
        <Button onClick={toggleDarkMode} variant="contained" color={isDarkMode ? "secondary" : "primary"}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : tasks.length === 0 ? (
        <Typography>No tasks assigned.</Typography>
      ) : (
        tasks.map(task => (
          <Card key={task._id} className="mb-4" style={{ backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', color: isDarkMode ? '#fff' : '#000' }}>
            <CardContent>
              {/* Task Title and Description */}
              <Typography variant="h5" fontWeight="bold" gutterBottom>{task.title}</Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {task.description}
              </Typography>
              <Typography variant="caption" color="textSecondary">Due: {new Date(task.endTime).toLocaleDateString()}</Typography>
              <Box className="flex justify-between items-center mt-4">
              {/* Status Dropdown */}
              <Box className="flex justify-between items-center m-2">
                <TextField
                  select
                  label="Status"
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Comments Section */}
              <Box className='flex gap-3' mt={2}>
                <TextField
                  label="Add a comment"
                  value={selectedTask === task._id ? comment : ''}
                  onChange={(e) => {
                    setSelectedTask(task._id);
                    setComment(e.target.value);
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }}
                />
                <Button
                  variant="contained"
                  className='w-[100px] font-medium'
                  color="primary"
                  onClick={() => handleAddComment(task._id)}
                  style={{ marginTop: '1px' }}
                >
                  Post
                </Button>
              </Box>
                  </Box>
              {/* Expand Comments */}
              <Button onClick={() => handleExpandClick(task._id)} style={{ marginTop: '16px', textTransform: 'none' }}>
                {expanded[task._id] ? "Hide Comments" : "View Comments"} {expanded[task._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Button>

              <Collapse in={expanded[task._id]} timeout="auto" unmountOnExit>
                <List dense>
                  {task.comments.map((comment, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>{comment.createdBy.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={comment.text}
                          secondary={
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                            >
                              {comment.createdBy}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Tasks;
