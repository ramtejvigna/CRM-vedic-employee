// TaskManagement.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie'
const Tasks = () => {
//   const { employeeId } = useParams();  // Assuming you're using React Router
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusOptions] = useState(['Pending', 'In Progress', 'Completed']);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');
const employeeId = '66fec75778f1878ad8dd4c9b'
  // Fetch tasks assigned to the employee
  const token = Cookies.get('token')
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/employee/tasks`,{
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

  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/employee/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Add comment to task
  const handleAddComment = async (taskId) => {
    try {
      await axios.post(`http://localhost:3000/api/tasks/${taskId}/comment`, { text: comment, createdBy: employeeId });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, comments: [...task.comments, { text: comment }] } : task));
      setComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Typography variant="h4" gutterBottom>My Tasks</Typography>
      {loading ? (
        <CircularProgress />
      ) : tasks.length === 0 ? (
        <Typography>No tasks assigned.</Typography>
      ) : (
        tasks?.map(task => (
          <Card key={task._id} className="mb-4">
            <CardContent>
              <Typography variant="h6">{task.title}</Typography>
              <Typography variant="body2" color="textSecondary">{task.description}</Typography>
              <Typography variant="caption" color="textSecondary">Due: {new Date(task.endTime).toLocaleDateString()}</Typography>

              <div className="flex justify-between items-center mt-4">
                <TextField
                  select
                  label="Status"
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  variant="outlined"
                  size="small"
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Add a comment"
                  value={selectedTask === task._id ? comment : ''}
                  onChange={(e) => {
                    setSelectedTask(task._id);
                    setComment(e.target.value);
                  }}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddComment(task._id)}
                >
                  Add Comment
                </Button>
              </div>

              <Typography variant="subtitle2" className="mt-2">Comments:</Typography>
              <ul>
                {task.comments.map((comment, index) => (
                  <li key={index}>
                    <Typography variant="body2">{comment.text} (by {comment.createdBy})</Typography>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Tasks;
