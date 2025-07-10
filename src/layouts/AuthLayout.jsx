import React from 'react';
import { Outlet } from 'react-router';
import authlogo from '../assets/auth.JPG'
import logo from '../assets/logo4.JPG'

const AuthLayout = () => {
    return (
        <div className="bg-base-200">
            <div className='flex justify-items-start pt-4'>
              <img src={logo} alt="logo" className='w-8 h-6'/>
              <p className='text-red-950 font-bold'>BloodBridge</p>
            </div>
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className='flex-1'>
         <img
      src= {authlogo}
      className="max-w-sm rounded-lg shadow-2xl"
    />
    </div>
    <div className='flex-1'>
      <Outlet></Outlet>
    </div>
  </div>
</div>
    );
};

export default AuthLayout;