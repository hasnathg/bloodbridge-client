import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../provider/AuthContext';
import { auth } from '../../firebase/firebase.init';
import toast from 'react-hot-toast';




const Login = () => {
    const { loginUser, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    setErrMsg("");
    setLoading(true);

    try {
      await loginUser(data.email, data.password);
      await auth.currentUser.reload();
      setUser(auth.currentUser);
      toast.success("Login successful! 🎉");

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setErrMsg("Invalid email or password.");
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.email && <p className="text-red-500">Email is required</p>}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.password && (
          <p className="text-red-500">Password is required</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn bg-red-700 text-white hover:bg-red-800 w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {errMsg && <p className="text-red-500 text-center">{errMsg}</p>}

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <NavLink to="/register" className="text-red-600">
            Register
          </NavLink>
        </p>
      </form>
    </>
  );
};

export default Login;