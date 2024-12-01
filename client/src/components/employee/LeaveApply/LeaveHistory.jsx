import React, { useEffect, useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Info as InfoIcon, Close as CloseIcon, CalendarToday as CalendarIcon, AccessTime as AccessTimeIcon } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { differenceInDays } from "date-fns";
import EmptyState from "./Empty";
import Snackbar from "@mui/material/Snackbar";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Chip } from "@mui/material";

const LeaveHistory = ({
  leaveHistory,
  setLeaveHistory,
  selectedLeave,
  setSelectedLeave,
  dialogOpen,
  setDialogOpen,
  snackbar,
  setSnackbar,
  getStatusColor,
  theme
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveDetails = (leave) => {
    setSelectedLeave(leave);
    setDialogOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
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

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {leaveHistory.length === 0 ? (
        <EmptyState text="history" />
      ) : (
        <>
          <Table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <TableHead className="bg-gray-200 dark:bg-gray-700">
              <TableRow>
                <TableCell className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300  tracking-wider">
                  S.No
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300  tracking-wider">
                  Leave Type
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300  tracking-wider">
                 From
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300  tracking-wider">
                  To
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300  tracking-wider">
                  Duration
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300  tracking-wider">
                  Status
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300  tracking-wider">
                  Leave Applied Date
                </TableCell>
                <TableCell className="px-6 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-300  tracking-wider">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {leaveHistory
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((leave, index) => (
                    <motion.tr
                      key={leave._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {leave.leaveType}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {new Date(
                          leave.startDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {new Date(
                          leave.endDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {differenceInDays(
                          new Date(leave.endDate),
                          new Date(leave.startDate)
                        ) + 1}{" "}
                        days
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            leave.status
                          )}`}
                        >
                          {leave.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {leave.createdAt
                          ? new Date(
                              leave.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleLeaveDetails(leave)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-4"
                        >
                          <InfoIcon size={18} />
                        </button>
                      </TableCell>
                    </motion.tr>
                  ))}
              </AnimatePresence>
            </TableBody>
          </Table>

          <div
            className={`px-4 py-3 flex items-center justify-between border-t sm:px-6`}
          >
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 0));
                }}
                disabled={page === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  setPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(leaveHistory.length / rowsPerPage) - 1
                    )
                  );
                }}
                disabled={
                  page ===
                  Math.ceil(leaveHistory.length / rowsPerPage) - 1
                }
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing {page * rowsPerPage + 1} to{" "}
                  {Math.min(
                    (page + 1) * rowsPerPage,
                    leaveHistory.length
                  )}{" "}
                  of {leaveHistory.length} results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => {
                      setPage((prev) => Math.max(prev - 1, 0));
                    }}
                    disabled={page === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      theme.palette.mode === "dark"
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-300 bg-white"
                    } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                  >
                    Previous
                  </button>
                  {Array.from(
                    {
                      length: Math.ceil(
                        leaveHistory.length / rowsPerPage
                      ),
                    },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          theme.palette.mode === "dark"
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-300 bg-white"
                        } text-sm font-medium ${
                          page === i
                            ? "text-indigo-600"
                            : "text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => {
                      setPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(
                            leaveHistory.length / rowsPerPage
                          ) - 1
                        )
                      );
                    }}
                    disabled={
                      page ===
                      Math.ceil(leaveHistory.length / rowsPerPage) - 1
                    }
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      theme.palette.mode === "dark"
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-300 bg-white"
                    } text-sm font-medium text-gray-500 hover:bg-gray-50`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}

      <Transition appear show={dialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl ${
                    theme.palette.mode === "dark" ? "bg-slate-800" : "bg-white"
                  } p-6 shadow-xl transition-all`}
                >
                  <div className="relative">
                    <button
                      onClick={() => setDialogOpen(false)}
                      className={`absolute right-0 top-0 p-1 rounded-full ${
                        theme.palette.mode === "dark"
                          ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                          : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                      } transition-colors`}
                    >
                      <X size={20} />
                    </button>

                    <div className="space-y-4">
                      <Dialog.Title
                        className={`text-lg font-medium ${
                          theme.palette.mode === "dark" ? "text-white" : "text-slate-900"
                        }`}
                      >
                        Leave Details
                      </Dialog.Title>

                      <div className="space-y-3">
                        <div>
                          <h4
                            className={`text-sm font-medium ${
                              theme.palette.mode === "dark" ? "text-slate-200" : "text-slate-700"
                            }`}
                          >
                            Leave Type
                          </h4>
                          <p
                            className={`mt-1 text-sm ${
                              theme.palette.mode === "dark" ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {selectedLeave?.leaveType}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <CalendarIcon
                            size={16}
                            className={
                              theme.palette.mode === "dark" ? "text-slate-400" : "text-slate-500"
                            }
                          />
                          <p className="text-sm font-sans">Date Range: </p>
                          <span
                            className={`text-sm ${
                              theme.palette.mode === "dark" ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            {new Date(selectedLeave?.startDate).toLocaleDateString()} -{" "}
                            {new Date(selectedLeave?.endDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <AccessTimeIcon
                            size={16}
                            className={
                              theme.palette.mode === "dark" ? "text-slate-400" : "text-slate-500"
                            }
                          />
                          <p className="text-sm font-sans">Duration: </p>
                          <span
                            className={`text-sm ${
                              theme.palette.mode === "dark" ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            {Math.ceil(
                              (new Date(selectedLeave?.endDate) -
                                new Date(selectedLeave?.startDate)) /
                                (1000 * 60 * 60 * 24)
                            ) + 1}{" "}
                            days
                          </span>
                        </div>

                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              selectedLeave?.status
                            )}`}
                          >
                            {selectedLeave?.status}
                          </span>
                        </div>

                        <div>
                          <h4
                            className={`text-sm font-medium ${
                              theme.palette.mode === "dark" ? "text-slate-200" : "text-slate-700"
                            }`}
                          >
                            Reason
                          </h4>
                          <p
                            className={`mt-1 text-sm ${
                              theme.palette.mode === "dark" ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {selectedLeave?.reason}
                          </p>
                        </div>

                        {selectedLeave?.adminComments && (
                          <div>
                            <h4
                              className={`text-sm font-medium ${
                                theme.palette.mode === "dark" ? "text-slate-200" : "text-slate-700"
                              }`}
                            >
                              Admin Comments
                            </h4>
                            <p
                              className={`mt-1 text-sm ${
                                theme.palette.mode === "dark" ? "text-slate-400" : "text-slate-600"
                              }`}
                            >
                              {selectedLeave?.adminComments}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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

export default LeaveHistory;
