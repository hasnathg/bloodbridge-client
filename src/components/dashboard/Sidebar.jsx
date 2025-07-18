import React from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../../provider/AuthContext';
import {
  Home,
  User,
  Users,
  FileText,
  ClipboardList,
  PlusCircle,
  LayoutDashboard,
  NotebookPen,
  DollarSign,
} from "lucide-react";

const Sidebar = ({closeSidebar}) => {
    const { role } = useAuth();

    const commonLinks = [
    {
      name: "Dashboard Home",
      to: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "My Profile",
      to: "/dashboard/profile",
      icon: <User size={18} />,
    },
    {
      name: 'Funding',
      to: '/funding',
      icon: <DollarSign size={18} />,
    },
  ];

  const adminLinks = [
    {
      name: "All Users",
      to: "/dashboard/all-users",
      icon: <Users size={18} />,
    },
    {
      name: "All Donation Requests",
      to: "/dashboard/all-blood-donation-request",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "Content Management",
      to: "/dashboard/content-management",
      icon: <FileText size={18} />,
    },
  ];

  const donorLinks = [
    {
      name: "My Donation Requests",
      to: "/dashboard/my-donation-requests",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "Create Donation Request",
      to: "/dashboard/create-donation-request",
      icon: <PlusCircle size={18} />,
    },
  ];

  const volunteerLinks = [
    {
      name: "All Donation Requests",
      to: "/dashboard/all-blood-donation-request",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "Content Management",
      to: "/dashboard/content-management",
      icon: <NotebookPen size={18} />,
    },
  ];

  let roleLinks = [];
  let sectionTitle = "";

  if (role === "admin") {
    roleLinks = adminLinks;
    sectionTitle = "Admin Panel";
  } else if (role === "donor") {
    roleLinks = donorLinks;
    sectionTitle = "Donor Panel";
  } else if (role === "volunteer") {
    roleLinks = volunteerLinks;
    sectionTitle = "Volunteer Panel";
  }



    return (
   
    <div className="p-4 pt-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Home size={20} /> Dashboard
      </h2>

      {/* Common Links */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2 font-semibold">General</p>
        <ul className="space-y-1">
          {commonLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 ${
                    isActive ? 'bg-gray-300 font-semibold' : ''
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Role-Specific Links */}
      {roleLinks.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2 font-semibold">
            {sectionTitle}
          </p>
          <ul className="space-y-1">
            {roleLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 ${
                      isActive ? 'bg-gray-300 font-semibold' : ''
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    );
};

export default Sidebar;