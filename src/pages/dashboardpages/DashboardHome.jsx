import React, { useMemo } from "react";
import { useAuth } from "../../provider/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { DollarSign, Droplet, Users, Home } from "lucide-react";
import axiosSecure from "../../utilities/axiosSecure";

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
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Status color palette (max 4 colors across app)
const STATUS_COLORS = {
  pending:   "#f59e0b", // amber
  inprogress:"#3b82f6", // blue
  done:      "#22c55e", // green
  cancelled: "#ef4444", // red
};
const STATUS_ORDER = ["pending", "inprogress", "done", "cancelled"];

// Helper: format month/year label
const monthLabel = (y, m) => {
  try {
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleString("en-US", { month: "short", year: "numeric" });
  } catch {
    return `${m}/${y}`;
  }
};

const DashboardHome = () => {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const isVolunteer = role === "volunteer";
  const isDonor = role === "donor";

  // ========== Admin/Volunteer: top stats ==========
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    enabled: isAdmin || isVolunteer,
    queryFn: async () => {
      const res = await axiosSecure.get("/stats");
      return res.data; // { totalUsers, totalDonations, totalFunds }
    },
  });

  // ========== Admin: pie of donation status ==========
  const { data: donationStatsRaw = [], isLoading: donationsLoading } = useQuery({
    queryKey: ["donations-stats"],
    enabled: isAdmin,
    queryFn: async () => {
      const res = await axiosSecure.get("/donations/stats");
      return res.data; // [{ name: 'pending'|'inprogress'|'done'|'cancelled', value: number }]
    },
  });

  // Normalize & order statuses for the pie
  const donationStatsData = useMemo(() => {
    if (!isAdmin) return [];
    const byName = Object.fromEntries(donationStatsRaw.map(d => [d.name, d.value]));
    return STATUS_ORDER.map(name => ({
      name,
      value: byName[name] || 0,
      fill: STATUS_COLORS[name],
    }));
  }, [donationStatsRaw, isAdmin]);

  // ========== Admin/Volunteer: funds line chart ==========
  const { data: fundStatsData = [], isLoading: fundStatsLoading } = useQuery({
    queryKey: ["fundStats"],
    enabled: isAdmin || isVolunteer,
    queryFn: async () => {
      const res = await axiosSecure.get("/funds/stats"); // [{ _id: {year, month}, totalAmount }]
      return (res.data || []).map((item) => ({
        name: monthLabel(item._id?.year, item._id?.month),
        total: item.totalAmount || 0,
      }));
    },
  });

  // ========== Donor: my donations (up to 50), pie + recent list ==========
  const { data: myDonationsData, isLoading: myDonationsLoading } = useQuery({
    queryKey: ["myDonations-50", user?.email],
    enabled: isDonor && !!user?.email,
    queryFn: async () => {
      // Server auto-filters to current donor; we just fetch up to 50
      const res = await axiosSecure.get(`/donations`, { params: { limit: 50, page: 1 } });
      return res.data; // { data, total, page }
    },
  });

  const donorPieData = useMemo(() => {
    if (!isDonor) return [];
    const list = myDonationsData?.data || [];
    const counts = { pending: 0, inprogress: 0, done: 0, cancelled: 0 };
    list.forEach((d) => (counts[d.status] = (counts[d.status] || 0) + 1));
    return STATUS_ORDER.map((name) => ({
      name,
      value: counts[name] || 0,
      fill: STATUS_COLORS[name],
    }));
  }, [isDonor, myDonationsData]);

  const donorRecent = useMemo(() => {
    const list = myDonationsData?.data || [];
    return list.slice(0, 3);
  }, [myDonationsData]);

  const loading =
    statsLoading || donationsLoading || fundStatsLoading || myDonationsLoading;

  // Totals for cards
  const totalUsers = stats?.totalUsers || 0;
  const totalDonations = stats?.totalDonations || 0;
  const totalFunds = stats?.totalFunds || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Welcome, <span className="text-red-700">{user?.displayName || "User"}</span>! 👋
        </h2>
        <NavLink to="/" className="btn btn-outline flex items-center gap-2">
          <Home size={18} /> Go to Home
        </NavLink>
      </div>

      {loading && (
        <p className="text-center opacity-70">Loading dashboard…</p>
      )}

      {/* Stat cards (Admin/Volunteer) */}
      {(isAdmin || isVolunteer) && !statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
            <div className="rounded-xl p-3 bg-red-50 border border-red-100">
              <Users size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-sm opacity-70">Total Users</h3>
              <p className="text-2xl font-extrabold">{totalUsers.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
            <div className="rounded-xl p-3 bg-red-50 border border-red-100">
              <Droplet size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-sm opacity-70">Donation Requests</h3>
              <p className="text-2xl font-extrabold">{totalDonations.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
            <div className="rounded-xl p-3 bg-red-50 border border-red-100">
              <DollarSign size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-sm opacity-70">Total Funds</h3>
              <p className="text-2xl font-extrabold">${Number(totalFunds || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pie (Admin) or Donor mini pie */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">
            {isAdmin ? "Donation Requests by Status" : "My Requests by Status"}
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip formatter={(val, name) => [val.toLocaleString(), name]} />
                <Legend verticalAlign="bottom" height={24} />
                <Pie
                  data={isAdmin ? donationStatsData : donorPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                >
                  {(isAdmin ? donationStatsData : donorPieData).map((seg, i) => (
                    <Cell key={i} fill={seg.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Funds line (Admin/Volunteer) or Donor bar snapshot */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">
            {(isAdmin || isVolunteer) ? "Monthly Funds Trend" : "My Status Breakdown"}
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {(isAdmin || isVolunteer) ? (
                <LineChart data={fundStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={[
                  { name: "pending",    value: donorPieData.find(d => d.name === "pending")?.value || 0 },
                  { name: "inprogress", value: donorPieData.find(d => d.name === "inprogress")?.value || 0 },
                  { name: "done",       value: donorPieData.find(d => d.name === "done")?.value || 0 },
                  { name: "cancelled",  value: donorPieData.find(d => d.name === "cancelled")?.value || 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Donor recent table */}
      {isDonor && (donorRecent?.length || 0) > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Recent Donation Requests</h3>
            <NavLink
              to="/dashboard/my-donation-requests"
              className="btn btn-outline btn-sm text-red-500 border-white"
            >
              View all
            </NavLink>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Blood</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donorRecent.map((d) => (
                  <tr key={d._id}>
                    <td>{d.recipientName}</td>
                    <td>{d.recipientDistrict}, {d.recipientUpazila}</td>
                    <td>
                      {d.donationDate}
                      <span className="block text-xs opacity-70">{d.donationTime}</span>
                    </td>
                    <td>{d.bloodGroup}</td>
                    <td>
                      <span
                        className="badge"
                        style={{ backgroundColor: `${STATUS_COLORS[d.status]}22`, color: "#111", borderColor: "transparent" }}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {donorRecent.length === 0 && (
              <p className="opacity-70 text-sm mt-2">No recent requests.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
