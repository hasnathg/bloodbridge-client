import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const RootLayout = () => {
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

export default RootLayout;