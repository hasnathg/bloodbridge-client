import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/dashboard/Sidebar';
import { Menu } from 'lucide-react';


const DashboardLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
       <div className="flex min-h-screen">
      {/* Mobile toggle button */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static bg-white w-64 h-full z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } border-r shadow`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 bg-gray-100 ml-0 md:ml-64">
        <Outlet />
      </main>
    </div>
    );
};

export default DashboardLayout;