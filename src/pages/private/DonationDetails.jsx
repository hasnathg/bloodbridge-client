import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../provider/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';

const DonationDetails = () => {
   const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const {
    data: donation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["donation", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/donations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      return res.data;
    },
  });

  const updateDonation = useMutation({
    mutationFn: async () => {
      return await axios.patch(
        `${import.meta.env.VITE_API_URL}/donations/${id}/status`,
        {
          status: "inprogress",
          donorName: user.displayName,
          donorEmail: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Donation confirmed!");
      queryClient.invalidateQueries(["donation", id]);
      navigate("/dashboard/my-donation-requests");
    },
    onError: () => {
      toast.error("Failed to confirm donation");
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>Failed to load donation details</p>;

  const isOwner = user.email === donation.requesterEmail;
  const isDonor = role === "donor" && !isOwner && donation.status === "pending";

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Donation Request Details</h2>

      <div className="space-y-2">
        <p><strong>Recipient:</strong> {donation.recipientName}</p>
        <p><strong>District:</strong> {donation.recipientDistrict}</p>
        <p><strong>Upazila:</strong> {donation.recipientUpazila}</p>
        <p><strong>Hospital:</strong> {donation.hospitalName}</p>
        <p><strong>Full Address:</strong> {donation.fullAddress}</p>
        <p><strong>Blood Group:</strong> {donation.bloodGroup}</p>
        <p><strong>Donation Date:</strong> {donation.donationDate}</p>
        <p><strong>Donation Time:</strong> {donation.donationTime}</p>
        <p><strong>Status:</strong> 
          <span className="ml-2 badge badge-info">{donation.status}</span>
        </p>
        <p><strong>Requester:</strong> {donation.requesterName} ({donation.requesterEmail})</p>
        <p><strong>Reason:</strong> {donation.requestMessage}</p>

        {donation.donorEmail && (
          <p>
            <strong>Donor Info:</strong> {donation.donorName} ({donation.donorEmail})
          </p>
        )}
      </div>

      {isDonor && (
        <div className="mt-6">
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Donate
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] md:w-[400px]">
            <h3 className="text-lg font-semibold mb-2">Confirm Donation</h3>
            <p className="mb-4">Are you sure you want to donate for this request?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateDonation.mutate();
                  setShowModal(false);
                }}
                className="btn btn-sm btn-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;