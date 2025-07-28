import React from 'react';
import { NavLink, Outlet } from 'react-router';
import authlogo from '../assets/auth.JPG'
import logo from '../assets/logo4.JPG'

const AuthLayout = () => {
  return (
    <div className="bg-base-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 pt-4 px-6">
        <NavLink to="/">
          <img src={logo} alt="logo" className="w-8 h-6" />
        </NavLink>
        <p className="text-red-950 font-bold text-lg">BloodBridge</p>
      </div>

      {/* Main Auth Container */}
      <div className="flex flex-1 items-center justify-center px-4 py-6 bg-gray-100">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-2">
          
          {/* Image Section */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg shadow-lg p-4">
            <img
              src={authlogo}
              alt="Auth Illustration"
              className="w-full h-auto max-h-[500px] object-contain rounded-lg"
            />
          </div>

          {/* Form Section */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg shadow-lg p-8">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;