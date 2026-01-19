import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Calendar, Clock, MapPin, ArrowRight, Trophy } from 'lucide-react';
import StreamControl from '../../components/dashboard/StreamControl'; // Import it

const DashboardHome = () => {
  const { currentUser, userRole } = useAuth();
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextEvent = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const q = query(
          collection(db, "events"),
          where("date", ">=", today),
          orderBy("date", "asc"),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setNextEvent({
            id: querySnapshot.docs[0].id,
            ...docData
          });
        } else {
          setNextEvent(null);
        }
      } catch (error) {
        console.error("Error fetching next event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextEvent();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* WELCOME HEADER */}
      <div>
        <h1 className="font-titles text-4xl md:text-5xl text-brand-white mb-2">
          WELCOME BACK, <span className="text-brand-red">{currentUser.displayName || "PLAYER"}</span>
        </h1>
        <p className="font-body text-brand-grey text-lg">
          System Status: <span className="text-brand-green font-bold">ONLINE</span>
        </p>
      </div>
	  
	  {/* STREAM CONTROL WIDGET (Only for Admin/Coach) */}
	  {(userRole === 'admin' || userRole === 'coach') && (
		<StreamControl />
	  )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: NEXT MATCH */}
        <div className="lg:col-span-2 bg-brand-black border border-brand-grey/20 rounded-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
            <Calendar size={120} />
          </div>
          
          <div className="p-8 relative z-10">
            <h2 className="font-titles text-2xl text-brand-yellow mb-6 flex items-center gap-2">
              <Calendar className="text-brand-red" /> UPCOMING EVENT
            </h2>

            {loading ? (
              <div className="h-24 flex items-center text-brand-grey animate-pulse">Loading schedule...</div>
            ) : nextEvent ? (
              <div className="space-y-4">
                <div>
                  <div className="text-brand-grey text-sm font-bold tracking-widest mb-1">EVENT TITLE</div>
                  <div className="font-titles text-4xl md:text-5xl text-brand-white tracking-wide">
                    {nextEvent.title.toUpperCase()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center gap-2 text-brand-grey">
                    <div className="bg-brand-red p-2 rounded text-white"><Calendar size={18} /></div>
                    <span className="text-lg text-white">{formatDate(nextEvent.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-grey">
                    <div className="bg-brand-yellow p-2 rounded text-brand-black"><Clock size={18} /></div>
                    <span className="text-lg text-white">{nextEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-grey">
                    <div className="bg-brand-grey p-2 rounded text-white"><MapPin size={18} /></div>
                    <span className="text-lg text-white">{nextEvent.location}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-brand-grey/10">
                   <span className={`px-3 py-1 rounded text-sm font-bold border ${
                     nextEvent.type === 'Match' ? 'bg-brand-red text-white border-brand-red' : 
                     nextEvent.type === 'Practice' ? 'bg-brand-yellow text-brand-black border-brand-yellow' : 
                     'bg-brand-grey text-white border-brand-grey'
                   }`}>
                      {nextEvent.type.toUpperCase()}
                   </span>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <h3 className="text-2xl text-brand-white font-titles">NO UPCOMING EVENTS</h3>
                <p className="text-brand-grey mt-2">The calendar is currently clear.</p>
                <Link to="/dashboard/calendar" className="inline-block mt-4 text-brand-red hover:text-white transition">
                  View Full Schedule &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: QUICK ACTIONS (FIXED COLORS) */}
        <div className="bg-brand-black border border-brand-grey/20 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-titles text-xl text-brand-white mb-4">QUICK ACTIONS</h2>
            <div className="space-y-3">
              
              {/* TEAM CHAT: Always Red */}
              <Link to="/dashboard/comms" className="flex items-center justify-between bg-brand-red text-white p-4 rounded hover:bg-brand-darkRed group transition border border-brand-red">
                <span className="font-bold">TEAM CHAT</span>
                <ArrowRight size={18} className="text-white/70 group-hover:text-white" />
              </Link>

              {/* PROFILE: Always Yellow */}
              <Link to="/dashboard/stats" className="flex items-center justify-between bg-brand-yellow text-brand-black p-4 rounded hover:bg-yellow-400 group transition border border-brand-yellow">
                <span className="font-bold">UPDATE PROFILE</span>
                <ArrowRight size={18} className="text-brand-black/50 group-hover:text-brand-black" />
              </Link>

              {/* ROSTER: Always White */}
              {(userRole === 'admin' || userRole === 'coach') && (
                <Link to="/dashboard/roster" className="flex items-center justify-between bg-brand-white text-brand-black p-4 rounded hover:bg-gray-200 group transition border border-brand-white">
                  <span className="font-bold">MANAGE ROSTER</span>
                  <ArrowRight size={18} className="text-brand-black/50 group-hover:text-brand-black" />
                </Link>
              )}

            </div>
          </div>
        </div>

        {/* CARD 3: TEAM STATS */}
        <div className="md:col-span-3 bg-brand-red text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-titles text-3xl mb-2">ARE YOU GAME READY?</h2>
            <p className="opacity-90 max-w-xl">
              Ensure your profile is up to date with your current rank and active games. 
              Coaches use this data for roster selection.
            </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0">
             <Link to="/dashboard/stats">
              <button className="bg-brand-black text-white px-6 py-3 rounded font-titles font-bold hover:bg-brand-yellow hover:text-brand-black transition border-2 border-brand-black">
                UPDATE MY STATS
              </button>
             </Link>
          </div>
          <Trophy className="absolute -right-10 -bottom-10 text-brand-darkRed opacity-50 rotate-12" size={200} />
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;