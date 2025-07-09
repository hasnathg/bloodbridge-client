import React from 'react';
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router';
import Banner from './Banner';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
        </div>
    );
};

export default Home;