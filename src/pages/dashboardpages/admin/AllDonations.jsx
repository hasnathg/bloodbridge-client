import React, { useState } from 'react';
import { useAuth } from '../../../provider/AuthContext';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/spinner/LoadingSpinner';
import { Link } from 'react-router';
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

const AllDonations = () => {
  const { user, role } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 6;

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-donations", statusFilter, page],
    queryFn: async () => {
      const res = await axiosSecure.get("/donations", { params: { status: statusFilter !== "all" ? statusFilter : undefined, limit, page } });
      return res.data;
    },
    keepPreviousData: true,
  });

  const handleStatusUpdate = async (id, newStatus, existingDonor) => {
    try {
      await axiosSecure.patch(`/donations/${id}/status`, {
      status: newStatus,
      donorName: existingDonor?.donorName || null,
        donorEmail: existingDonor?.donorEmail || null,
    });
      toast.success(`Marked as ${newStatus}`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this donation?");
    if (!confirm) return;

    try {
      await axiosSecure.delete(`/donations/${id}`);
      toast.success("Deleted successfully");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const { data: requests = [], total, page: currentPage } = data || {};

  const totalPages = Math.ceil(total / limit);
    return (
       <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">All Donation Requests</h2>

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
        <>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Blood</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Donor</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.recipientName}</td>
                    <td>
                      {req.recipientDistrict}, {req.recipientUpazila}
                    </td>
                    <td>{req.bloodGroup}</td>
                    <td>
                      {req.donationDate}
                      <br />
                      <span className="text-xs">{req.donationTime}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.donorName && req.donorEmail ? (
                        <>
                          {req.donorName} <br />
                          <span className="text-xs">{req.donorEmail}</span>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="text-right">
                     <div className="flex flex-wrap gap-2 justify-end">
                       {/* View */}
                      <Link to={`/donation-request/${req._id}`} className="btn btn-xs bg-red-700 text-white hover:bg-red-800">
                        View
                      </Link>

                      {/* Edit/Delete for admin only */}
                      {role === 'admin' && (
                        <>
                          <Link to={`/dashboard/edit-donation/${req._id}`} className="btn btn-xs bg-red-700 text-white hover:bg-red-800">
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(req._id)} className="btn btn-xs btn-outline  text-red-500 border-white">
                            Delete
                          </button>
                        </>
                      )}

                      {/* Status update (inprogress → done/cancel) */}
                      {req.status === 'inprogress' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'done', req)}
                            className="btn btn-xs  btn-outline  text-red-500 border-white"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'cancelled',req)}
                            className="btn btn-xs bg-red-700 text-white hover:bg-red-800"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`btn btn-sm ${currentPage === idx + 1 ? 'btn-active btn bg-red-700 text-white hover:bg-red-800' : 'btn-outline'}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
    );
};

export default AllDonations;