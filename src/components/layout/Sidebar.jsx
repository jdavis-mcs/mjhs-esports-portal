import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Trophy, 
  Calendar, 
  MessageSquare, 
  Users, 
  LogOut, 
  X,
  FileText, // Import Icon for Application
  Inbox,     // Import Icon for Manager
  Banknote,
  ShoppingBag
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, userRole } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['all'] },
    
    // COACH / ADMIN ONLY
    { label: 'Inbox', path: '/dashboard/inbox', icon: <Inbox size={20} />, roles: ['admin', 'coach'] },
    { label: 'Roster & Teams', path: '/dashboard/roster', icon: <Users size={20} />, roles: ['admin', 'coach'] },
	{ label: 'Financials', path: '/dashboard/financials', icon: <Banknote size={20} />, roles: ['admin', 'coach', 'staff'] },
    
    // STUDENTS / GUESTS ONLY
    { label: 'Join Team', path: '/dashboard/application', icon: <FileText size={20} />, roles: ['student', 'guest'] },

    // EVERYONE
    { label: 'Comms', path: '/dashboard/comms', icon: <MessageSquare size={20} />, roles: ['all'] },
    { label: 'Calendar', path: '/dashboard/calendar', icon: <Calendar size={20} />, roles: ['all'] },
    { label: 'My Stats', path: '/dashboard/stats', icon: <Trophy size={20} />, roles: ['all'] },
	{ label: 'Store', path: '/dashboard/store', icon: <ShoppingBag size={20} />, roles: ['all'] }, // Visible to everyone
  ];

  // Filter items based on role
  const filteredNav = navItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(userRole)
  );

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* SIDEBAR CONTAINER */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-brand-black border-r border-brand-grey/20 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        
        {/* LOGO AREA */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-brand-grey/20">
          <h1 className="font-titles text-2xl text-brand-red tracking-wider">
            MJHS<span className="text-white">PORTAL</span>
          </h1>
          <button onClick={toggleSidebar} className="md:hidden text-brand-grey hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => window.innerWidth < 768 && toggleSidebar()} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-red text-white shadow-[0_0_10px_rgba(176,12,26,0.4)]' 
                    : 'text-brand-grey hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-brand-grey group-hover:text-white'}>
                  {item.icon}
                </span>
                <span className="font-titles tracking-wide text-sm">{item.label.toUpperCase()}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-brand-grey/20">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-brand-grey hover:bg-brand-red/10 hover:text-brand-red transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-titles tracking-wide text-sm">LOG OUT</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;