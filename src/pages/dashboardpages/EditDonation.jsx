import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../provider/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import axiosSecure from '../../utilities/axiosSecure';

const EditDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch donation request by ID
  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await axiosSecure.get(`/donations/${id}`);

        if (res.data.requesterEmail !== user?.email) {
          toast.error("You are not authorized to edit this request.");
          return navigate("/dashboard/my-donation-requests");
        }

        const donationData = res.data;
         const { _id, ...prefillData } = donationData;
        Object.entries(prefillData).forEach(([key, value]) => {
          setValue(key, value);
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load donation request.");
        navigate("/dashboard/my-donation-requests");
      }
    };

    fetchDonation();
  }, [id, user, setValue, navigate]);

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);
    try {
        const { _id, ...updateData } = data;
        
      const res = await axiosSecure.put(`/donations/${id}`, data);

      if (res.status === 200) {
        toast.success("Donation request updated successfully!");
        navigate("/dashboard/my-donation-requests");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    }
  };

  if (loading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Donation Request</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("recipientName", { required: true })}
          placeholder="Recipient Name"
          className="input input-bordered w-full"
        />

        <input
          {...register("recipientDistrict", { required: true })}
          placeholder="Recipient District"
          className="input input-bordered w-full"
        />

        <input
          {...register("recipientUpazila", { required: true })}
          placeholder="Recipient Upazila"
          className="input input-bordered w-full"
        />

        <input
          {...register("hospitalName", { required: true })}
          placeholder="Hospital Name"
          className="input input-bordered w-full"
        />

        <input
          {...register("fullAddress", { required: true })}
          placeholder="Full Address"
          className="input input-bordered w-full"
        />

        <select
          {...register("bloodGroup", { required: true })}
          className="select select-bordered w-full"
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            {...register("donationDate", { required: true })}
            className="input input-bordered"
          />
          <input
            type="time"
            {...register("donationTime", { required: true })}
            className="input input-bordered"
          />
        </div>

        <textarea
          {...register("requestMessage", { required: true })}
          placeholder="Request Message"
          className="textarea textarea-bordered w-full"
          rows={4}
        ></textarea>

        <button type="submit" className="btn btn-primary w-full">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditDonation;