import React, { useEffect, useState } from 'react';
import { useAuth } from '../../provider/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import axiosSecure from '../../utilities/axiosSecure';

const Profile = () => {

    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetch('/data/districts.json')
      .then((res) => res.json())
      .then(setDistricts);
    fetch('/data/upazilas.json')
      .then((res) => res.json())
      .then(setUpazilas);
  }, []);

   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get(`/users/${user.email}`);
        setProfile(res.data);
        reset(res.data); 
        setSelectedDistrict(res.data.district);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
      }
    };
    if (user?.email) fetchProfile();
  }, [user?.email, reset]);

  const filteredUpazilas = upazilas.filter(u => u.district_id === selectedDistrict);

  const onSubmit = async (data) => {
    try {
      let avatarUrl = profile.avatar;

      if (data.avatar && data.avatar.length > 0) {
        const formData = new FormData();
        formData.append('image', data.avatar[0]);

        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          formData
        );

        avatarUrl = imgbbRes.data.data.url;
      }

      const updatedProfile = {
        name: data.name,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
        avatar: avatarUrl,
      };

      await axiosSecure.patch(`/users/${user.email}`, updatedProfile);


      toast.success("Profile updated!");
      setEditMode(false);
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!profile) return <LoadingSpinner />;


    return (
        <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded space-y-4 mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Profile</h2>
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="btn btn-sm btn-accent text-black font-bold">
            Edit
          </button>
        ) : (
          <button onClick={handleSubmit(onSubmit)} className="btn btn-sm btn-success font-bold text-black">
            Save
          </button>
        )}
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label>Name</label>
          <input
            type="text"
            className="input input-bordered"
            {...register('name', { required: true })}
            disabled={!editMode}
          />
          {errors.name && <span className="text-red-500">Name required</span>}
        </div>

        <div className="form-control">
          <label>Email</label>
          <input
            type="email"
            className="input input-bordered"
            value={profile.email}
            disabled
          />
        </div>

        <div className="form-control">
          <label>Blood Group</label>
          <select
            className="select select-bordered"
            {...register('bloodGroup', { required: true })}
            disabled={!editMode}
          >
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.bloodGroup && <span className="text-red-500">Required</span>}
        </div>

        <div className="form-control">
          <label>District</label>
          <select
            className="select select-bordered"
            {...register('district', { required: true })}
            disabled={!editMode}
            onChange={(e) => {
              setValue("district", e.target.value);
              setSelectedDistrict(e.target.value);
            }}
          >
            <option value="">Select</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label>Upazila</label>
          <select
            className="select select-bordered"
            {...register('upazila', { required: true })}
            disabled={!editMode}
          >
            <option value="">Select</option>
            {filteredUpazilas.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control col-span-1 md:col-span-2">
          <label>Avatar</label>
          {!editMode ? (
            <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full" />
          ) : (
            <input
              type="file"
              accept="image/*"
              {...register("avatar")}
              className="file-input file-input-bordered"
            />
          )}
        </div>
      </form>
    </div>
    );
};

export default Profile;