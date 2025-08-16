import { Heart, Search, ShieldCheck, Users } from 'lucide-react';
import React from 'react';

const features = [
  {
    icon: <Search size={36} className="text-red-600" />,
    title: "Fast Donor Search",
    description: "Find donors instantly by blood group and location."
  },
  {
    icon: <ShieldCheck size={36} className="text-red-600" />,
    title: "Secure & Reliable",
    description: "Verified donors and safe connections every time."
  },
  {
    icon: <Users size={36} className="text-red-600" />,
    title: "Role-Based Dashboard",
    description: "Separate dashboards for donors, admins, and volunteers."
  },
  {
    icon: <Heart size={36} className="text-red-600" />,
    title: "Emergency Support",
    description: "Quick response during critical situations."
  }
];


const FeatureSection = () => {
    return (
        
           <section className="py-16 bg-gradient-to-r from-warm-white to-warm-white rounded-2xl">
  <div className="container mx-auto text-center">
    <h2 className="text-3xl font-bold text-red-700 mb-8">
      Why Choose BloodBridge?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-green-50 shadow-md p-6 rounded-xl hover:shadow-lg transition"
        >
          <div className="flex justify-center mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600  min-h-12">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
        
    );
};

export default FeatureSection;