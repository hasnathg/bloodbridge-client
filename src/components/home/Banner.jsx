import React from 'react';
import banner from '../../assets/banner2.JPG'

const Banner = () => {
    return (
     <div className="card image-full max-w-7xl mx-auto shadow-xl h-[500px] rounded-2xl overflow-hidden">
  <figure className="h-full">
    <img
      src={banner}
      alt="banner"
      className="w-full h-full object-cover"
    />
  </figure>
  <div className="card-body p-4 text-center justify-center pt-24">
    <h3 className=" text-center text-2xl font-bold text-red-500">Welcome to BloodBridge</h3>
    <h2 className=" text-center text-lg font-semibold">Connecting Donors, Saving Lives</h2>
    <p className="text-sm max-w-md text-center mx-auto ">A reliable platform for blood donation and emergency support.</p>
    <div className="card-actions flex justify-center pb-16">
      <button className="btn btn-outline btn-sm  text-red-500 border-white ">Join as a donor</button>
      <button className="btn btn-outline btn-sm text-red-500 border-white">Search donors</button>
    </div>
  </div>
</div>

    );
};

export default Banner;