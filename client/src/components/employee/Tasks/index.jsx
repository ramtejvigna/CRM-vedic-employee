import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Eye, Calendar, Clock, Send } from "lucide-react";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { useStore } from "../../../store";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [statusOptions] = useState(["Pending", "In Progress", "Completed"]);
  const employeeId = "66fec75778f1878ad8dd4c9b";
  const token = Cookies.get("token");
  const { enqueueSnackbar } = useSnackbar();
  const { isDarkMode } = useStore();

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
        enqueueSnackbar("Failed to fetch tasks", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [employeeId, token, enqueueSnackbar]);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/employee/tasks/${taskId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((tasks) =>
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      enqueueSnackbar("Task status updated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error updating status:", error);
      enqueueSnackbar("Failed to update task status", { variant: "error" });
    }
  };

  const handleAddComment = async (taskId, newComment) => {
    try {
      setAddingComment(true);
      await axios.post(
        `http://localhost:3000/api/employee/tasks/${taskId}/comments`,
        { newComment }, // Send the newComment object correctly
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((tasks) =>
        tasks.map((task) =>
          task._id === taskId ? { ...task, comments: [...task.comments, newComment] } : task
        )
      );
      enqueueSnackbar("Comment added successfully", { variant: "success" });
    } catch (error) {
      console.error("Error adding comment:", error);
      enqueueSnackbar("Failed to add comment", { variant: "error" });
    } finally {
      setAddingComment(false);
    }
  };
  

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className={`min-h-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Tasks</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center text-xl">No tasks assigned.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                updateTaskStatus={updateTaskStatus}
                setSelectedTask={setSelectedTask}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            updateTaskStatus={updateTaskStatus}
            statusOptions={statusOptions}
            comment={comment}
            setComment={setComment}
            handleAddComment={handleAddComment}
            addingComment={addingComment}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, updateTaskStatus, setSelectedTask, isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const toggleCard = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <button
            onClick={toggleCard}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
          >
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
        <div className={`space-y-4 ${isExpanded ? '' : 'hidden'}`}>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{task.description}</p>
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {new Date(task.endTime).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <button
            onClick={() => setSelectedTask(task)}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition-colors duration-200"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TaskModal = ({
  task,
  onClose,
  updateTaskStatus,
  statusOptions,
  comment,
  setComment,
  handleAddComment,
  addingComment,
  isDarkMode,
}) => {
  const [localTask, setLocalTask] = useState(task);
  const [localComment, setLocalComment] = useState("");

  useEffect(() => {
    setLocalTask(task);
    setLocalComment(comment);
  }, [task, comment]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleSave = async () => {
    // Update task status
    if (localTask.status !== task.status) {
      await updateTaskStatus(localTask._id, localTask.status);
    }

    // Add new comments
    if (localComment.trim()) {
      const username = Cookies.get("username");
      const newComment = { text: localComment, createdBy: username };
      await handleAddComment(localTask._id, newComment);
    }

    // Close the modal
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{localTask.title}</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{localTask.description}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span>{new Date(localTask.endTime).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span>{new Date(localTask.endTime).toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="w-[210px]">
            <label htmlFor="status" className="block text-sm font-medium mb-2">Status</label>
            <select
              id="status"
              value={localTask.status}
              onChange={(e) => setLocalTask({ ...localTask, status: e.target.value })}
              className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                } border-none focus:ring-2 focus:ring-blue-500`}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            <div className="space-y-4 mb-4 max-h-40 overflow-y-auto">
              {task.comments.map((comment, index) => (
                <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="font-medium">{comment.createdBy}</p>
                  <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{comment.text}</p>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={localComment}
                onChange={(e) => setLocalComment(e.target.value)}
                placeholder="Add a comment..."
                className={`flex-grow p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  } border-none focus:ring-2 focus:ring-blue-500`}
              />
              {/* <button
                onClick={async () => {
                  if (localComment.trim()) {
                    const username = Cookies.get("username");
                    const newComment = { text: localComment, createdBy: username };
                    await handleAddComment(localTask._id, newComment);
                    setLocalComment("");
                  }
                }}
                disabled={addingComment}
                className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 ${addingComment ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {addingComment ? 'Adding...' : 'Add'}
              </button> */}
              <button
                onClick={async () => {
                  if (localComment.trim()) {
                    const newComment = { text: localComment};
                    await handleAddComment(localTask._id, newComment);
                    setLocalComment("");
                  }
                }}
                disabled={addingComment}
                className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 ${addingComment ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors duration-200`}
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Tasks;
