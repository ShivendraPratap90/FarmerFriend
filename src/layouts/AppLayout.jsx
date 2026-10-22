import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';
import { ToastNotification } from '../components/common/ToastNotification';
import { useApp } from '../context/AppContext';

export const AppLayout = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-gray-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Main content */}
      <main className="lg:pl-64 pt-16 min-h-screen">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <ToastNotification />
    </div>
  );
};

export default AppLayout;
