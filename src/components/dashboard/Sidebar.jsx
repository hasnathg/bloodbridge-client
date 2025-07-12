import React from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../../provider/AuthContext';

const Sidebar = ({closeSidebar}) => {
    const { role } = useAuth();

    const commonLinks = [
    { name: "Dashboard Home", to: "/dashboard" },
    { name: "My Profile", to: "/dashboard/profile" },
  ];

  const adminLinks = [
    { name: "All Users", to: "/dashboard/users" },
    { name: "Manage Donations", to: "/dashboard/donations" },
  ];

  const donorLinks = [
    { name: "My Donations", to: "/dashboard/my-donations" },
    { name: "Request Blood", to: "/dashboard/request" },
  ];

  const linksToShow = [
    ...commonLinks,
    ...(role === "admin" ? adminLinks : []),
    ...(role === "donor" ? donorLinks : []),
  ];


    return (
    <div className="p-4 pt-8">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        {linksToShow.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-gray-200 ${
                  isActive ? "bg-gray-300 font-semibold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
    );
};

export default Sidebar;