import React, { useState } from 'react';
import { useAuth } from '../../../provider/AuthContext';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import LoadingSpinner from '../../../components/spinner/LoadingSpinner';
import axiosSecure from '../../../utilities/axiosSecure';


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
    const [page, setPage] = useState(1);
    const limit = 5;

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-donation-requests", user?.email, statusFilter,page],
    queryFn: async () => {
      const res = await axiosSecure.get("/donations", { params: { email: user.email, status: statusFilter !== "all" ? statusFilter : undefined, limit, page } });
      return res.data;
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this?");
    if (!confirm) return;

    try {
      await axiosSecure.delete(`/donations/${id}`);

      toast.success("Request deleted");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
  try {
    await axiosSecure.patch(`/donations/${id}/status`, {
  status: newStatus,
  donorName: user.displayName,
  donorEmail: user.email,
});
    toast.success(`Marked as ${newStatus}`);
    refetch();
  } catch (error) {
    console.error(error);
    toast.error("Failed to update status");
  }
  
};
const totalPages = Math.ceil((data?.total || 0) / limit);

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
    
    return (
<div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">My Donation Requests</h2>

      <div className="flex items-center justify-between mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {setStatusFilter(e.target.value)
            setPage(1);
          }}
          className="select select-bordered w-40"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {data?.data?.length === 0 ? (
        <p>No donation requests found.</p>
      ) : (
        <>
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
              {data?.data?.map((req) => (
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
                    <div className="flex flex-row flex-wrap items-center gap-2 justify-end max-w-[300px]">
                      <Link
                        to={`/dashboard/edit-donation/${req._id}`}
                        className="btn btn-sm bg-red-700 text-white hover:bg-red-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="btn btn-sm bg-red-700 text-white hover:bg-red-800"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/donation-request/${req._id}`}
                        className="btn btn-sm bg-red-700 text-white hover:bg-red-800"
                      >
                        View
                      </Link>

                      {req.status === 'inprogress' && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(req._id, 'done')
                            }
                            className="btn btn-sm bg-red-700 text-white hover:bg-red-800"
                          >
                            Mark as Done
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(req._id, 'cancelled')
                            }
                            className="btn-sm btn btn-outline  text-red-500 border-white"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="btn btn-outline  text-red-500 border-white btn-sm"
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="btn btn-sm  bg-red-700 text-white hover:bg-red-800 cursor-default">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="btn bg-red-700 text-white hover:bg-red-800 btn-sm"
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
    );
};

export default MyDonationRequests;