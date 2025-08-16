import React from 'react';
import Navbar from '../components/navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/footer/Footer';

const PrivateLayout = () => {
    return (
         <div className="flex flex-col min-h-screen">
     
      <Navbar />

      
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

     
      <Footer />
    </div>
    );
};

export default PrivateLayout;