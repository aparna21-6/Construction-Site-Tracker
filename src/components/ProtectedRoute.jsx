import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, authLoading, currentUser } = useAuth();

  if (authLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/projects" replace />;
  }

  return children;
}

export default ProtectedRoute;