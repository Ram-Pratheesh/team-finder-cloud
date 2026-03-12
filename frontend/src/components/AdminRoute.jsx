import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
