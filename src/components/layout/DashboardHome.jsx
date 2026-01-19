import { useAuth } from '../../contexts/AuthContext';
import { Clock, ShieldAlert, CreditCard, Bell } from 'lucide-react';

const DashboardHome = () => {
  const { userRole } = useAuth();

  return (
    <div className="space-y-8">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Notifications */}
        <div className="bg-brand-black border border-brand-grey/20 p-6 rounded-xl hover:border-brand-red/50 transition duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-titles text-xl text-brand-white">COMMS</h3>
            <Bell className="text-brand-yellow" />
          </div>
          <p className="font-stats text-4xl text-white">3</p>
          <p className="text-sm text-brand-grey mt-1">Unread messages</p>
        </div>

        {/* Card 2: Financials / Dues */}
        <div className="bg-brand-black border border-brand-grey/20 p-6 rounded-xl hover:border-brand-red/50 transition duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-titles text-xl text-brand-white">BALANCE</h3>
            <CreditCard className="text-brand-red" />
          </div>
          <p className="font-stats text-4xl text-white">$0.00</p>
          <p className="text-sm text-brand-grey mt-1">Current amount due</p>
        </div>

        {/* Card 3: Next Event */}
        <div className="bg-brand-black border border-brand-grey/20 p-6 rounded-xl hover:border-brand-red/50 transition duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-titles text-xl text-brand-white">NEXT MATCH</h3>
            <Clock className="text-brand-purple" />
          </div>
          <p className="font-titles text-lg text-white">VS FLOYD CENTRAL</p>
          <p className="text-sm text-brand-grey mt-1">Tomorrow @ 4:00 PM</p>
        </div>
      </div>

      {/* Role Specific Section */}
      <div className="mt-10">
        <h2 className="font-titles text-2xl mb-6 text-brand-red border-l-4 border-brand-yellow pl-4">
          {userRole === 'admin' ? 'ADMIN ACTIONS' : 'MY TASKS'}
        </h2>
        
        <div className="bg-[#111] p-8 rounded-xl border border-dashed border-brand-grey/30 flex items-center justify-center text-brand-grey">
          {userRole === 'student' ? (
            <div className="text-center">
              <ShieldAlert className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>You have no pending forms to sign.</p>
            </div>
          ) : (
             <div className="text-center">
              <p>Select a tool from the sidebar to manage the team.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;