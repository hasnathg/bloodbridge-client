import React from 'react';

const ContactUs = () => {
    return (
        <div>
            <section className="py-12 bg-gradient-to-r from-red-400 to-red-800 text-white rounded-2xl">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <p className="mb-4">Have any questions or need emergency support? We're here to help.</p>
            <p className="mb-2"><strong>Phone:</strong> +880 1234 567 890</p>
            <p className="mb-2"><strong>Email:</strong> support@bloodbridge.com</p>
            <p><strong>Address:</strong> Dhaka, Bangladesh</p>
          </div>

          {/* Contact Form */}
          <form className="bg-white text-black p-6 rounded-xl shadow-md">
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Name</label>
              <input type="text" placeholder="Your Name" className="input input-bordered w-full" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Email</label>
              <input type="email" placeholder="Your Email" className="input input-bordered w-full" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Message</label>
              <textarea placeholder="Your Message" className="textarea textarea-bordered w-full"></textarea>
            </div>
            <button type="submit" className="btn bg-red-600 text-white hover:bg-red-700 w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
        </div>
    );
};

export default ContactUs;