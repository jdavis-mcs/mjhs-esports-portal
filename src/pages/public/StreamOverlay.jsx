import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Trophy } from 'lucide-react';

const StreamOverlay = () => {
  const [matchData, setMatchData] = useState({
    teamA: 'MJHS',
    teamB: 'OPPONENT',
    scoreA: 0,
    scoreB: 0,
    game: 'Rocket League',
    status: 'LIVE'
  });

  useEffect(() => {
    // Listen to a specific document "stream/live"
    const unsub = onSnapshot(doc(db, "stream", "live"), (doc) => {
      if (doc.exists()) {
        setMatchData(doc.data());
      }
    });
    return () => unsub();
  }, []);

  return (
    // 'bg-transparent' is crucial for OBS
    <div className="min-h-screen bg-transparent p-10 flex flex-col justify-between">
      
      {/* Top Bar Scoreboard */}
      <div className="flex justify-center">
        <div className="flex items-stretch bg-brand-black border-2 border-brand-red rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          
          {/* Team A (Home) */}
          <div className="bg-[#111] p-4 min-w-[150px] flex flex-col items-center justify-center border-r border-brand-grey/30">
            <h2 className="font-titles text-3xl text-brand-white tracking-widest">{matchData.teamA}</h2>
            <div className="w-full h-1 bg-brand-red mt-2"></div>
          </div>

          {/* Scores */}
          <div className="flex items-center bg-brand-red px-6">
             <span className="font-titles text-5xl text-white drop-shadow-md">{matchData.scoreA}</span>
             <span className="mx-4 text-white/50 font-bold">-</span>
             <span className="font-titles text-5xl text-white drop-shadow-md">{matchData.scoreB}</span>
          </div>

          {/* Team B (Away) */}
          <div className="bg-[#111] p-4 min-w-[150px] flex flex-col items-center justify-center border-l border-brand-grey/30">
            <h2 className="font-titles text-3xl text-brand-white tracking-widest">{matchData.teamB}</h2>
            <div className="w-full h-1 bg-brand-grey mt-2"></div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar (Optional) */}
      <div className="flex justify-between items-end">
        <div className="bg-brand-black/90 border-l-4 border-brand-yellow px-6 py-3 rounded-r-xl">
           <h3 className="text-brand-yellow font-titles text-xl flex items-center gap-2">
             <Trophy size={20} /> CURRENT MATCH
           </h3>
           <p className="text-white font-bold">{matchData.game}</p>
        </div>
        
        <div className="bg-brand-red px-4 py-2 rounded-t-lg">
          <span className="font-titles text-white tracking-widest animate-pulse">
            {matchData.status}
          </span>
        </div>
      </div>

    </div>
  );
};

export default StreamOverlay;