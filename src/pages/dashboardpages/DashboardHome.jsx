import React from 'react';
import { useAuth } from '../../provider/AuthContext';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import { Link } from 'react-router';
import { DollarSign, Droplet, Users } from 'lucide-react';
import axiosSecure from '../../utilities/axiosSecure';


const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "badge-warning";
    case "inprogress":
      return "badge-info";
    case "done":
      return "badge-success";
    case "canceled":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

const DashboardHome = () => {
  const { user, role } = useAuth();

  //  Fetch all users (only for admin/volunteer)
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users", role],
    enabled: role === "admin" || role === "volunteer",
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.data || [];
    },
  });

  //  Fetch all donations (only for admin/volunteer)
  const { data: donations = [], isLoading: donationsLoading } = useQuery({
    queryKey: ["donations", role],
    enabled: role === "admin" || role === "volunteer",
    queryFn: async () => {
      const res = await axiosSecure.get("/donations");
      return res.data.data || [];
    },
  });

  //  Fetch all funds (only for admin/volunteer)
  const { data: funds = [], isLoading: fundsLoading } = useQuery({
    queryKey: ["funds", role],
    enabled: role === "admin" || role === "volunteer",
    queryFn: async () => {
      const res = await axiosSecure.get("/funds");
      return res.data.data || [];
    },
  });

  //  Fetch donor's own recent donations
  const { data: myDonations = [], isLoading: myDonationsLoading } = useQuery({
    queryKey: ["myDonations", user?.email],
    enabled: role === "donor" && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations?email=${user.email}&limit=3`);
      return res.data.data || [];
    },
  });

  if (usersLoading || donationsLoading || fundsLoading || myDonationsLoading) {
    return <p className="text-center text-gray-500">Loading dashboard...</p>;
  }

  //  Calculate Stats
  const totalUsers = users.length;
  const totalDonations = donations.length;
  const totalFunds = funds.reduce((sum, fund) => sum + (fund.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <h2 className="text-2xl font-bold">
        Welcome, {user?.displayName || "User"}! 👋
      </h2>

      {/* Admin & Volunteer Stats */}
      {(role === "admin" || role === "volunteer") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
            <Users size={32} className="text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>

          {/* Total Donations */}
          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
            <Droplet size={32} className="text-red-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Donations</h3>
              <p className="text-2xl font-bold">{totalDonations}</p>
            </div>
          </div>

          {/* Total Funds */}
          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
            <DollarSign size={32} className="text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Funds</h3>
              <p className="text-2xl font-bold">${totalFunds.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Donor Dashboard: Recent Donation Requests */}
      {role === "donor" && myDonations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Your Recent Donation Requests</h3>
          <table className="table w-full border rounded-lg">
            <thead>
              <tr>
                <th>Recipient Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Blood Group</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myDonations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.recipientName}</td>
                  <td>{donation.recipientDistrict}, {donation.recipientUpazila}</td>
                  <td>{donation.donationDate}</td>
                  <td>{donation.bloodGroup}</td>
                  <td>{donation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn mt-4"
            onClick={() => (window.location.href = "/dashboard/my-donation-requests")}
          >
            View All Requests
          </button>
        </div>
      )}
    </div>
  );
};
export default DashboardHome;