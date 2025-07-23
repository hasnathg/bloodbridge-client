import React, { useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";

const Job = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const jobs = [
    {
      id: 1,
      title: "Volunteer Coordinator",
      location: "Dhaka, Bangladesh",
      type: "Full Time",
      description:
        "Coordinate blood donation events, manage volunteers, and build partnerships with local hospitals.",
    },
    {
      id: 2,
      title: "Medical Officer",
      location: "Chattogram, Bangladesh",
      type: "Part Time",
      description:
        "Oversee blood collection process and ensure compliance with safety standards.",
    },
    {
      id: 3,
      title: "Community Outreach Specialist",
      location: "Sylhet, Bangladesh",
      type: "Remote",
      description:
        "Engage local communities and organize awareness campaigns for blood donation.",
    },
  ];

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    toast.success("Application submitted successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-red-600">Join Our Team</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Be part of a mission that saves lives! Explore our current openings
          and start your journey with BloodBridge today.
        </p>
      </div>

      {/* Job Listings */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
  key={job.id}
  className="card shadow-lg bg-white hover:shadow-xl transition rounded-lg p-4 flex flex-col justify-between h-full"
>
  <div>
    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
    <p className="text-gray-600 mb-3">{job.description}</p>
    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
      <FaMapMarkerAlt /> {job.location}
    </div>
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <FaClock /> {job.type}
    </div>
  </div>
  <div className="mt-4">
    <button
      onClick={() => handleApplyClick(job)}
      className="btn btn-accent w-full text-black"
    >
      Apply Now
    </button>
  </div>
</div>
        ))}
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Apply for: {selectedJob?.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="input input-bordered w-full"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className="input input-bordered w-full"
              />
              <textarea
                placeholder="Why should we hire you?"
                className="textarea textarea-bordered w-full"
                rows={4}
                required
              ></textarea>
              <button
                type="submit"
                className="btn btn-accent w-full text-black"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-secondary w-full"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default Job;