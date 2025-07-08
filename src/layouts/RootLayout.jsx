import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;