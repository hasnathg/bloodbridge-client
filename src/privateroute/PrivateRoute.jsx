import React from 'react';
import { useAuth } from '../provider/AuthContext';
import { useLocation } from 'react-router';

const PrivateRoute = ({children}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          
          <div className="w-12 h-12 bg-red-500 rounded-full animate-bounce shadow-lg relative">
            <div className="w-2 h-2 bg-white rounded-full absolute top-2 right-2 opacity-80" />
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default PrivateRoute;