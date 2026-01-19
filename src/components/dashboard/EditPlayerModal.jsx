import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { X, Save, Trophy, Activity } from 'lucide-react';

const EditPlayerModal = ({ player, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  
  // We initialize state with the player's existing data or defaults
  const [formData, setFormData] = useState({
    gamertag: player.gamertag || '',
    discord: player.discord || '',
    role: player.role || 'student',
    // Stats Object (nested in your database)
    stats: {
      goals: player.stats?.goals || 0,
      assists: player.stats?.assists || 0,
      wins: player.stats?.wins || 0,
      mvps: player.stats?.mvps || 0
    }
  });

  const handleStatChange = (statName, value) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statName]: parseInt(value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const playerRef = doc(db, "users", player.id);
      await updateDoc(playerRef, {
        gamertag: formData.gamertag,
        discord: formData.discord,
        role: formData.role,
        stats: formData.stats
      });
      onUpdate(); // Trigger a refresh in the parent component
      onClose();
    } catch (error) {
      console.error("Error updating player:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-[#111] w-full max-w-2xl rounded-xl border border-brand-red/50 shadow-[0_0_30px_rgba(176,12,26,0.2)] overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-brand-red p-4 flex justify-between items-center">
          <h2 className="font-titles text-xl text-white">EDIT PLAYER: {player.gamertag}</h2>
          <button onClick={onClose} className="text-white hover:text-brand-black"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Section 1: Profile Details */}
          <div className="space-y-4">
            <h3 className="text-brand-grey text-sm font-bold flex items-center gap-2">
              <Activity size={16} /> PROFILE DETAILS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-brand-grey mb-1 block">Gamertag</label>
                <input 
                  type="text" 
                  className="w-full bg-brand-black border border-brand-grey/30 rounded p-2 text-white"
                  value={formData.gamertag} 
                  onChange={(e) => setFormData({...formData, gamertag: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-brand-grey mb-1 block">Discord</label>
                <input 
                  type="text" 
                  className="w-full bg-brand-black border border-brand-grey/30 rounded p-2 text-white"
                  value={formData.discord} 
                  onChange={(e) => setFormData({...formData, discord: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-brand-grey mb-1 block">Role (Permission Level)</label>
                <select 
                  className="w-full bg-brand-black border border-brand-grey/30 rounded p-2 text-white"
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="student">Student (No Access)</option>
                  <option value="player">Player (Roster Access)</option>
                  <option value="coach">Coach (Admin Access)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Player Stats (For the Dashboard) */}
          <div className="space-y-4 pt-4 border-t border-brand-grey/20">
            <h3 className="text-brand-yellow text-sm font-bold flex items-center gap-2">
              <Trophy size={16} /> SEASON STATISTICS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-brand-grey mb-1 block">Goals / Points</label>
                <input type="number" className="w-full bg-brand-black border border-brand-grey/30 rounded p-2 text-white"
                  value={formData.stats.goals} onChange={(e) => handleStatChange('goals', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-brand-grey mb-1 block">Assists</label>
                <input type="number" className="w-full bg-brand-black border border-brand-grey/30 rounded p-2 text-white"
                  value={formData.stats.assists} onChange={(e) => handleStatChange('assists', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-brand-grey mb-1 block">Wins</label>
                <input type="number" className="w-full bg-brand-black border border-brand-grey/30 rounded p-2 text-white"
                  value={formData.stats.wins} onChange={(e) => handleStatChange('wins', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-brand-grey mb-1 block">MVPs</label>
                <input type="number" className="w-full bg-brand-black border border-brand-grey/30 rounded p-2 text-white"
                  value={formData.stats.mvps} onChange={(e) => handleStatChange('mvps', e.target.value)} />
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-brand-red text-white font-titles py-3 rounded hover:bg-brand-darkRed transition flex justify-center items-center gap-2"
          >
            {loading ? 'SAVING...' : <><Save size={20} /> SAVE CHANGES</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPlayerModal;