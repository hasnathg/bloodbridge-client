// src/components/home/CommunityCTA.jsx
import React from "react";
import { NavLink } from "react-router";
import { CheckCircle, ShieldCheck, Clock, MapPin } from "lucide-react";

const CommunityCTA = () => {
  return (
    <section className="relative bg-white">
      {/* Top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-1 rotate-180">
        <svg className="block w-full h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32V80H0Z" fill="#fee2e2" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-red-700">Join the BloodBridge Community</h2>
        <p className="mt-3 opacity-80 max-w-2xl mx-auto">
          Connect with verified donors, respond to urgent requests, and help save lives in your district and upazila.
        </p>

        {/* Inline feature points (no cards) */}
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <li className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-red-600" />
            Quick donor matches
          </li>
          <li className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            Safe & verified profiles
          </li>
          <li className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            Real-time status updates
          </li>
          <li className="flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Location-based search
          </li>
        </ul>

        {/* Your exact banner-style buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <NavLink to="/register">
            <button className="btn btn-outline btn-sm text-lg text-red-500 border-white">
              Join as a donor
            </button>
          </NavLink>
          <NavLink to="/search">
            <button className="btn bg-red-700 text-white hover:bg-red-800">
              Search donors
            </button>
          </NavLink>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-1">
        <svg className="block w-full h-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32V0H0Z" fill="#fee2e2" />
        </svg>
      </div>
    </section>
  );
};

export default CommunityCTA;
