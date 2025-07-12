import React from 'react';
import { useAuth } from '../../provider/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import { Link } from 'react-router';


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

  const { user } = useAuth();

  const {
    data: requests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myRecentDonationRequests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/donations?email=${user.email}&limit=3`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  if (error)
    return <p className="text-red-500">Failed to load donation requests.</p>;
     

    return (
       <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, {user?.displayName || "Donor"}! 👋</h2>

      {requests.length > 0 && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-xl font-semibold mb-4">Your Recent Requests</h3>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood Group</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, idx) => (
                  <tr key={req._id}>
                    <td>{idx + 1}</td>
                    <td>{req.recipientName}</td>
                    <td>{req.recipientDistrict}, {req.recipientUpazila}</td>
                    <td>{req.donationDate}</td>
                    <td>{req.donationTime}</td>
                    <td>{req.bloodGroup}</td>
                    <td>
                      <span className={`badge ${getStatusColor(req.donationStatus)}`}>
                        {req.donationStatus}
                      </span>
                    </td>
                    <td>
                      <Link to={`/dashboard/edit-donation/${req._id}`} className="btn btn-sm btn-outline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right mt-4">
            <Link to="/dashboard/my-donation-requests" className="btn btn-sm btn-primary">
              View All My Requests
            </Link>
          </div>
        </div>
      )}
    </div>
    );
};

export default DashboardHome;