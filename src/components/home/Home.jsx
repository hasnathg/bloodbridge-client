import React from 'react';
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router';
import Banner from './Banner';
import FeatureSection from './FeatureSection';
import ContactUs from './ContactUs';
import WhyDonate from './WhyDonate';
import RecentRequests from './RecentRequests';
import HowItWorks from './HowItWorks';
import ImpactStats from './ImpactStats';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <WhyDonate></WhyDonate>
            <FeatureSection></FeatureSection>
            <RecentRequests></RecentRequests>
            <HowItWorks></HowItWorks>
            <ImpactStats></ImpactStats>
            <ContactUs></ContactUs>
            
        </div>
    );
};

export default Home;