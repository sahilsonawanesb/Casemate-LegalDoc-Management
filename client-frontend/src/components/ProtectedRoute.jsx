import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";



const ProtectedRoutes = ({children}) => {
    const {isAuthenticated, loading} = useAuth();

    if(loading){
        return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />

}

export default ProtectedRoutes;