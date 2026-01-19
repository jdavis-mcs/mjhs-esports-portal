import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.png'; // Make sure this path is correct

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Highlight active link helper
  const isActive = (path) => location.pathname === path ? "text-brand-red" : "text-white hover:text-brand-red";

  return (
    // 'sticky top-0' ensures it stays visible but pushes content down so nothing is hidden
    <nav className="sticky top-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-brand-grey/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="MJHS Logo" className="h-12 w-12 object-contain group-hover:scale-110 transition duration-300" />
            <div className="flex flex-col">
              <span className="font-titles text-xl tracking-wider text-white">MJHS</span>
              <span className="font-titles text-sm tracking-widest text-brand-red -mt-1 group-hover:text-brand-yellow transition">ESPORTS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-titles text-sm tracking-wide transition ${isActive('/')}`}>
              HOME
            </Link>
            <Link to="/matches" className={`font-titles text-sm tracking-wide transition ${isActive('/matches')}`}>
              MATCHES
            </Link>
            <Link to="/public-roster" className={`font-titles text-sm tracking-wide transition ${isActive('/public-roster')}`}>
              ROSTER
            </Link>
            <Link to="/shop" className={`font-titles text-sm tracking-wide transition ${isActive('/shop')}`}>
              STORE
            </Link>

            {/* Auth Button Logic */}
            {currentUser ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-brand-grey/30">
                <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-brand-yellow transition">
                  <User size={18} />
                  <span className="font-titles text-sm">DASHBOARD</span>
                </Link>
                <button onClick={logout} className="text-brand-grey hover:text-brand-red transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="ml-4 bg-brand-red text-white px-6 py-2 rounded skew-x-[-10deg] hover:bg-brand-darkRed transition shadow-[0_0_10px_rgba(176,12,26,0.3)]">
                <span className="skew-x-[10deg] font-titles text-sm">LOGIN</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-brand-red transition">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-brand-grey/20">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 font-titles text-white hover:bg-brand-grey/10 rounded">HOME</Link>
            <Link to="/matches" onClick={() => setIsOpen(false)} className="block px-3 py-3 font-titles text-white hover:bg-brand-grey/10 rounded">MATCHES</Link>
            <Link to="/public-roster" onClick={() => setIsOpen(false)} className="block px-3 py-3 font-titles text-white hover:bg-brand-grey/10 rounded">ROSTER</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block px-3 py-3 font-titles text-white hover:bg-brand-grey/10 rounded">STORE</Link>
            
            {currentUser ? (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-3 font-titles text-brand-yellow hover:bg-brand-grey/10 rounded border border-brand-grey/20 mt-4 text-center">
                GO TO DASHBOARD
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-3 font-titles text-brand-red hover:bg-brand-grey/10 rounded border border-brand-red/30 mt-4 text-center">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;