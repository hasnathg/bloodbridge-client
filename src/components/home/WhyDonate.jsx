import React from 'react';
import donor from "../../assets/donation.jpg"
import { FaHandHoldingHeart, FaUsers, FaHeartbeat } from 'react-icons/fa';
import { NavLink } from 'react-router';

const WhyDonate = () => {
    return (
        
     <section className="relative bg-gray-50">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -translate-y-1">
        <svg
          className="block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32V80H0Z"
            fill="#fee2e2"  
          />
        </svg>
      </div>

      
      <div className="relative py-16 container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <div className="flex justify-center">
          <img
            src={donor}
            alt="Donate Blood"
            className="rounded-2xl shadow-lg w-full md:w-96 object-cover"
          />
        </div>

        
        <div>
          <h2 className="text-3xl font-bold text-red-700 mb-4">
            Why Donate Blood?
          </h2>
          <p className="text-gray-600 mb-6">
            Every drop counts. Donating blood can save lives and make the world a better place. Here’s why it matters:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <FaHandHoldingHeart className="text-red-600 text-xl" />
              Save lives and help patients in need
            </li>
            <li className="flex items-center gap-2">
              <FaUsers className="text-red-600 text-xl" />
              Support community health and emergencies
            </li>
            <li className="flex items-center gap-2">
              <FaHeartbeat className="text-red-600 text-xl" />
              Improve your own health through regular donation
            </li>
          </ul>
          <NavLink to="/about">
            <button className="my-4 btn bg-red-700 text-white hover:bg-red-800 pb-2">
            BloodBridge for you!
          </button>
          </NavLink>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-1 mt-2">
        <svg
          className="block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32V0H0Z"
            fill="#fee2e2"  
          />
        </svg>
      </div>
    </section>
    );
};

export default WhyDonate;