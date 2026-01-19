import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Filter, User, Gamepad2, Mail, MessageSquare } from 'lucide-react';
import Spinner from '../../components/ui/Spinner'; // Make sure this path matches your file structure

const gameFilters = [
  "All",
  "Rocket League",
  "Super Smash Bros Ultimate",
  "Minecraft (Bed Wars)",
  "Mario Kart",
  "Fortnite (Zone Wars)",
  "Marvel Rivals",
  "Chess",
  "Tetris"
];

const Roster = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const studentsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(studentsList);
      } catch (error) {
        console.error("Error fetching roster:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter Logic
  const filteredStudents = students.filter(student => {
    // 1. Filter by Game
    const matchesGame = selectedGame === "All" 
      ? true 
      : student.games && student.games.includes(selectedGame);

    // 2. Filter by Search (Name or Gamertag)
    const matchesSearch = 
      (student.gamertag?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesGame && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-brand-grey/20 pb-4 gap-4">
        <div>
          <h2 className="font-titles text-3xl text-brand-white">TEAM ROSTER</h2>
          <p className="text-brand-grey text-sm">Manage players and view game assignments</p>
        </div>
        <div className="bg-brand-red px-4 py-1 rounded text-white font-titles text-sm">
          TOTAL PLAYERS: {filteredStudents.length}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-brand-black border border-brand-grey/20 p-4 rounded-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-brand-grey" size={20} />
          <input 
            type="text" 
            placeholder="Search Gamertag or Email..." 
            className="w-full bg-[#111] border border-brand-grey/30 rounded pl-10 pr-4 py-2 text-white focus:border-brand-red focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Game Filter Dropdown */}
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-3 text-brand-grey" size={20} />
          <select 
            className="w-full bg-[#111] border border-brand-grey/30 rounded pl-10 pr-4 py-2 text-white focus:border-brand-red focus:outline-none appearance-none"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            {gameFilters.map(game => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster Grid with Spinner Logic */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div key={student.id} className="bg-brand-black border border-brand-grey/20 rounded-xl overflow-hidden hover:border-brand-red/50 transition group">
              {/* Card Header */}
              <div className="bg-[#111] p-4 border-b border-brand-grey/10 flex justify-between items-start">
                <div>
                  <h3 className="font-titles text-xl text-brand-white group-hover:text-brand-yellow truncate">
                    {student.gamertag || "No Gamertag"}
                  </h3>
                  <div className="flex items-center gap-2 text-brand-grey text-xs mt-1">
                    <Mail size={12} />
                    <span className="truncate max-w-[150px]">{student.email}</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-brand-grey/10 rounded text-xs text-brand-grey font-bold uppercase border border-brand-grey/20">
                  {student.role || 'Student'}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4">
                {/* Discord */}
                <div className="flex items-center gap-3 text-sm text-brand-grey">
                  <MessageSquare size={16} className="text-brand-purple" />
                  <span>{student.discord || "No Discord linked"}</span>
                </div>

                {/* Grade */}
                <div className="flex items-center gap-3 text-sm text-brand-grey">
                  <User size={16} className="text-brand-red" />
                  <span>{student.grade ? `${student.grade}th Grade` : "Grade not set"}</span>
                </div>

                {/* Games Tags */}
                <div className="pt-2 border-t border-brand-grey/10">
                  <p className="text-xs text-brand-grey mb-2 flex items-center gap-1">
                    <Gamepad2 size={12} /> ACTIVE GAMES
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {student.games && student.games.length > 0 ? (
                      student.games.map(game => (
                        <span key={game} className="text-[10px] px-2 py-1 bg-brand-red/10 text-brand-red border border-brand-red/30 rounded">
                          {game}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-brand-grey italic">No games selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roster;