import React from 'react';
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router';
import Banner from './Banner';
import FeatureSection from './FeatureSection';
import ContactUs from './ContactUs';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <FeatureSection></FeatureSection>
            <ContactUs></ContactUs>
            
        </div>
    );
};

export default Home;