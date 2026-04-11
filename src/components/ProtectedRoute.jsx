import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if(loading) {
    return <p>Loading....</p>
  }

  if (!token) {
    
    return <Navigate to="/login" />;
  }

  return children;
}