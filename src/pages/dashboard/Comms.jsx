import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Send, Hash, Trash2, Shield } from 'lucide-react';

const CHANNELS = [
  { id: 'general', name: 'general', locked: false },
  { id: 'announcements', name: 'announcements', locked: true }, // Only admin can post
  { id: 'rocket-league', name: 'rocket-league', locked: false },
  { id: 'smash-bros', name: 'smash-bros', locked: false },
  { id: 'minecraft', name: 'minecraft', locked: false },
];

const Comms = () => {
  const { currentUser, userRole } = useAuth();
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const dummyScroll = useRef();

  // 1. REAL-TIME LISTENER
  useEffect(() => {
    // Query: Get messages for this channel, ordered by time
    const q = query(
      collection(db, "messages"),
      where("channel", "==", activeChannel),
      orderBy("createdAt", "asc")
    );

    // This function runs AUTOMATICALLY whenever the database changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      // Auto-scroll to bottom
      dummyScroll.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => unsubscribe();
  }, [activeChannel]);

  // 2. SEND MESSAGE FUNCTION
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Permissions check for Announcements
    if (activeChannel === 'announcements' && userRole === 'student') {
      alert("Only Staff can post in Announcements.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email.split('@')[0], // Fallback to email prefix
        photoURL: currentUser.photoURL,
        role: userRole,
        channel: activeChannel
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // 3. DELETE MESSAGE (Admin Only)
  const deleteMessage = async (id) => {
    if (window.confirm("Delete this message?")) {
      await deleteDoc(doc(db, "messages", id));
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-brand-black border border-brand-grey/20 rounded-xl overflow-hidden">
      
      {/* SIDEBAR: CHANNELS */}
      <div className="w-64 bg-[#111] border-r border-brand-grey/20 flex flex-col">
        <div className="p-4 border-b border-brand-grey/20">
          <h3 className="font-titles text-brand-white tracking-wider">CHANNELS</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {CHANNELS.map(channel => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-bold transition ${
                activeChannel === channel.id 
                  ? 'bg-brand-red/20 text-brand-white border-l-2 border-brand-red' 
                  : 'text-brand-grey hover:bg-brand-grey/10 hover:text-brand-white'
              }`}
            >
              <Hash size={16} />
              {channel.name}
              {channel.locked && <Shield size={12} className="ml-auto text-brand-yellow" />}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-brand-black relative">
        
        {/* Chat Header */}
        <div className="h-14 border-b border-brand-grey/20 flex items-center px-6 bg-[#0a0a0a]">
          <Hash className="text-brand-grey mr-2" size={20} />
          <span className="font-titles text-lg text-white">{activeChannel}</span>
          {activeChannel === 'announcements' && (
            <span className="ml-4 text-xs text-brand-yellow border border-brand-yellow/30 px-2 py-1 rounded">
              READ ONLY
            </span>
          )}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.uid === currentUser.uid;
            return (
              <div key={msg.id} className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-brand-grey/30 flex items-center justify-center overflow-hidden flex-shrink-0 border border-brand-grey/20">
                  {msg.photoURL ? (
                    <img src={msg.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-white">{msg.displayName?.[0]?.toUpperCase()}</span>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-brand-grey">
                      {msg.displayName}
                    </span>
                    {msg.role === 'admin' && (
                      <span className="text-[10px] bg-brand-red text-white px-1 rounded">ADMIN</span>
                    )}
                  </div>
                  
                  <div className={`px-4 py-2 rounded-lg text-sm ${
                    isMe 
                      ? 'bg-brand-red text-white rounded-tr-none' 
                      : 'bg-[#222] text-gray-200 border border-brand-grey/20 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Admin Delete Button */}
                  {(userRole === 'admin' || userRole === 'coach') && (
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 absolute -right-8 top-2 text-brand-grey hover:text-brand-red transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={dummyScroll}></div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#111] border-t border-brand-grey/20">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={activeChannel === 'announcements' && userRole === 'student'}
              placeholder={activeChannel === 'announcements' && userRole === 'student' ? "Read Only Channel" : `Message #${activeChannel}`}
              className="flex-1 bg-brand-black border border-brand-grey/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-red disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim() || (activeChannel === 'announcements' && userRole === 'student')}
              className="bg-brand-red text-white p-3 rounded-lg hover:bg-brand-darkRed transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Comms;