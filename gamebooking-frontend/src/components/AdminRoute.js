import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Not admin
  if (role !== "Admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default AdminRoute;