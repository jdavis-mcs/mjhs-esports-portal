import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Monitor, RefreshCw, Minus, Plus } from 'lucide-react';

const StreamControl = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize or Fetch Data
  useEffect(() => {
    const ref = doc(db, "stream", "live");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      } else {
        // Create default if missing
        const defaultData = { teamA: 'MJHS', teamB: 'GUEST', scoreA: 0, scoreB: 0, game: 'Rocket League', status: 'OFFLINE' };
        setDoc(ref, defaultData);
        setData(defaultData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const updateScore = async (team, delta) => {
    const ref = doc(db, "stream", "live");
    const field = team === 'A' ? 'scoreA' : 'scoreB';
    const currentScore = data[field];
    await updateDoc(ref, {
      [field]: Math.max(0, currentScore + delta)
    });
  };

  const updateText = async (field, value) => {
    await updateDoc(doc(db, "stream", "live"), { [field]: value });
  };

  if (loading || !data) return <div className="text-brand-grey">Loading Stream Controls...</div>;

  return (
    <div className="bg-[#111] p-6 rounded-xl border border-brand-red/30 shadow-[0_0_15px_rgba(176,12,26,0.1)]">
      <div className="flex justify-between items-center mb-6 border-b border-brand-grey/20 pb-4">
        <h3 className="font-titles text-xl text-white flex items-center gap-2">
          <Monitor className="text-brand-red" /> LIVE STREAM CONTROL
        </h3>
        <select 
          className="bg-brand-black border border-brand-grey/30 text-xs rounded p-1 text-white"
          value={data.status}
          onChange={(e) => updateText('status', e.target.value)}
        >
          <option value="OFFLINE">OFFLINE</option>
          <option value="STARTING SOON">STARTING SOON</option>
          <option value="LIVE">LIVE</option>
          <option value="INTERMISSION">INTERMISSION</option>
          <option value="GG WP">GG WP</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Team A Control */}
        <div className="text-center space-y-3">
          <input 
            type="text" 
            className="w-full bg-brand-black border border-brand-grey/30 text-center font-bold text-brand-red rounded p-2"
            value={data.teamA}
            onChange={(e) => updateText('teamA', e.target.value)}
          />
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => updateScore('A', -1)} className="p-2 bg-brand-grey/20 rounded hover:bg-brand-grey/40 text-white"><Minus /></button>
            <span className="font-titles text-4xl text-white">{data.scoreA}</span>
            <button onClick={() => updateScore('A', 1)} className="p-2 bg-brand-red rounded hover:bg-brand-darkRed text-white"><Plus /></button>
          </div>
        </div>

        {/* Team B Control */}
        <div className="text-center space-y-3">
          <input 
            type="text" 
            className="w-full bg-brand-black border border-brand-grey/30 text-center font-bold text-white rounded p-2"
            value={data.teamB}
            onChange={(e) => updateText('teamB', e.target.value)}
          />
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => updateScore('B', -1)} className="p-2 bg-brand-grey/20 rounded hover:bg-brand-grey/40 text-white"><Minus /></button>
            <span className="font-titles text-4xl text-white">{data.scoreB}</span>
            <button onClick={() => updateScore('B', 1)} className="p-2 bg-brand-grey rounded hover:bg-white hover:text-black text-white"><Plus /></button>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-brand-grey/10">
        <label className="text-xs text-brand-grey block mb-1">Current Game Title</label>
        <input 
          type="text" 
          className="w-full bg-brand-black border border-brand-grey/30 text-white rounded p-2 text-sm"
          value={data.game}
          onChange={(e) => updateText('game', e.target.value)}
        />
      </div>
    </div>
  );
};

export default StreamControl;