import React from 'react';
import banner from '../../assets/banner2.JPG'
import { NavLink } from 'react-router';

const Banner = () => {
    return (
//      <div className="card image-full max-w-7xl mx-auto shadow-xl h-[500px] rounded-2xl overflow-hidden">
//   <figure className="h-full">
//     <img
//       src={banner}
//       alt="banner"
//       className="w-full h-full object-cover"
//     />
//   </figure>
//   <div className="card-body p-4 text-center justify-center pt-24">
//     <h3 className=" text-center text-5xl font-bold text-red-500">Welcome to BloodBridge</h3>
    
//     <h2 className=" text-center text-2xl font-semibold pt-16">Connecting Donors, Saving Lives</h2>
//     <p className="text-sm max-w-md text-center mx-auto ">A reliable platform for blood donation and emergency support.</p>
//     <div className="card-actions gap-8 flex justify-center pb-16">
//       <NavLink to ="/register"><button className="btn btn-outline btn-sm text-lg  text-red-500 border-white ">Join as a donor</button></NavLink>
//       <NavLink to="/search"><button className="btn btn-outline btn-sm text-lg text-red-500 border-white">Search donors</button></NavLink>
//     </div>
//   </div>
// </div>
 <section className="max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="relative h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-xl">
        {/* image */}
        <img
          src={banner}
          alt="Blood donation awareness"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />

        {/* content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h3 className="text-5xl font-bold text-red-500">Welcome to BloodBridge</h3>

          <h2 className="text-2xl font-semibold pt-8 md:pt-12 text-base-content">
            Connecting Donors, Saving Lives
          </h2>
          <p className="text-sm max-w-md mx-auto mt-2 text-base-content/80">
            A reliable platform for blood donation and emergency support.
          </p>

          <div className="mt-10 flex gap-4">
            <NavLink to="/register">
              <button className="btn btn-outline btn-sm text-lg text-red-500 border-white">
                Join as a donor
              </button>
            </NavLink>
            <NavLink to="/search">
              <button className="btn btn-outline btn-sm text-lg text-red-500 border-white">
                Search donors
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </section>

    );
};

export default Banner;