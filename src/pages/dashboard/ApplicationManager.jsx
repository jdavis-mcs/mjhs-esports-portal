import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Spinner from '../../components/ui/Spinner';

const ApplicationManager = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only users who have 'submitted' or 'tryout' status
  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"), 
        where("applicationStatus", "in", ["submitted", "tryout"])
      );
      const snapshot = await getDocs(q);
      setApplicants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching apps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Workflow Action: Schedule Tryout
  const handleScheduleTryout = async (userId) => {
    if(!confirm("Move to 'Tryout' phase? This will notify the student.")) return;
    
    await updateDoc(doc(db, "users", userId), {
      applicationStatus: 'tryout'
    });
    fetchApplicants(); // Refresh list
  };

  // Workflow Action: Approve Roster (Promote to Player)
  const handleApprove = async (userId) => {
    if(!confirm("Approve for Roster? This grants 'Player' permissions.")) return;

    await updateDoc(doc(db, "users", userId), {
      applicationStatus: 'approved',
      role: 'player' // 
    });
    fetchApplicants(); // Should remove them from this list if we only show pending
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end border-b border-brand-grey/20 pb-4">
        <div>
          <h2 className="font-titles text-3xl text-brand-white">APPLICATION INBOX</h2>
          <p className="text-brand-grey text-sm">Review pending student applications</p>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="grid gap-4">
          {applicants.length === 0 && <p className="text-brand-grey">No pending applications.</p>}
          
          {applicants.map(app => (
            <div key={app.id} className="bg-[#111] p-6 rounded-xl border border-brand-grey/20 flex flex-col md:flex-row justify-between gap-4">
              
              {/* Applicant Info */}
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-titles text-2xl text-white">{app.displayName}</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border ${
                    app.applicationStatus === 'tryout' ? 'bg-brand-yellow text-brand-black border-brand-yellow' : 'bg-brand-grey/20 text-brand-grey border-brand-grey'
                  }`}>
                    {app.applicationStatus}
                  </span>
                </div>
                <div className="text-brand-grey text-sm mt-1 grid grid-cols-2 gap-x-8 gap-y-1">
                  <p>Gamertag: <span className="text-white">{app.gamertag}</span></p>
                  <p>GPA: <span className="text-white">{app.gpa}</span></p>
                  <p>Grade: <span className="text-white">{app.grade}</span></p>
                  <p>Games: <span className="text-white">{app.games?.join(", ")}</span></p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {app.applicationStatus === 'submitted' && (
                  <button 
                    onClick={() => handleScheduleTryout(app.id)}
                    className="bg-brand-yellow text-brand-black px-4 py-2 rounded font-bold hover:bg-yellow-400 transition"
                  >
                    SCHEDULE TRYOUT
                  </button>
                )}
                
                {app.applicationStatus === 'tryout' && (
                  <button 
                    onClick={() => handleApprove(app.id)}
                    className="bg-brand-green text-white px-4 py-2 rounded font-bold hover:bg-green-600 transition border border-brand-green"
                  >
                    APPROVE ROSTER
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationManager;