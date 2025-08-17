// src/components/home/SuccessStory.jsx
import React from "react";
import { NavLink } from "react-router";

export default function SuccessStory() {
  
  return (
    <section className="relative">
      {/* Mobile: text-only (image hidden) */}
      <div className="md:hidden max-w-screen-xl mx-auto px-4 py-12">
        <article className="relative bg-green-50 rounded-xl shadow p-6">
          {/* slim red accent bar */}
          <div className="absolute -top-0.5 left-0 right-0 h-1 bg-red-200 rounded-t-xl" />

          <h3 className="text-2xl font-bold text-red-700">
            “Arif found an O- donor in 15 minutes.”
          </h3>
          <p className="opacity-80 text-sm mt-2">
            When Arif’s father needed an urgent transfusion, his family posted a request on BloodBridge.
            Within minutes, a nearby donor responded. They met at Dhaka Medical, and the surgery went ahead
            the same day. “We’re grateful to every donor who keeps this community alive.”
          </p>
          <div className="mt-4">
            <NavLink
              to="/donation-request"
              className="btn btn-outline btn-sm text-lg text-red-500 border-white"
            >
              See pending requests
            </NavLink>
          </div>
        </article>
      </div>

      {/* Tablet/Desktop: image with overlay card */}
      <div className="hidden md:block max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="relative rounded-2xl overflow-hidden">
          {/* background image */}
          <div className="aspect-[16/9] w-full">
            <img
              src="https://plus.unsplash.com/premium_photo-1682092071595-2c330d1b45b8?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="A donor and recipient meeting at the hospital"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* overlay card (matches your card style) */}
          <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-[520px] bg-green-50 rounded-xl shadow p-6">
            <div className="absolute -top-0.5 left-0 right-0 h-1 bg-red-200 rounded-t-xl" />

            <h3 className="text-2xl font-bold text-red-700">
              “Arif found an O- donor in 15 minutes.”
            </h3>
            <p className="opacity-80 text-sm mt-2">
              When Arif’s father needed an urgent transfusion, his family posted a request on BloodBridge.
              Within minutes, a nearby donor responded. They met at Dhaka Medical, and the surgery went ahead
              the same day. “We’re grateful to every donor who keeps this community alive.”
            </p>
            <div className="mt-4">
              <NavLink
                to="/donation-request"
                className="btn btn-outline btn-sm text-lg text-red-500 border-white"
              >
                See pending requests
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom curve to separate from Contact Us */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-1 pointer-events-none">
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
}
