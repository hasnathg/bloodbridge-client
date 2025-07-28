import React, {useState} from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useAuth } from '../../provider/AuthContext';
import { useMutation, useQuery} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import axiosSecure from '../../utilities/axiosSecure';

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

const DonationDetails = () =>   {
  const { id } = useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  //  Fetch donation details
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["donation-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  //  Mutation for confirming donation
  const confirmDonationMutation = useMutation({
    mutationFn: async () =>
      axiosSecure.patch(`/donations/${id}/status`, {
        status: "inprogress",
        donorName: user.displayName,
        donorEmail: user.email,
      }),
    onSuccess: () => {
      toast.success("Donation confirmed successfully!");
      refetch();
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to confirm donation"),
  });

  //  Mutation for marking status as done/cancelled
  const handleStatusChange = async (newStatus) => {
    try {
      await axiosSecure.patch(`/donations/${id}/status`, {
        status: newStatus,
        donorName: user.displayName,
        donorEmail: user.email,
      });
      toast.success(`Status updated to ${newStatus}`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <p className="text-center text-red-500">Request not found</p>;

  const {
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    fullAddress,
    bloodGroup,
    donationDate,
    donationTime,
    status,
    requesterName,
    requesterEmail,
    requestMessage,
    donorName,
    donorEmail,
  } = data;

  const isOwner = user?.email === requesterEmail;
  const canDonate = role === "donor" && status === "pending";

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 p-16 mt-8 rounded shadow space-y-4">
      <div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Donation Request Details</h2>
        </div>
      
      </div>
      

      {/* Details */}
      <div className="grid gap-2 px-32 pt-8 text-lg">
        <p><strong>Recipient:</strong> {recipientName}</p>
        <p><strong>District:</strong> {recipientDistrict}</p>
        <p><strong>Upazila:</strong> {recipientUpazila}</p>
        <p><strong>Hospital:</strong> {hospitalName}</p>
        <p><strong>Full Address:</strong> {fullAddress}</p>
        <p><strong>Blood Group:</strong> {bloodGroup}</p>
        <p><strong>Donation Date:</strong> {donationDate}</p>
        <p><strong>Donation Time:</strong> {donationTime}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`badge ${getStatusColor(status)}`}>{status}</span>
        </p>
        <p><strong>Requester:</strong> {requesterName} ({requesterEmail})</p>
        <p><strong>Reason:</strong> {requestMessage}</p>
        {donorName && donorEmail && (
          <p><strong>Donor:</strong> {donorName} ({donorEmail})</p>
        )}
      </div>
      <div>
          <Link
                        to="/donation-request"
                        className="inline-block text-red-800 hover:underline text-sm pl-100 mb-4 font-bold"
                      >
                        ← Previous Page
                      </Link>
      </div>

      {/* Owner actions */}
      {isOwner && (
        <div className="flex gap-2 mt-4">
          <Link to={`/dashboard/edit-donation/${id}`} className="btn btn-sm btn-primary">
            Edit
          </Link>
        </div>
      )}

      {/* Donate Button */}
      {canDonate && (
        <button
          className="btn btn-success mt-4"
          onClick={() => {
            if (!user) {
              navigate("/login");
              return;
            }
            setIsModalOpen(true);
          }}
        >
          I Want to Donate
        </button>
      )}

      {/* Status Change for Owner */}
      {isOwner && status === "inprogress" && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleStatusChange("done")}
            className="btn btn-sm btn-success"
          >
            Mark as Done
          </button>
          <button
            onClick={() => handleStatusChange("cancelled")}
            className="btn btn-sm btn-warning"
          >
            Cancel
          </button>
        </div>
      )}

      {/*  Donation Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Donation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold">Donor Name</label>
                <input
                  type="text"
                  value={user.displayName}
                  readOnly
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Donor Email</label>
                <input
                  type="text"
                  value={user.email}
                  readOnly
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => confirmDonationMutation.mutate()}
                disabled={confirmDonationMutation.isLoading}
              >
                {confirmDonationMutation.isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default DonationDetails;