import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../provider/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import axiosSecure from "../../utilities/axiosSecure";
import { Pencil, Save, X, Shield, UserCircle2 } from "lucide-react";

const FALLBACK_AVATAR = "https://i.ibb.co/7JfqXxB/user.png";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Load geo data once
  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setDistricts([]));

    fetch("/data/upazilas.json")
      .then((res) => res.json())
      .then((data) => setUpazilas(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setUpazilas([]));
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get(`/users/${user.email}`);
        const p = res.data || {};
        setProfile(p);
        reset(p); // fill form
        // Your DB stores district as an id (likely), keep it in local state
        setSelectedDistrict(p.district || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };
    if (user?.email) fetchProfile();
  }, [user?.email, reset]);

  // Upazila options filtered by selected district (safe type compare)
  const filteredUpazilas = useMemo(() => {
    const sd = String(selectedDistrict || "");
    return upazilas.filter((u) => String(u.district_id) === sd);
  }, [upazilas, selectedDistrict]);

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setSelectedDistrict(val);
    setValue("district", val);
    // reset upazila when district changes (in edit mode)
    setValue("upazila", "");
  };

  // Save profile
  const onSubmit = async (data) => {
    try {
      setSaving(true);

      // Upload avatar if a file was chosen
      let avatarUrl = profile?.avatar;
      if (avatarFile) {
        const fd = new FormData();
        fd.append("image", avatarFile);
        const up = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          fd
        );
        avatarUrl = up.data?.data?.url || avatarUrl;
      }

      const updatedProfile = {
        name: data.name,
        phone: data.phone || "",
        bloodGroup: data.bloodGroup,
        district: data.district, // district id
        upazila: data.upazila,
        address: data.address || "",
        avatar: avatarUrl,
      };

      await axiosSecure.patch(`/users/${user.email}`, updatedProfile);

      toast.success("Profile updated!");
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      setEditMode(false);
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <LoadingSpinner />;

  // Helpers
  const roleChip = (
    <span className="badge badge-outline">{profile.role || "donor"}</span>
  );
  const statusChip = (
    <span
      className={`badge ${profile.status === "active" ? "badge-success" : "badge-error"}`}
    >
      {profile.status || "active"}
    </span>
  );

  const districtName =
    districts.find((d) => String(d.id) === String(profile.district))?.name || "";

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 shadow rounded space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Profile</h2>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="btn btn-sm bg-red-700 text-white hover:bg-red-800"
          >
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              className="btn btn-sm"
              onClick={() => {
                reset(profile);
                setSelectedDistrict(profile.district || "");
                setAvatarFile(null);
                setEditMode(false);
              }}
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="btn btn-sm bg-red-700 text-white hover:bg-red-800"
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Top row: avatar + name/email/role/status */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="relative">
          <img
            src={
              avatarFile
                ? URL.createObjectURL(avatarFile)
                : profile.avatar || user?.photoURL || FALLBACK_AVATAR
            }
            alt={profile.name || "User avatar"}
            className="w-28 h-28 rounded-full object-cover border"
          />
          {editMode && (
            <label className="btn btn-xs absolute -bottom-2 left-1/2 -translate-x-1/2">
              <UserCircle2 className="w-4 h-4 mr-1" /> Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />
            </label>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold">{profile.name || "Unnamed User"}</h3>
          <p className="opacity-80">{profile.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {roleChip}
            <span className="inline-flex items-center gap-1">
              <Shield className="w-4 h-4" />
              {statusChip}
            </span>
            {districtName && (
              <span className="badge badge-outline">{districtName}</span>
            )}
            {profile.upazila && (
              <span className="badge badge-outline">{profile.upazila}</span>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("name", { required: true })}
            disabled={!editMode}
          />
          {errors.name && <span className="text-red-500 text-xs">Required</span>}
        </div>

        {/* Email (locked) */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            value={profile.email}
            disabled
            readOnly
          />
          <p className="text-xs opacity-70 mt-1">Email cannot be changed.</p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            className="input input-bordered w-full"
            placeholder="+8801XXXXXXXXX"
            {...register("phone")}
            disabled={!editMode}
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium mb-1">Blood Group</label>
          <select
            className="select select-bordered w-full"
            {...register("bloodGroup", { required: true })}
            disabled={!editMode}
          >
            <option value="">Select</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.bloodGroup && (
            <span className="text-red-500 text-xs">Required</span>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <select
            className="select select-bordered w-full"
            {...register("district", { required: true })}
            disabled={!editMode}
            onChange={handleDistrictChange}
          >
            <option value="">Select</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <span className="text-red-500 text-xs">Required</span>
          )}
        </div>

        {/* Upazila */}
        <div>
          <label className="block text-sm font-medium mb-1">Upazila</label>
          <select
            className="select select-bordered w-full"
            {...register("upazila", { required: true })}
            disabled={!editMode}
          >
            <option value="">Select</option>
            {filteredUpazilas.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
          {errors.upazila && (
            <span className="text-red-500 text-xs">Required</span>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Full Address</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. Zahir Raihan Rd, Dhaka"
            {...register("address")}
            disabled={!editMode}
          />
        </div>

        {/* Avatar (file input) in form for accessibility, but we show nicer control above */}
        {editMode && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Change Avatar</label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs opacity-70 mt-1">
              JPG/PNG, recommended square image for best result.
            </p>
          </div>
        )}

        {/* Save on small screens (secondary) */}
        {editMode && (
          <div className="md:col-span-2 flex gap-2 justify-end">
            <button type="button" className="btn" onClick={() => {
              reset(profile);
              setSelectedDistrict(profile.district || "");
              setAvatarFile(null);
              setEditMode(false);
            }}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </button>
            <button type="submit" className="btn bg-red-700 text-white hover:bg-red-800" disabled={saving}>
              <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
