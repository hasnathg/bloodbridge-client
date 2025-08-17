import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/dashboard/Sidebar';
import { Menu } from 'lucide-react';


const DashboardLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
  <div className="flex min-h-screen bg-gray-100">
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-[60] bg-white p-2 rounded shadow"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu />
      </button>

      {/* Mobile overlay (scrim) */}
      <div
        className={`fixed inset-0 bg-black/30 z-[50] md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 w-64 bg-white z-[70]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:shadow-none shadow-xl
          overflow-y-auto
        `}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-28 md:pl-8 md:pr-10">
        <Outlet />
      </main>
    </div>
    );
};

export default DashboardLayout;