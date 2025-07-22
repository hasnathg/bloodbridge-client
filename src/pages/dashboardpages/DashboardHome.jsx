import React from 'react';
import { useAuth } from '../../provider/AuthContext';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import { Link } from 'react-router';
import { DollarSign, Droplet, Users } from 'lucide-react';
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

  // ✅ Fetch Users, Donations, and Funds for Cards
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users", role],
    enabled: role === "admin" || role === "volunteer",
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.data || [];
    },
  });

  const { data: donations = [], isLoading: donationsLoading } = useQuery({
    queryKey: ["donations", role],
    enabled: role === "admin" || role === "volunteer",
    queryFn: async () => {
      const res = await axiosSecure.get("/donations");
      return res.data.data || [];
    },
  });

  const { data: funds = [], isLoading: fundsLoading } = useQuery({
    queryKey: ["funds", role],
    enabled: role === "admin" || role === "volunteer",
    queryFn: async () => {
      const res = await axiosSecure.get("/funds");
      return res.data.data || [];
    },
  });

  //  Fetch Donor's Recent Donations
  const { data: myDonations = [], isLoading: myDonationsLoading } = useQuery({
    queryKey: ["myDonations", user?.email],
    enabled: role === "donor" && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations?email=${user.email}&limit=3`);
      return res.data.data || [];
    },
  });

  //  Compute Donation Stats Locally (Pie Chart)
  const donationStatsData = React.useMemo(() => {
    if (!donations.length) return [];
    const statusCount = donations.reduce((acc, donation) => {
      acc[donation.status] = (acc[donation.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [donations]);

  //  Fetch Fund Stats for Line Chart
  const { data: fundStatsData = [], isLoading: fundStatsLoading } = useQuery({
    queryKey: ["fundStats"],
    enabled: role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/funds/stats");
      return res.data.map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        total: item.totalAmount
      }));
    },
  });

  if (
    usersLoading ||
    donationsLoading ||
    fundsLoading ||
    myDonationsLoading ||
    fundStatsLoading
  ) {
    return <p className="text-center text-gray-500">Loading dashboard...</p>;
  }

  //  Calculate Totals
  const totalUsers = users.length;
  const totalDonations = donations.length;
  const totalFunds = funds.reduce((sum, f) => sum + (f.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <h2 className="text-2xl font-bold">Welcome, {user?.displayName || "User"}! 👋</h2>

      {/*  Admin & Volunteer Stats */}
      {(role === "admin" || role === "volunteer") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
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

      {/*  Charts Section for Admin */}
      {role === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
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
          <button
            className="btn mt-4"
            onClick={() =>
              (window.location.href = "/dashboard/my-donation-requests")
            }
          >
            View All Requests
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;