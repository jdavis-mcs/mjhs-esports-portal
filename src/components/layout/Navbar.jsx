import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png'; // Make sure your image is here!

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-brand-black/90 backdrop-blur-md border-b border-brand-red/30 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="MJHS Logo" className="h-12 w-auto group-hover:scale-105 transition duration-300" />
            <div className="flex flex-col">
              <span className="font-titles text-brand-white text-xl tracking-wider leading-none">MJHS ESPORTS</span>
              <span className="font-body text-brand-red text-xs tracking-widest font-bold">PORTAL</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/roster">MEET THE PLAYERS</NavLink>
            <NavLink to="/matches">MATCHES</NavLink>
            <NavLink to="/store">MERCH</NavLink>
            
            {/* Login / Dashboard Button */}
            {currentUser ? (
              <Link to="/dashboard" className="bg-brand-red text-white px-5 py-2 rounded font-titles tracking-wide hover:bg-brand-darkRed transition">
                DASHBOARD
              </Link>
            ) : (
              <Link to="/login" className="border border-brand-red text-brand-red px-5 py-2 rounded font-titles tracking-wide hover:bg-brand-red hover:text-white transition">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper for consistent link styling
const NavLink = ({ to, children }) => (
  <Link to={to} className="font-titles text-gray-300 hover:text-brand-yellow transition tracking-wide text-sm">
    {children}
  </Link>
);

export default Navbar;