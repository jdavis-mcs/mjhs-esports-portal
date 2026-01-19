import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white font-body selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-black via-transparent to-brand-black z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/20 blur-[120px] rounded-full"></div>
        
        {/* Content */}
        <div className="relative z-20 text-center max-w-4xl px-4">
          <h2 className="text-brand-yellow font-titles tracking-[0.2em] text-lg mb-4 animate-pulse">
            MADISON JUNIOR HIGH SCHOOL
          </h2>
          <h1 className="font-titles text-7xl md:text-9xl text-white mb-2 leading-tight">
            #LEVEL<span className="text-brand-red">UP</span>
          </h1>
          <p className="font-body text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            The official home of the Esports Cubs. Competing in Rocket League, Super Smash Bros, Minecraft, and more.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/matches" className="bg-brand-red text-white px-8 py-4 rounded font-titles text-xl hover:bg-brand-darkRed transition shadow-[0_0_20px_rgba(176,12,26,0.4)] hover:shadow-[0_0_30px_rgba(176,12,26,0.6)]">
              WATCH LIVE
            </Link>
            <Link to="/roster" className="border border-brand-grey text-white px-8 py-4 rounded font-titles text-xl hover:bg-brand-white hover:text-brand-black transition">
              MEET THE TEAM
            </Link>
			<Link to="/login">
			  <button className="bg-brand-red text-white font-titles text-xl px-8 py-4 skew-x-[-10deg] hover:bg-brand-darkRed hover:scale-105 transition-all duration-300 border-2 border-brand-red shadow-[0_0_20px_rgba(176,12,26,0.5)]">
				<span className="skew-x-[10deg] block">JOIN THE TEAM</span>
			  </button>
			</Link>
          </div>
        </div>
      </section>

      {/* GAME TITLES TICKER (Static for now) */}
      <div className="bg-brand-red py-4 overflow-hidden whitespace-nowrap border-y-4 border-brand-darkRed">
        <div className="inline-block animate-marquee font-titles text-2xl text-brand-black font-bold tracking-wider">
          ROCKET LEAGUE  //  SUPER SMASH BROS  //  MINECRAFT  //  MARIO KART  //  FORTNITE  //  MARVEL RIVALS  //  CHESS  //  TETRIS  //  
          ROCKET LEAGUE  //  SUPER SMASH BROS  //  MINECRAFT  //  MARIO KART  //  FORTNITE  //  MARVEL RIVALS  //  CHESS  //  TETRIS
        </div>
      </div>
    </div>
  );
};

export default Home;