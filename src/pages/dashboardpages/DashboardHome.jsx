import React from 'react';
import { useAuth } from '../../provider/AuthContext';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import { Link, NavLink,  } from 'react-router';
import { DollarSign, Droplet, Users, Home } from 'lucide-react';
import axiosSecure from '../../utilities/axiosSecure';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";


const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];


const DashboardHome = () => {
  const { user, role } = useAuth();
  // const navigate = useNavigate();

  // Fetch Dashboard Stats (Top Cards)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    enabled: role === "admin" || role === "volunteer", // Both can see cards
    queryFn: async () => {
      const res = await axiosSecure.get("/stats");
      return res.data; // { totalUsers, totalDonations, totalFunds }
    },
  });

  //  Fetch Pie Chart data (ADMIN)
  const { data: donationStatsData = [], isLoading: donationsLoading } = useQuery({
    queryKey: ["donations-stats"],
    enabled: role === "admin", 
    queryFn: async () => {
      const res = await axiosSecure.get("/donations/stats");
      return res.data; 
    },
  });

  // Fetch donor's recent donations (For donor dashboard)
  const { data: myDonations = [], isLoading: myDonationsLoading } = useQuery({
    queryKey: ["myDonations", user?.email],
    enabled: role === "donor" && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations?email=${user.email}&limit=3`);
      return res.data.data || [];
    },
  });

  //  Fetch fund stats for line chart (Admin Only)
  const { data: fundStatsData = [], isLoading: fundStatsLoading } = useQuery({
    queryKey: ["fundStats"],
    enabled: role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/funds/stats");
      return res.data.map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        total: item.totalAmount,
      }));
    },
  });

  if (statsLoading || donationsLoading || myDonationsLoading || fundStatsLoading) {
    return <p className="text-center text-red-500 font-bold">Loading dashboard...</p>;
  }

  //  Get totals for cards
  const totalUsers = stats?.totalUsers || 0;
  const totalDonations = stats?.totalDonations || 0;
  const totalFunds = stats?.totalFunds || 0;

  return (
    <div className="space-y-8">
      {/* ✅ Top Section with Back to Home Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Welcome, {user?.displayName || "User"}! 👋</h2>
        <NavLink
          to="/"
          className="btn btn-outline flex items-center gap-2"
        >
          <Home size={18} /> Go to Home
        </NavLink>
      </div>

      {/*  Admin & Volunteer  top cards */}
      {(role === "admin" || role === "volunteer") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow flex items-center gap-4">
            <Users size={32} className="text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
            <Droplet size={32} className="text-red-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Donations</h3>
              <p className="text-2xl font-bold">{totalDonations}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
            <DollarSign size={32} className="text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Total Funds</h3>
              <p className="text-2xl font-bold">${totalFunds.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/*  Charts Section (ADMIN) */}
      {role === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Pie Chart */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Donation Requests by Status
            </h3>
            {donationStatsData.length === 0 ? (
              <p className="text-center text-gray-500">No data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donationStatsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {donationStatsData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Line Chart for Monthly Funds */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Monthly Funds Trend
            </h3>
            {fundStatsData.length === 0 ? (
              <p className="text-center text-gray-500">No data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fundStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/*  Donor Recent Requests */}
      {role === "donor" && myDonations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Your Recent Donation Requests
          </h3>
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
                  <td>
                    {donation.recipientDistrict}, {donation.recipientUpazila}
                  </td>
                  <td>{donation.donationDate}</td>
                  <td>{donation.bloodGroup}</td>
                  <td>{donation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <NavLink to="/dashboard/my-donation-requests" className="btn mt-4">
  View All Requests
</NavLink>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;