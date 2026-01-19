import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Calendar as CalIcon, Clock, MapPin, Trash2, Plus } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const EVENT_TYPES = [
  { label: 'Match', color: 'bg-brand-red text-white border-brand-red' },
  { label: 'Practice', color: 'bg-brand-yellow text-brand-black border-brand-yellow' },
  { label: 'Meeting', color: 'bg-brand-grey text-white border-brand-grey' }
];

const Calendar = () => {
  const { userRole } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: 'Esports Lab',
    type: 'Practice'
  });

  // 1. Fetch Events (Real-time)
  useEffect(() => {
    // Order by date ascending (soonest first)
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Add Event (Admin Only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    try {
      await addDoc(collection(db, "events"), {
        ...newEvent,
        createdAt: new Date()
      });
      setShowForm(false);
      setNewEvent({ title: '', date: '', time: '', location: 'Esports Lab', type: 'Practice' });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // 3. Delete Event
  const handleDelete = async (id) => {
    if (window.confirm("Remove this event?")) {
      await deleteDoc(doc(db, "events", id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-brand-grey/20 pb-4">
        <div>
          <h2 className="font-titles text-3xl text-brand-white">TEAM SCHEDULE</h2>
          <p className="text-brand-grey text-sm">Upcoming matches and practices</p>
        </div>
        
        {/* Only Admin sees "Add Event" button */}
        {(userRole === 'admin' || userRole === 'coach') && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded font-bold hover:bg-brand-darkRed transition"
          >
            {showForm ? 'CLOSE' : 'ADD EVENT'} <Plus size={20} />
          </button>
        )}
      </div>

      {/* Admin Entry Form */}
      {showForm && (
        <div className="bg-[#111] p-6 rounded-xl border border-brand-grey/30 animate-fade-in">
          <h3 className="font-titles text-xl mb-4 text-brand-yellow">NEW EVENT DETAILS</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Event Title (e.g., VS Floyd Central)" 
              className="md:col-span-2 bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
            />
            <input 
              type="date" 
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
            />
            <input 
              type="time" 
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}
            />
            <select 
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}
            >
              {EVENT_TYPES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
            </select>
            <input 
              type="text" placeholder="Location"
              className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})}
            />
            <button className="md:col-span-2 bg-brand-white text-brand-black font-bold p-3 rounded hover:bg-gray-200">
              PUBLISH TO SCHEDULE
            </button>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {loading && <Spinner />}

        {events.length === 0 && !loading && (
          <div className="text-center text-brand-grey py-10">No upcoming events scheduled.</div>
        )}

        {events.map(event => {
          const typeStyle = EVENT_TYPES.find(t => t.label === event.type) || EVENT_TYPES[0];
          
          return (
            <div key={event.id} className="flex flex-col md:flex-row bg-brand-black border border-brand-grey/20 rounded-xl overflow-hidden group hover:border-brand-grey/50 transition">
              
              {/* Date Block */}
              <div className="bg-[#111] p-6 flex flex-col items-center justify-center min-w-[120px] border-b md:border-b-0 md:border-r border-brand-grey/20">
                <span className="font-titles text-3xl text-brand-white">{new Date(event.date).getDate()}</span>
                <span className="text-brand-red font-bold uppercase text-sm">
                  {new Date(event.date).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-brand-grey text-xs mt-1">{new Date(event.date).toLocaleString('default', { weekday: 'long' })}</span>
              </div>

              {/* Event Details */}
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${typeStyle.color}`}>
                    {event.type.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1 text-brand-grey text-sm">
                    <Clock size={14} /> {event.time}
                  </div>
                </div>
                
                <h3 className="font-titles text-2xl text-white group-hover:text-brand-yellow transition">
                  {event.title}
                </h3>
                
                <div className="flex items-center gap-2 text-brand-grey text-sm mt-2">
                  <MapPin size={16} className="text-brand-red" />
                  {event.location}
                </div>
              </div>

              {/* Admin Actions */}
              {(userRole === 'admin' || userRole === 'coach') && (
                <button 
                  onClick={() => handleDelete(event.id)}
                  className="bg-brand-red/10 text-brand-red p-4 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-brand-red hover:text-white transition w-16"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;