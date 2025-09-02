import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = sessionStorage.getItem("token"); // 👈 using sessionStorage

  if (!token) {
    // 🚨 No token → kick user to login
    return <Navigate to="/login" replace />;
  }

  return children;
}
