import React from 'react';
import logo from '../../assets/logo4.JPG'
import { NavLink } from 'react-router';
import { useAuth } from '../../provider/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logoutUser } = useAuth(); 
    const handleLogout = async () => {
    try {
      await logoutUser();
       toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Try again!");
    }
  };

  const menuItems = (
    <>
      <li><NavLink to="/donation-request">Donation Request</NavLink></li>
      <li><NavLink to="/blog">Blog</NavLink></li>
      {user && <li><NavLink to="/funding">Funding</NavLink></li>}
    </>
  );

    return (
 <div className="navbar bg-base-100 shadow-sm font-bold text-4xl text-center">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-10">
            {menuItems}
          </ul>
        </div>
        <NavLink to="/" className="btn btn-ghost text-xl">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <span className="ml-2 text-red-700">Blood Bridge</span>
        </NavLink>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {menuItems}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
  {!user ? (
    <NavLink to="/login" className="btn">Login</NavLink>
  ) : (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost flex items-center gap-2 cursor-pointer">
        <img
          src={user.photoURL || "https://i.ibb.co/7JfqXxB/user.png"}
          alt={user.displayName || "User"}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="hidden md:inline">{user?.displayName?.split(" ")[0] || "User"}</span>
      </label>
      <ul tabIndex={0} className="dropdown-content mt-3 p-2 shadow menu menu-sm bg-base-100 rounded-box w-40 z-10">
        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  )}
</div>

    </div>
    );
};

export default Navbar;