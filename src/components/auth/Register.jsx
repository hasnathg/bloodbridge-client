import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {useAuth} from '../../provider/AuthContext'

const Register = () => {
  const { registerUser, setUser, createJWT } = useAuth();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

   const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // Load JSON data
  useEffect(() => {
    fetch("../../data/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data));

    fetch("./../../data/upazilas.json")
      .then((res) => res.json())
      .then((data) => setUpazilas(data));
  }, []);

  const filteredUpazilas = upazilas.filter(
    (u) => u.district_id === selectedDistrict
  );

  const onSubmit = async (data) => {
    setErrMsg("");
    setLoading(true);
    try {
      // 1. Upload avatar to ImgBB
      const formData = new FormData();
      formData.append("image", data.avatar[0]);

      const imgbbRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );

      const avatarUrl = imgbbRes.data.data.url;

      // 2. Register in Firebase
      const userCredential = await registerUser(data.email, data.password);
      const firebaseUser = userCredential.user;

      // 3. Create user object for DB
      const newUser = {
        uid: firebaseUser.uid,
        name: data.name,
        email: data.email,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
        avatar: avatarUrl,
        role: "donor", // default
        status: "active",
        createdAt: new Date(),
      };

      // 4. Save to MongoDB via backend
      await axios.post("http://localhost:5000/users", newUser);

      // 5. Generate JWT and store
      const jwtRes = await createJWT(firebaseUser);
      localStorage.setItem("token", jwtRes.token);

      // 6. Update AuthContext & redirect
      setUser(firebaseUser);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrMsg("Registration failed.");
    } finally {
      setLoading(false);
    }
  };
    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.name && <p className="text-red-500">Name is required</p>}

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.email && <p className="text-red-500">Email is required</p>}

        <input
          type="file"
          accept="image/*"
          {...register("avatar", { required: true })}
          className="file-input file-input-bordered w-full"
        />
        {errors.avatar && <p className="text-red-500">Avatar is required</p>}

        <select
          {...register("bloodGroup", { required: true })}
          className="select select-bordered w-full"
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        {errors.bloodGroup && (
          <p className="text-red-500">Blood Group is required</p>
        )}

        <select
          {...register("district", { required: true })}
          className="select select-bordered w-full"
          onChange={(e) => {
            setValue("district", e.target.value);
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
        {errors.district && (
          <p className="text-red-500">District is required</p>
        )}

        <select
          {...register("upazila", { required: true })}
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
          <p className="text-red-500">Upazila is required</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.password && <p className="text-red-500">Password required</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === password || "Passwords do not match",
          })}
          className="input input-bordered w-full"
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {errMsg && <p className="text-red-500 text-center">{errMsg}</p>}
      </form>
    </div>
    );
};

export default Register;