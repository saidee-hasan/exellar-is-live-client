// src/components/PrivateRoute.js
import React, { useContext } from "react";

import { Navigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import useAuth from "../hooks/useAuth";


function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="text-center mt-52">
        {" "}
        <span className="loading loading-dots loading-lg "></span>
      </div>
    );
  }
  if (user) {
    return children; // Render children if user is authenticated
  }

  return <Navigate to="/login" />; // Redirect to login if not authenticated
}

export default PrivateRoute;
