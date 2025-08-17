import React from 'react';
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router';
import Banner from './Banner';
import FeatureSection from './FeatureSection';
import ContactUs from './ContactUs';
import WhyDonate from './WhyDonate';
import RecentRequests from './RecentRequests';
import HowItWorks from './HowItWorks';
import SuccessStory from './SuccessStory';
import CommunityCTA from './CommunityCTA';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <WhyDonate></WhyDonate>
            <FeatureSection></FeatureSection>
            <RecentRequests></RecentRequests>
            <HowItWorks></HowItWorks>
            <CommunityCTA></CommunityCTA>
            <SuccessStory></SuccessStory>
            <ContactUs></ContactUs>
            
        </div>
    );
};

export default Home;