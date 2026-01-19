import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// --- LAYOUT & COMPONENT IMPORTS ---
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';

// --- PUBLIC PAGES ---
import Home from './pages/public/Home';
import PublicRoster from './pages/public/PublicRoster';
import PublicMatches from './pages/public/PublicMatches';
import StreamOverlay from './pages/public/StreamOverlay';

// --- DASHBOARD PAGES ---
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profiles';
import Roster from './pages/dashboard/Roster';
import Comms from './pages/dashboard/Comms';
import Calendar from './pages/dashboard/Calendar';
import Store from './pages/dashboard/Store';
import Financials from './pages/dashboard/Financials';
import POS from './pages/dashboard/POS';
import PlayerApplication from './pages/dashboard/PlayerApplication';
import ApplicationManager from './pages/dashboard/ApplicationManager';

// --- INLINE COMPONENTS ---

// 1. Login Page Component
const LoginPage = () => {
  const { loginWithGoogle, currentUser } = useAuth();
  
  if (currentUser) return <Navigate to="/dashboard" />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-black text-brand-white space-y-8">
      <div className="text-center">
        <h1 className="font-titles text-6xl text-brand-red tracking-wider">MJHS ESPORTS</h1>
        <p className="font-body text-brand-grey mt-2 text-xl">PORTAL LOGIN</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <button 
          onClick={() => loginWithGoogle()} 
          className="bg-brand-red px-8 py-4 rounded-lg font-bold hover:bg-brand-darkRed transition border-2 border-brand-red text-white"
        >
          LOGIN WITH SCHOOL EMAIL
        </button>
        <button 
          onClick={() => loginWithGoogle()} 
          className="bg-transparent border-2 border-brand-grey px-8 py-4 rounded-lg font-bold hover:bg-brand-grey/20 transition text-brand-grey"
        >
          GUEST / PARENT
        </button>
      </div>
    </div>
  );
};

// 2. Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// --- MAIN APP COMPONENT ---

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          border: '1px solid #B00C1A',
        },
      }}/>
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Public Views (No Login Required) */}
          <Route path="/public-roster" element={<PublicRoster />} />
          <Route path="/matches" element={<PublicMatches />} />
          
          {/* The Shop (Public view wrapping the Store component) */}
          <Route path="/shop" element={
            <div className="min-h-screen bg-brand-black text-white">
              <Navbar />
              <div className="max-w-7xl mx-auto p-6 pt-10">
                 <Store />
              </div>
            </div>
          } />

          {/* OBS Stream Overlay (No Layout, Transparent Background) */}
          <Route path="/overlay" element={<StreamOverlay />} />
          
          {/* --- PROTECTED DASHBOARD ROUTES --- */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            {/* General */}
            <Route index element={<DashboardHome />} />
            <Route path="stats" element={<Profile />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="comms" element={<Comms />} />
            
            {/* Team Management */}
            <Route path="roster" element={<Roster />} />
            <Route path="application" element={<PlayerApplication />} /> {/* Student View */}
            
            {/* Admin / Coach Tools */}
            <Route path="inbox" element={<ApplicationManager />} />      {/* Coach View */}
            <Route path="financials" element={<Financials />} />
            <Route path="pos" element={<POS />} />

            {/* Internal Store View */}
            <Route path="store" element={<Store />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;