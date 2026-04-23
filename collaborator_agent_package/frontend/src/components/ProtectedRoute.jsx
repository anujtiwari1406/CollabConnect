import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>; // You can replace this with a better spinner
  }

  if (!user) {
    // Redirect to landing page if not logged in
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
