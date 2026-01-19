import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';
import { Youtube, Twitch, Instagram, Twitter } from 'lucide-react';

const Home = () => {
  
  const scrollToStream = () => {
    document.getElementById('stream-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-white font-body selection:bg-brand-red selection:text-white flex flex-col">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-black via-transparent to-brand-black z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/20 blur-[120px] rounded-full"></div>
        
        {/* Content */}
        <div className="relative z-20 text-center max-w-4xl px-4">
          <h2 className="text-brand-yellow font-titles tracking-[0.2em] text-lg mb-4 animate-pulse">
            MADISON JUNIOR HIGH SCHOOL
          </h2>
          <h1 className="font-titles text-6xl md:text-9xl text-white mb-2 leading-tight">
            #LEVEL<span className="text-brand-red">UP</span>
          </h1>
          <p className="font-body text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            The official home of the Esports Cubs. Competing in Rocket League, Super Smash Bros, Minecraft, and more.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {/* WATCH LIVE -> Matches/Schedule */}
			<Link to="/matches" className="bg-brand-red text-white px-8 py-4 rounded font-titles text-xl hover:bg-brand-darkRed transition shadow-[0_0_20px_rgba(176,12,26,0.4)] hover:shadow-[0_0_30px_rgba(176,12,26,0.6)]">
			  MATCHES
		    </Link>
            
            {/* MEET THE TEAM -> Public Roster */}
			  <Link to="/public-roster" className="border border-brand-grey text-white px-8 py-4 rounded font-titles text-xl hover:bg-brand-white hover:text-brand-black transition">
				MEET THE TEAM
			  </Link>
            
			{/* MERCH STORE Button (Added) */}
			  <Link to="/shop" className="bg-brand-yellow text-brand-black font-titles text-xl px-8 py-4 skew-x-[-10deg] hover:scale-105 transition-all duration-300 border-2 border-brand-yellow shadow-[0_0_20px_rgba(255,245,0,0.3)]">
				<span className="skew-x-[10deg] block">MERCH STORE</span>
			  </Link>
			
			
            <Link to="/login">
              <button className="bg-brand-white text-brand-black font-titles text-xl px-8 py-4 skew-x-[-10deg] hover:scale-105 transition-all duration-300 border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <span className="skew-x-[10deg] block">JOIN THE TEAM</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- TICKER --- */}
      <div className="bg-brand-red py-4 overflow-hidden whitespace-nowrap border-y-4 border-brand-darkRed z-20">
        <div className="inline-block animate-marquee font-titles text-2xl text-brand-black font-bold tracking-wider">
          ROCKET LEAGUE  //  SUPER SMASH BROS  //  MINECRAFT  //  MARIO KART  //  FORTNITE  //  MARVEL RIVALS  //  CHESS  //  TETRIS  //  
          ROCKET LEAGUE  //  SUPER SMASH BROS  //  MINECRAFT  //  MARIO KART  //  FORTNITE  //  MARVEL RIVALS  //  CHESS  //  TETRIS
        </div>
      </div>

      {/* --- LIVE STREAM SECTION (Requested in Doc) --- */}
      <section id="stream-section" className="py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
           <div className="flex items-end gap-4 mb-8">
              <h2 className="font-titles text-4xl md:text-5xl text-white">
                BROADCAST <span className="text-brand-red">STATION</span>
              </h2>
              <div className="h-1 bg-brand-grey/30 flex-1 mb-3"></div>
           </div>

           {/* Video Container - 16:9 Aspect Ratio */}
           <div className="relative w-full pt-[56.25%] bg-black rounded-xl border border-brand-grey/20 overflow-hidden shadow-2xl">
              {/* Replace 'VIDEO_ID' with your actual YouTube Live ID */}
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID" 
                title="MJHS Esports Live"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
              
              {/* Offline Placeholder (Overlay this if stream is offline via logic later) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-black/80 pointer-events-none">
                 <p className="font-titles text-2xl text-brand-grey">STREAM IS CURRENTLY OFFLINE</p>
                 <p className="text-brand-grey/50 text-sm">Check the calendar for the next match</p>
              </div>
           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-brand-black border-t border-brand-grey/10 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-titles text-2xl text-brand-white">MJHS ESPORTS</h3>
            <p className="text-brand-grey text-sm">© {new Date().getFullYear()} Madison Consolidated Schools</p>
          </div>
          
          <div className="flex gap-6 text-brand-grey">
             <a href="#" className="hover:text-brand-red transition"><Youtube size={24} /></a>
             <a href="#" className="hover:text-brand-purple transition"><Twitch size={24} /></a>
             <a href="#" className="hover:text-brand-red transition"><Instagram size={24} /></a>
             <a href="#" className="hover:text-brand-white transition"><Twitter size={24} /></a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;