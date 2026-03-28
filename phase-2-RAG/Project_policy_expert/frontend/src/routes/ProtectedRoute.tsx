import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/signin" />;
  return <Outlet />;
};

export default ProtectedRoute;
