import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          Contact Us
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Have questions or need assistance? We're here to help! Reach out to us
          anytime.
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center text-center bg-gray-100 rounded-lg p-6">
            <FaPhoneAlt className="text-red-500 text-3xl mb-3" />
            <h3 className="text-lg font-semibold">Phone</h3>
            <p className="text-gray-600 mt-1">+880 1234 567 890</p>
          </div>
          <div className="flex flex-col items-center text-center bg-gray-100 rounded-lg p-6">
            <FaEnvelope className="text-red-500 text-3xl mb-3" />
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="text-gray-600 mt-1">support@bloodbridge.com</p>
          </div>
          <div className="flex flex-col items-center text-center bg-gray-100 rounded-lg p-6">
            <FaMapMarkerAlt className="text-red-500 text-3xl mb-3" />
            <h3 className="text-lg font-semibold">Address</h3>
            <p className="text-gray-600 mt-1">Dhaka, Bangladesh</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 rounded-lg p-8 shadow-md">
          <h3 className="text-xl font-semibold mb-6 text-center text-red-600">
            Send us a message
          </h3>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                className="textarea textarea-bordered w-full"
                rows="5"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn bg-red-600 hover:bg-red-700 text-white w-full"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
    );
};

export default Contact;