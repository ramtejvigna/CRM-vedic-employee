import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ component: Component, isAdminRoute }) => {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  const decodedToken = jwtDecode(token);
  const isAdmin = decodedToken.isAdmin;

  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/employee" replace />;
  }

  if (!isAdminRoute && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
