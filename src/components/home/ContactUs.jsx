import React from 'react';

const ContactUs = () => {
    return (
        <div>
            <section className="min-h-[400px] py-6 bg-gradient-to-r from-red-800 to-red-400 text-white rounded-2xl">
  <div className="container mx-auto px-4 md:px-8">
    <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Contact Info */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Get in Touch</h3>
        <p className="mb-2 text-sm">Have any questions or need emergency support? We're here to help.</p>
        <p className="mb-1 text-sm"><strong>Phone:</strong> +880 1234 567 890</p>
        <p className="mb-1 text-sm"><strong>Email:</strong> support@bloodbridge.com</p>
        <p className="text-sm"><strong>Address:</strong> Dhaka, Bangladesh</p>
      </div>

      {/* Contact Form */}
      <form className="bg-white text-black p-4 rounded-xl shadow-md">
        <div className="mb-2">
          <label className="block mb-1 font-semibold text-sm">Name</label>
          <input type="text" placeholder="Your Name" className="input input-bordered w-full h-10 text-sm" />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-semibold text-sm">Email</label>
          <input type="email" placeholder="Your Email" className="input input-bordered w-full h-10 text-sm" />
        </div>
        <div className="mb-2">
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
        </div>
    );
};

export default ContactUs;