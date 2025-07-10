import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';



const Login = () => {

    const {register,handleSubmit, formState: {errors}} = useForm();
    const [errMsg, setErrMsg]= useState();
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setErrMsg("");
        setLoading(true);

        try{
            await loginUser(data.email, data.password);
            navigate("/");
        } catch (err) {
            console.error(err);
            setErrMsg("Invalid email or password.");

        } finally {
            setLoading(false);

        }


    };
    
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-10">
             <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input 
                type="email" 
                placeholder='email'
                {...register("email",{required: true})} 
                className="input input-bordered w-full"
                />
                {errors.email && <p className="text-red-500">Email is required</p>}

                <input 
                type="password"
                placeholder='password'
                {...register("password", {required: true})}
                className="input input-bordered w-full"
                 />
                {errors.password && <p className="text-red-500">Password is required</p>}

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

         {errMsg && <p className="text-red-500 text-center">{errMsg}</p>}

         <p className="text-center mt-2">
          Don’t have an account? <NavLink to="/register" className="text-blue-500">Register</NavLink>
        </p>

            </form>
        </div>
    );
};

export default Login;