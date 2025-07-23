import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../provider/AuthContext';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosSecure from '../../../utilities/axiosSecure';

const CreateDonationRequest = () =>  {
  const { user, role } = useAuth();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Load JSON data
    useEffect(() => {
      fetch("/data/districts.json")
        .then((res) => res.json())
        .then((data) => setDistricts(data));
  
      fetch("/data/upazilas.json")
        .then((res) => res.json())
        .then((data) => setUpazilas(data));
    }, []);
  
    const filteredUpazilas = upazilas.filter(
      (u) => u.district_id === selectedDistrict
    );

  const onSubmit = async (data) => {
    if (!user || role === "blocked") {
      toast.error("Your account is blocked. You can't create a request.");
      return;
    }

   const selectedDistrictName =
    districts.find((d) => String(d.id) === String(data.recipientDistrict))?.name ||
    data.recipientDistrict; 

  const selectedUpazilaName =
    upazilas.find((u) => u.name === data.recipientUpazila)?.name ||
    data.recipientUpazila;

    const donationData = {
      requesterName: user.displayName,
      requesterEmail: user.email,
      recipientName: data.recipientName,
      recipientDistrict: selectedDistrictName, 
      recipientUpazila: selectedUpazilaName,
      hospitalName: data.hospitalName,
      fullAddress: data.fullAddress,
      bloodGroup: data.bloodGroup,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/donations", donationData);
      if (res.status === 201) {
        toast.success("Donation request created successfully!");
        reset();
        navigate("/dashboard/my-donation-requests");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create donation request");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-6">Create Donation Request</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={user?.displayName}
            readOnly
            className="input input-bordered w-full"
          />
          <input
            type="email"
            value={user?.email}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        
        <input
          {...register("recipientName", { required: true })}
          placeholder="Recipient Name"
          className="input input-bordered w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            {...register("recipientDistrict", { required: true })}
            className="select select-bordered w-full"
           onChange={(e) => {
            setValue("recipientDistrict", e.target.value);
            setSelectedDistrict(e.target.value);
          }}
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
          </select>
          {errors.recipientDistrict && (
          <p className="text-red-500">District is required</p>
        )}
          <select
            {...register("recipientUpazila", { required: true })}
            className="select select-bordered w-full"
          >
           <option value="">Select Upazila</option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
          </select>
          {errors.upazila && (
          <p className="text-red-500">recipientUpazila is required</p>
        )}
          
        </div>

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
          placeholder="Why is this blood needed?"
          className="textarea textarea-bordered w-full"
          rows={4}
        ></textarea>

        <button type="submit" className="btn btn-accent text-black w-full">
          Request
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;