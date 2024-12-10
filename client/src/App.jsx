import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminDashboard from "./components/admin-dashboard";
import EmployeeManagement from "./components/employee";
import ProtectedRoute from "./ProtectedRoute";
import Cookies from 'js-cookie'
import SignIn from "./components/employee/signin";
import { useEffect } from "react";
function App() {

  const navigate = useNavigate();
  const token = Cookies.get('token')

  useEffect(() => {
    const handleLogout = () => {
      try {
        const url = 'https://vedic-backend-neon.vercel.app/logout';
        
        // The payload with token in the body
        const payload = JSON.stringify({ token });

        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(url, blob);

        // Clear cookies
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } catch (error) {
        console.error("Logout failed on tab close:", error);
      }
    };


    const handleBeforeUnload = () => {
      handleLogout();
    };

    // Attach the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [token]);
  
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
