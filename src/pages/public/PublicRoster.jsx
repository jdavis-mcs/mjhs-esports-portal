import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Navbar from '../../components/layout/Navbar';
import { User, Gamepad2 } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const PublicRoster = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        // Filter: Only show users with 'player' role
        const players = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.role === 'player');
        setStudents(players);
      } catch (error) {
        console.error("Error fetching roster:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white font-body">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="font-titles text-5xl md:text-7xl mb-4">MEET THE <span className="text-brand-red">TEAM</span></h1>
          <p className="text-brand-grey text-xl">The current lineup representing MJHS Esports.</p>
        </div>

        {loading ? <div className="flex justify-center"><Spinner /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {students.map(player => (
              <div key={player.id} className="bg-[#111] border border-brand-grey/20 p-8 rounded-xl hover:border-brand-red/50 transition group">
                <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-red group-hover:bg-brand-red group-hover:text-white transition">
                  <User size={32} />
                </div>
                <h3 className="font-titles text-2xl text-center mb-2 group-hover:text-brand-yellow transition">
                  {player.gamertag || "Unknown Player"}
                </h3>
                
                {/* Public Stats (Wins/Goals) */}
                {player.stats && (
                   <div className="flex justify-center gap-6 my-4 border-y border-brand-grey/10 py-2">
                      <div className="text-center">
                        <span className="block font-titles text-xl text-brand-white">{player.stats.wins || 0}</span>
                        <span className="text-[10px] text-brand-grey tracking-widest">WINS</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-titles text-xl text-brand-red">{player.stats.goals || 0}</span>
                        <span className="text-[10px] text-brand-grey tracking-widest">GOALS</span>
                      </div>
                   </div>
                )}

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                   {player.games?.map(game => (
                     <span key={game} className="text-[10px] px-2 py-1 border border-brand-grey/30 rounded text-brand-grey uppercase">
                       {game}
                     </span>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicRoster;