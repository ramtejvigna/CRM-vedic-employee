import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/admin-dashboard";
import EmployeeManagement from "./components/employee";
import ProtectedRoute from "./ProtectedRoute";
import Cookies from 'js-cookie'
import SignIn from "./components/employee/signin";
function App() {
  
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={<ProtectedRoute component={AdminDashboard} isAdminRoute={true} />} 
        />

        {/* Employee Routes */}
        <Route 
          path="/employee/*" 
          element={<ProtectedRoute component={EmployeeManagement} isAdminRoute={false} />} 
        />
      </Routes>
  );
}

export default App;
