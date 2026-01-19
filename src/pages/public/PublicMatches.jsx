import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Navbar from '../../components/layout/Navbar';
import { Calendar as CalIcon, MapPin, Clock } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const PublicMatches = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white font-body">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-titles text-5xl md:text-7xl mb-4">MATCH <span className="text-brand-red">SCHEDULE</span></h1>
          <p className="text-brand-grey text-xl">Upcoming games and events.</p>
        </div>

        {loading ? <div className="flex justify-center"><Spinner /></div> : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="flex flex-col md:flex-row bg-[#111] border border-brand-grey/20 rounded-xl overflow-hidden hover:border-brand-red/50 transition">
                <div className="bg-brand-red/10 p-6 flex flex-col items-center justify-center min-w-[120px] text-brand-red border-b md:border-b-0 md:border-r border-brand-grey/20">
                  <span className="font-titles text-4xl">{new Date(event.date).getDate()}</span>
                  <span className="font-bold uppercase text-sm">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-brand-grey/30 text-brand-grey uppercase">
                      {event.type}
                    </span>
                    <span className="flex items-center gap-1 text-brand-grey text-sm">
                      <Clock size={14} /> {event.time}
                    </span>
                  </div>
                  <h3 className="font-titles text-2xl text-white mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-brand-grey text-sm">
                    <MapPin size={16} className="text-brand-red" />
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicMatches;