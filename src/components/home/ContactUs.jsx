import { useForm, ValidationError } from '@formspree/react';
import React from 'react';

const FORM_ID = "xanbzqnz";

const ContactUs = () => {
  const [state, handleSubmit] = useForm(FORM_ID);
    return (
//        <section className="py-10 bg-gradient-to-r from-red-800 to-red-400 text-white rounded-2xl">
//   <div className="container mx-auto px-4 md:px-8">
//     <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black">Contact Us</h2>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
//       {/* Contact Info */}
//       <div className="space-y-2 text-white mt-4">
//         <h3 className="text-3xl font-semibold mb-4">Get in Touch</h3>
//         <p className="mb-4  md:text-xl ">Have questions or need emergency support? We're here to help.</p>
//         <p className="mb-1 md:text-xl"><strong>Phone:</strong> +880 1234 567 890</p>
//         <p className="mb-1 md:text-xl"><strong>Email:</strong> support@bloodbridge.com</p>
//         <p className="md:text-xl"><strong>Address:</strong> Dhaka, Bangladesh</p>
//       </div>

//       {/* Contact Form */}
//       <form className="bg-white text-black p-4 md:p-6 rounded-xl shadow-md">
//         <div className="mb-3">
//           <label className="block mb-1 font-semibold text-sm">Name</label>
//           <input type="text" placeholder="Your Name" className="input input-bordered w-full h-10 text-sm" />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1 font-semibold text-sm">Email</label>
//           <input type="email" placeholder="Your Email" className="input input-bordered w-full h-10 text-sm" />
//         </div>
//         <div className="mb-3">
//           <label className="block mb-1 font-semibold text-sm">Message</label>
//           <textarea placeholder="Your Message" className="textarea textarea-bordered w-full text-sm" rows={3}></textarea>
//         </div>
//         <button type="submit" className="btn bg-red-700 text-white hover:bg-red-700 w-full text-sm">
//           Send Message
//         </button>
//       </form>
//     </div>
//   </div>
// </section>
<section className="py-10 bg-gradient-to-r from-red-800 to-red-400 text-white rounded-2xl">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black">Contact Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          {/* Contact Info (unchanged) */}
          <div className="space-y-2 text-white mt-4">
            <h3 className="text-3xl font-semibold mb-4">Get in Touch</h3>
            <p className="mb-4 md:text-xl">
              Have questions or need emergency support? We're here to help.
            </p>
            <p className="mb-1 md:text-xl"><strong>Phone:</strong> +880 1234 567 890</p>
            <p className="mb-1 md:text-xl"><strong>Email:</strong> support@bloodbridge.com</p>
            <p className="md:text-xl"><strong>Address:</strong> Dhaka, Bangladesh</p>
          </div>

          {/* Formspree-powered form */}
          {state.succeeded ? (
            <div className="bg-white text-black p-4 md:p-6 rounded-xl shadow-md flex items-center justify-center">
              <p className="font-semibold">Thanks! We got your message and will reply soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white text-black p-4 md:p-6 rounded-xl shadow-md">
              {/*  honeypot ( invisible to users) */}
              <div className="sr-only" aria-hidden="true">
                <label>
                  Leave this field blank
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    className="sr-only"
                  />
                </label>
              </div>

              {/*  subject for  inbox */}
              <input type="hidden" name="_subject" value="New message from BloodBridge" />

              <div className="mb-3">
                <label className="block mb-1 font-semibold text-sm">Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered w-full h-10 text-sm"
                  required
                />
                {/* Name isn't validated by Formspree by default, so no ValidationError needed here */}
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold text-sm">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  className="input input-bordered w-full h-10 text-sm"
                  required
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold text-sm">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  className="textarea textarea-bordered w-full text-sm"
                  rows={3}
                  required
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} />
              </div>

              <button
                type="submit"
                disabled={state.submitting}
                className="btn bg-red-700 text-white hover:bg-red-700 w-full text-sm"
              >
                {state.submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>

    );
};

export default ContactUs;