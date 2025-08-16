import React from 'react';
import image from './../../assets/banner2.JPG'
import { Link } from 'react-router';

const AboutUs = () => {
    return (
         <div className="bg-gray-50 mt-2">
      {/* Hero Section */}
      <section className="bg-red-700 text-white text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold">About BloodBridge</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Connecting lives through blood donation – because every drop counts.
        </p>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={image}
            alt="About Blood Donation"
            className="rounded-xl shadow-lg w-full max-w-lg"
          />
        </div>

        
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            BloodBridge is a platform designed to make blood donation easy and accessible. 
            Our mission is to connect donors with those in need, creating a life-saving 
            community where every contribution matters.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We work tirelessly to ensure that no patient has to wait for blood during critical times. 
            Our services are free, transparent, and available for everyone, everywhere.
          </p>

          <Link
            to="/search"
            className="btn bg-red-700 text-white hover:bg-red-800"
          >
            Become a Donor
          </Link>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Our Mission & Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-red-700 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To provide an easy-to-use platform that connects blood donors and recipients 
                in real-time, saving lives through collaboration and technology.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-red-700 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A world where blood shortages no longer threaten lives – where every person 
                has access to safe and timely blood donations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-red-700 text-white py-12">
        <h2 className="text-3xl font-bold mb-4">
          Join Us in Saving Lives
        </h2>
        <p className="mb-6 max-w-xl mx-auto text-lg">
          Your donation can make the difference between life and death. Sign up today and be a hero.
        </p>
        <Link
          to="/register"
          className="btn bg-white text-red-700 font-semibold hover:bg-gray-200"
        >
          Join as a Donor
        </Link>
      </section>
    </div>
    );
};

export default AboutUs;