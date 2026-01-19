import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// --- PAGE IMPORTS ---
import Home from './pages/public/Home';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profiles';
import Roster from './pages/dashboard/Roster';
import Comms from './pages/dashboard/Comms';
import Calendar from './pages/dashboard/Calendar';

// --- INLINE COMPONENTS ---

// 1. Login Page Component
const LoginPage = () => {
  const { loginWithGoogle, currentUser } = useAuth();
  
  // If already logged in, send to dashboard
  if (currentUser) return <Navigate to="/dashboard" />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-black text-brand-white space-y-8">
      <div className="text-center">
        <h1 className="font-titles text-6xl text-brand-red tracking-wider">MJHS ESPORTS</h1>
        <p className="font-body text-brand-grey mt-2 text-xl">PORTAL LOGIN</p>
      </div>
      <div className="flex gap-6">
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
// This ensures only logged-in users can see the dashboard
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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            {/* These render INSIDE the DashboardLayout */}
            <Route index element={<DashboardHome />} />
            <Route path="stats" element={<Profile />} />
			<Route path="roster" element={<Roster />} />
			<Route path="comms" element={<Comms />} />
			<Route path="calendar" element={<Calendar />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;