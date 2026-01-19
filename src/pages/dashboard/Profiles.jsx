import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Save, User, Gamepad2 } from 'lucide-react';
import toast from 'react-hot-toast'; // Import for notifications

const availableGames = [
  "Rocket League",
  "Super Smash Bros Ultimate",
  "Minecraft (Bed Wars)",
  "Mario Kart",
  "Fortnite (Zone Wars)",
  "Marvel Rivals",
  "Chess",
  "Tetris"
];

const Profiles = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gamertag: '',
    discord: '',
    grade: '',
    bio: '',
    games: []
  });

  // Load existing data when page opens
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            gamertag: data.gamertag || '',
            discord: data.discord || '',
            grade: data.grade || '',
            bio: data.bio || '',
            games: data.games || []
          });
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleGame = (game) => {
    setFormData(prev => {
      const isSelected = prev.games.includes(game);
      if (isSelected) {
        return { ...prev, games: prev.games.filter(g => g !== game) };
      } else {
        return { ...prev, games: [...prev.games, game] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- THIS WAS THE MISSING LINE ---
    const userRef = doc(db, "users", currentUser.uid);
    // ---------------------------------

    const savePromise = updateDoc(userRef, {
      gamertag: formData.gamertag,
      discord: formData.discord,
      grade: formData.grade,
      bio: formData.bio,
      games: formData.games,
      updatedAt: new Date()
    });

    try {
      await toast.promise(savePromise, {
        loading: 'Saving Profile...',
        success: 'Profile Updated Successfully!',
        error: 'Failed to update profile.',
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="font-titles text-3xl text-brand-white mb-6 border-b border-brand-grey/20 pb-4">
        PLAYER PROFILE
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: IDENTITY */}
        <div className="bg-brand-black border border-brand-grey/20 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6 text-brand-red">
            <User size={24} />
            <h3 className="font-titles text-xl">IDENTITY</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-brand-grey text-sm mb-2">Gamertag</label>
              <input 
                type="text" 
                name="gamertag"
                value={formData.gamertag}
                onChange={handleChange}
                placeholder="Ex: NinjaCuber99"
                className="w-full bg-[#111] border border-brand-grey/30 rounded p-3 text-white focus:border-brand-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-brand-grey text-sm mb-2">Discord Username</label>
              <input 
                type="text" 
                name="discord"
                value={formData.discord}
                onChange={handleChange}
                placeholder="username#0000"
                className="w-full bg-[#111] border border-brand-grey/30 rounded p-3 text-white focus:border-brand-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-brand-grey text-sm mb-2">Grade Level</label>
              <select 
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full bg-[#111] border border-brand-grey/30 rounded p-3 text-white focus:border-brand-red focus:outline-none"
              >
                <option value="">Select Grade</option>
                <option value="6">6th Grade</option>
                <option value="7">7th Grade</option>
                <option value="8">8th Grade</option>
                <option value="Staff">Staff / Coach</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: GAMES */}
        <div className="bg-brand-black border border-brand-grey/20 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6 text-brand-red">
            <Gamepad2 size={24} />
            <h3 className="font-titles text-xl">ACTIVE GAMES</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableGames.map((game) => (
              <button
                key={game}
                type="button"
                onClick={() => toggleGame(game)}
                className={`p-4 rounded-lg text-sm font-bold transition-all duration-200 border ${
                  formData.games.includes(game)
                    ? 'bg-brand-red text-white border-brand-red shadow-[0_0_10px_rgba(176,12,26,0.4)]'
                    : 'bg-[#111] text-brand-grey border-brand-grey/20 hover:border-brand-white'
                }`}
              >
                {game}
              </button>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-brand-yellow text-brand-black px-8 py-3 rounded font-titles font-bold hover:bg-white transition"
          >
            <Save size={20} />
            {loading ? 'SAVING...' : 'SAVE PROFILE'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Profiles;