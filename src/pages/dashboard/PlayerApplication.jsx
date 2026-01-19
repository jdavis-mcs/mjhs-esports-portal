import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CheckCircle, AlertCircle } from 'lucide-react';

const PlayerApplication = () => {
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    gamertag: '',
    discord: '',
    grade: '',
    gpa: '',
    guardianName: '',
    guardianEmail: '',
    jerseySize: 'M',
    games: [] // e.g., ['Rocket League']
  });

  const gameOptions = ["Rocket League", "Super Smash Bros", "Minecraft", "Valorant", "Overwatch 2"];

  const handleGameToggle = (game) => {
    setFormData(prev => ({
      ...prev,
      games: prev.games.includes(game) 
        ? prev.games.filter(g => g !== game)
        : [...prev.games, game]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update the User Profile itself with this data
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        applicationStatus: 'submitted', // [cite: 168]
        updatedAt: new Date()
      });

      // 2. Create a separate 'application' document (optional, but good for admin logs)
      // For this MVP, we will stick to updating the User profile directly as per your "users collection" plan[cite: 131, 140].
      
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted || userRole === 'player') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
        <CheckCircle size={64} className="text-brand-green" />
        <h2 className="font-titles text-3xl text-brand-white">APPLICATION RECEIVED</h2>
        <p className="text-brand-grey">Your coach will review your application and schedule a tryout.</p>
        <div className="bg-brand-grey/10 p-4 rounded border border-brand-grey/30">
          <p className="font-bold text-brand-yellow">CURRENT STATUS: {userRole === 'player' ? 'ROSTERED' : 'PENDING TRYOUT'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="font-titles text-3xl text-brand-white">PLAYER APPLICATION</h2>
        <p className="text-brand-grey">Complete your profile to tryout for the season.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111] p-8 rounded-xl border border-brand-grey/20 space-y-6">
        
        {/* Section 1: Player Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-titles text-brand-red border-b border-brand-grey/20 pb-2">PLAYER INFO</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Gamertag"
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={formData.gamertag} onChange={e => setFormData({...formData, gamertag: e.target.value})}
            />
            <input 
              required type="text" placeholder="Discord Username"
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={formData.discord} onChange={e => setFormData({...formData, discord: e.target.value})}
            />
             <select 
              required
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}
            >
              <option value="">Select Grade</option>
              {[9, 10, 11, 12].map(g => <option key={g} value={g}>{g}th Grade</option>)}
            </select>
            <input 
              required type="number" step="0.01" placeholder="Current GPA"
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={formData.gpa} onChange={e => setFormData({...formData, gpa: e.target.value})}
            />
          </div>
        </div>

        {/* Section 2: Guardian Info (Required for safety/permissions) */}
        <div className="space-y-4">
          <h3 className="text-xl font-titles text-brand-red border-b border-brand-grey/20 pb-2">GUARDIAN INFO</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Parent/Guardian Name"
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})}
            />
            <input 
              required type="email" placeholder="Parent Email"
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={formData.guardianEmail} onChange={e => setFormData({...formData, guardianEmail: e.target.value})}
            />
          </div>
        </div>

        {/* Section 3: Game Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-titles text-brand-red border-b border-brand-grey/20 pb-2">GAMES OF INTEREST</h3>
          <div className="flex flex-wrap gap-3">
            {gameOptions.map(game => (
              <button
                key={game}
                type="button"
                onClick={() => handleGameToggle(game)}
                className={`px-4 py-2 rounded border transition ${
                  formData.games.includes(game) 
                    ? 'bg-brand-red text-white border-brand-red' 
                    : 'bg-transparent text-brand-grey border-brand-grey/30 hover:border-brand-grey'
                }`}
              >
                {game}
              </button>
            ))}
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-brand-white text-brand-black font-titles text-xl py-4 rounded hover:bg-gray-200 transition"
        >
          {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
        </button>
      </form>
    </div>
  );
};

export default PlayerApplication;