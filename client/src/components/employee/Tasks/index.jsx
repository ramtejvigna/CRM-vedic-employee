import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Calendar,
  Clock,
  Send,
} from "lucide-react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../../../store";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const EmptyState = ({ status }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col w-full bg-white dark:bg-gray-800 border-2 h-[400px] rounded-lg items-center justify-center p-6"
    >
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No {status.toLowerCase()} tasks available
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
        Check back later for new tasks or switch to a different status.
      </p>
    </motion.div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [statusOptions] = useState(["Pending", "In Progress", "Completed"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tasksPerPage] = useState(5);
  const [activeTab, setActiveTab] = useState("Pending");
  const [totalTasks, setTotalTasks] = useState(0);
  const employeeId = "66fec75778f1878ad8dd4c9b";
  const token = Cookies.get("token");
  const { isDarkMode } = useStore();

  useEffect(() => {
    fetchTasks();
  }, [employeeId, token, currentPage, activeTab]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        // `https://vedic-backend-neon.vercel.app/api/employee/tasks`,
        `http://localhost:3000/api/employee/tasks`,
        {
          params: {
            page: currentPage,
            limit: tasksPerPage,
            status: activeTab,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data)
      if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
        setTotalTasks(response.data.totalTasks);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `https://vedic-backend-neon.vercel.app/api/employee/tasks/${taskId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((tasks) =>
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleAddComment = async (taskId, newComment) => {

    try {
      console.log(newComment)
      setAddingComment(true);
      await axios.post(
        `https://vedic-backend-neon.vercel.app/api/employee/tasks/${taskId}/comments`,
        // `http://localhost:3000/api/employee/tasks/${taskId}/comments`,

        { newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((tasks) =>
        tasks.map((task) =>
          task._id === taskId
            ? { ...task, comments: [...task.comments, newComment] }
            : task
        )
      );
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`min-h-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {totalTasks} {activeTab.toLowerCase()} tasks available
          </p>
        </motion.div>

        {/* Enhanced Status Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-2">
              {statusOptions.map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTabChange(status)}
                  className={`
                    relative px-6 py-3 text-sm font-medium transition-all duration-200
                    ${
                      activeTab === status
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }
                  `}
                >
                  {status}
                  {activeTab === status && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
         ) : tasks.length === 0 ? (
          <EmptyState status={activeTab} />
        ) : (
          /* Task Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  key={task._id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  setSelectedTask={setSelectedTask}
                  isDarkMode={isDarkMode}
                />{" "}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Enhanced Pagination */}
        {tasks.length > 0 && activeTab !== 'Pending' && (
          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            className="flex justify-center items-center mt-12 gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                       border border-gray-200 dark:border-gray-700
                       hover:bg-gray-50 dark:hover:bg-gray-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </motion.button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2">
                    ...
                  </span>
                ) : (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page)}
                    className={`
                      w-10 h-10 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${
                        currentPage === page
                          ? "bg-blue-500 text-white shadow-lg ring-2 ring-blue-400 ring-opacity-50"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {page}
                  </motion.button>
                )
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                       border border-gray-200 dark:border-gray-700
                       hover:bg-gray-50 dark:hover:bg-gray-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* TaskModal */}
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
  );
};

// TaskCard component - keeping your original implementation
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
      className={`rounded-lg shadow-lg overflow-hidden ${
        isDarkMode ? "bg-gray-800" : "bg-white"
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
        <div className={`space-y-4 ${isExpanded ? "" : "hidden"}`}>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {task.description}
          </p>
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <p className="font-medium">Deadline :</p>
            <span
              className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {new Date(task.endTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-400" />
            <p className="font-medium">Assigned on :</p>

            <span
              className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {new Date(task.startTime).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
          <button
            onClick={() => {
              console.log("Viewing task details:", task);
              setSelectedTask(task);
            }}
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

// TaskModal component - keeping your original implementation
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
    if (localTask.status !== task.status) {
      await updateTaskStatus(localTask._id, localTask.status);
    }
    onClose();
  };

  const addComment = async () => {
    if (localComment.trim()) {
      const newComment = { text: localComment };
      await handleAddComment(localTask._id, newComment);
      setLocalComment("");
      setLocalTask((prevTask) => ({
        ...prevTask,
        comments: [...prevTask.comments, newComment],
      }));
    }
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
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{localTask.title}</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              } transition-colors duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {localTask.description}
          </p>
          <div className="flex items-center space-x-4">
            <p className="font-medium">Deadline :</p>
            <div className="flex items-center space-x-2">
              <Calendar
                size={20}
                className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              />
              <span>{new Date(localTask.endTime).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock
                size={20}
                className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              />
              <span>{new Date(localTask.endTime).toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="w-[210px]">
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              value={localTask.status}
              onChange={(e) =>
                setLocalTask({ ...localTask, status: e.target.value })
              }
              className={`w-full p-2 rounded-md ${
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-900"
              } border-none focus:ring-2 focus:ring-blue-500`}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            <div className="space-y-4 mb-4 max-h-40 overflow-y-auto">
              {localTask.comments.map((comment, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <p className="font-medium">{comment.createdBy}</p>
                  <p
                    className={`mt-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={localComment}
                onChange={(e) => setLocalComment(e.target.value)}
                placeholder="Add a comment..."
                className={`flex-grow p-2 rounded-md ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-900"
                } border-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                onClick={addComment}
                disabled={addingComment}
                className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 ${
                  addingComment ? "opacity-50 cursor-not-allowed" : ""
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
