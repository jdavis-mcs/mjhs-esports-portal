import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      
      {/* SIDEBAR (Pass state and toggle function) */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* MOBILE HEADER (Only shows on small screens) */}
        <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-brand-grey/20 bg-brand-black">
          <h1 className="font-titles text-xl text-brand-white">MJHS ESPORTS</h1>
          <button onClick={toggleSidebar} className="text-brand-white p-2">
            <Menu size={24} />
          </button>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;