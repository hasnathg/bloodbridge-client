import React from 'react';
import { Link, useNavigate, useParams } from 'react-router';
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

const DonationDetails = () => {
  const { id } = useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["donation-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const confirmDonationMutation = useMutation({
    mutationFn: async () => axiosSecure.patch(`/donations/${id}/status`, {
  status: "inprogress",
  donorName: user.displayName,
  donorEmail: user.email,
}),
    onSuccess: () => {
      toast.success("You confirmed your donation!");
      refetch();
    },
    onError: () => {
      toast.error("Could not confirm donation");
    },
  });

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosSecure.patch(`/donations/${id}/status`, {
  status: newStatus,
  donorName: user.displayName,
  donorEmail: user.email,
});
      toast.success(`Marked as ${newStatus}`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };


  if (isLoading) return <LoadingSpinner />;

  if (!data) return <p>Request not found</p>;

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
    <div className="max-w-3xl mx-auto bg-white p-6 pt-16 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Donation Request Details</h2>

      <div className="grid gap-2">
        <p><strong>Recipient:</strong> {recipientName}</p>
        <p><strong>District:</strong> {recipientDistrict}</p>
        <p><strong>Upazila:</strong> {recipientUpazila}</p>
        <p><strong>Hospital:</strong> {hospitalName}</p>
        <p><strong>Full Address:</strong> {fullAddress}</p>
        <p><strong>Blood Group:</strong> {bloodGroup}</p>
        <p><strong>Donation Date:</strong> {donationDate}</p>
        <p><strong>Donation Time:</strong> {donationTime}</p>
        <p><strong>Status:</strong>{""} <span className={`badge ${getStatusColor(status)}`}>{status}</span></p>
        <p><strong>Requester:</strong> {requesterName} ({requesterEmail})</p>
        <p><strong>Reason:</strong> {requestMessage}</p>
        {donorName && donorEmail && (
          <p><strong>Donor:</strong> {donorName} ({donorEmail})</p>
        )}
      </div>

      {isOwner && (
        <div className="flex gap-2 mt-4">
          <Link to={`/dashboard/edit-donation/${id}`} className="btn btn-sm btn-primary">Edit</Link>
        </div>
      )}

      {canDonate && (
        <button
          className="btn btn-sm btn-success mt-4"
           onClick={() => confirmDonationMutation.mutate()}
          disabled={confirmDonationMutation.isLoading}
        >
          {confirmDonationMutation.isLoading ? "Updating..." : "I want to Donate"}
        </button>
      )}
     
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

    </div>
  );
};


export default DonationDetails;