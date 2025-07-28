import React from 'react';

const ContactUs = () => {
    return (
       <section className="py-10 bg-gradient-to-r from-red-800 to-red-400 text-white rounded-2xl">
  <div className="container mx-auto px-4 md:px-8">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black">Contact Us</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
      {/* Contact Info */}
      <div className="space-y-2 text-white mt-4">
        <h3 className="text-3xl font-semibold mb-4">Get in Touch</h3>
        <p className="mb-4  md:text-xl ">Have questions or need emergency support? We're here to help.</p>
        <p className="mb-1 md:text-xl"><strong>Phone:</strong> +880 1234 567 890</p>
        <p className="mb-1 md:text-xl"><strong>Email:</strong> support@bloodbridge.com</p>
        <p className="md:text-xl"><strong>Address:</strong> Dhaka, Bangladesh</p>
      </div>

      {/* Contact Form */}
      <form className="bg-white text-black p-4 md:p-6 rounded-xl shadow-md">
        <div className="mb-3">
          <label className="block mb-1 font-semibold text-sm">Name</label>
          <input type="text" placeholder="Your Name" className="input input-bordered w-full h-10 text-sm" />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-semibold text-sm">Email</label>
          <input type="email" placeholder="Your Email" className="input input-bordered w-full h-10 text-sm" />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-semibold text-sm">Message</label>
          <textarea placeholder="Your Message" className="textarea textarea-bordered w-full text-sm" rows={3}></textarea>
        </div>
        <button type="submit" className="btn bg-red-700 text-white hover:bg-red-700 w-full text-sm">
          Send Message
        </button>
      </form>
    </div>
  </div>
</section>

    );
};

export default ContactUs;