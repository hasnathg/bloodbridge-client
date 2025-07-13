import React, { useState } from 'react';
import { useAuth } from '../../../provider/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import LoadingSpinner from '../../../components/spinner/LoadingSpinner';


const statusOptions = ["all", "pending", "inprogress", "done", "cancelled"];

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "badge-warning";
    case "inprogress":
      return "badge-info";
    case "done":
      return "badge-success";
    case "cancelled":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

const MyDonationRequests = () => {
    const { user } = useAuth();
    const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-donation-requests", user?.email, statusFilter],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/donations`,
        {
          params: {
            email: user.email,
            status: statusFilter !== "all" ? statusFilter : undefined,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/donations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      toast.success("Request deleted");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
    return (
        <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">My Donation Requests</h2>

      <div className="flex items-center justify-between mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select select-bordered w-40"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {requests.length === 0 ? (
        <p>No donation requests found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Location</th>
                <th>Blood</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.recipientName}</td>
                  <td className="max-w-[150px] truncate">
                    {req.recipientDistrict}, {req.recipientUpazila}
                  </td>
                  <td>{req.bloodGroup}</td>
                  <td>
                    {req.donationDate} <br />
                    <span className="text-xs">{req.donationTime}</span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    <div className="flex flex-row flex-wrap items-center gap-2 justify-end max-w-[250px]">
                        <Link
                      to={`/dashboard/edit-donation/${req._id}`}
                      className="btn btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/donation-request/${req._id}`}
                      className="btn btn-sm btn-info"
                    >
                      View
                    </Link>
                    </div>

                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    );
};

export default MyDonationRequests;