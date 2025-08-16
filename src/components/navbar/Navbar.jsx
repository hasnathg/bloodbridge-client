import React from 'react';
import logo from '../../assets/logo4.JPG'
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../provider/AuthContext';
import toast from 'react-hot-toast';



const Navbar = () => {
    const { user, logoutUser } = useAuth() || {}; 
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
      await logoutUser();
       toast.success("Logged out successfully!");
       navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Try again!");
    }
  };

   const navActive = ({ isActive }) => (isActive ? "active" : "");

   // 3 public routes (shown to everyone)
  const publicMenu = (
    <>
      <li>
        <NavLink to="/donation-request" className={navActive}>
          Donation Request
        </NavLink>
      </li>
      <li>
        <NavLink to="/blog" className={navActive}>
          Blog
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={navActive}>
          About
        </NavLink>
      </li>
    </>
  );

    return (
   <header className="fixed inset-x-0 top-0 z-50 bg-base-100/95 backdrop-blur-sm border-b border-base-200/60">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="navbar h-16 font-bold text-4xl text-center ">
          {/* Left: Logo + mobile menu */}
          <div className="navbar-start">
            <div className="dropdown">
              <button tabIndex={0} className="btn btn-ghost lg:hidden" aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-64 z-50"
              >
                {publicMenu}
              </ul>
            </div>

            <NavLink to="/" className="btn btn-ghost text-xl">
              <img src={logo} alt="logo" className="w-8 h-8" />
              <span className="ml-2 text-red-700">Blood Bridge</span>
            </NavLink>
          </div>

          {/* Center: public items (desktop) */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              {publicMenu}
            </ul>
          </div>

          {/* Right: auth / avatar */}
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
                  <span className="hidden md:inline">
                    {user?.displayName?.split(" ")[0] || "User"}
                  </span>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content mt-3 p-2 shadow menu menu-sm bg-base-100 rounded-box w-56 z-50"
                >
                  <li><NavLink to="/dashboard" className={navActive}>Dashboard</NavLink></li>
                  <li><NavLink to="/funding" className={navActive}>Funding</NavLink></li>
                  <li className="border-t my-1"></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    );
};

export default Navbar;