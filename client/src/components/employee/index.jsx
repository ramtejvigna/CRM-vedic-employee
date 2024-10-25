import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./signin";
import Home from "./Dashboard";
import SidenavEmp from "./Sidebar";
import { useStore } from "../../store";
import { Customers } from "./Customers";
import Tasks from "./Tasks";
import Customer from "./Customers/Customer";
import CheckBoxListPage from "./Customers/CheckBoxList";
import LeaveManagement from "./LeaveApply";
import BabyDatabase from "./BabyDatabase";
const EmployeeManagement = () => {
  const { isDarkMode } = useStore()
  return (

    <div className={`h-screen ${isDarkMode ? "bg-black" : "bg-slate-50"} overflow-hidden flex`}>
      {/* Sidebar with 20% width */}
      <SidenavEmp />

      {/* Main content area taking up 80% of the width */}
      <div className="flex-1 p-5 overflow-auto">
        {/* Render the Dashboard Navbar */}
        <Navbar />

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/leave" element={<LeaveManagement />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/babyDatabase" element={<BabyDatabase />} />
          <Route path="/customers/viewDetailsIn" element={<Customer />} />
          <Route path="/customers/viewDetailsIn/generate-pdf" element={<CheckBoxListPage />} />
          </Routes>
      </div>
    </div>
  )
}

export default EmployeeManagement;