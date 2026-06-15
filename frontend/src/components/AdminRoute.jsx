import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route protection wrapper requiring administrative credentials clearance level.
 */
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-blue-400 border-r-transparent border-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    // Redirect to admin authentication portal
    return <Navigate to="/login?admin=true" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;

