import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
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
    case "cancelled":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

const DonationRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;

  
  const fetchDonationRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/donations/public`,
        { params: { page, limit } }
      );
      setRequests(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching donation requests:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchDonationRequests();
  }, [fetchDonationRequests]);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Pending Blood Donation Requests
      </h2>

      {loading ? (
        <LoadingSpinner />
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No pending donation requests found.</p>
      ) : (
        <>
          {/*  Table for large screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Blood Group</th>
                  <th>Date</th>
                  <th>Status</th>
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
                    <td className="text-right">
                      <Link
                        to={`/donation-request/${req._id}`}
                        className="btn btn-sm  bg-red-700 text-white hover:bg-red-800"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*  Card layout for mobile screens */}
          <div className="md:hidden space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-gray-50 p-4 rounded shadow border flex flex-col gap-2"
              >
                <p>
                  <strong>Recipient:</strong> {req.recipientName}
                </p>
                <p>
                  <strong>Location:</strong> {req.recipientDistrict},{" "}
                  {req.recipientUpazila}
                </p>
                <p>
                  <strong>Blood Group:</strong> {req.bloodGroup}
                </p>
                <p>
                  <strong>Date:</strong> {req.donationDate} at {req.donationTime}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`badge ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </p>
                <Link
                  to={`/donation-request/${req._id}`}
                  className="btn bg-red-700 text-white hover:bg-red-800 btn-sm mt-2"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {/*  Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`btn btn-sm ${
                    page === idx + 1 ? "btn bg-red-700 text-white hover:bg-red-800" : "btn-outline"
                  }`}
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
export default DonationRequestsPage;