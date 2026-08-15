import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-zinc-300 px-4 relative overflow-hidden selection:bg-emerald-700/30 selection:text-emerald-200 z-0">
      
      {/* Deep green ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[600px] h-[500px] bg-emerald-700/[0.06] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-900/[0.04] blur-[100px] rounded-full pointer-events-none" />
      
      <main className="text-center flex flex-col items-center max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Sleek Announcement Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#09090A] border border-emerald-900/40 text-sm font-medium text-zinc-300 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:border-emerald-700/60 transition-colors cursor-default">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>The next generation of link management</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight md:leading-tight text-white">
          Shorten Your Links. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            Expand Your Reach.
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed font-light px-4 sm:px-0">
          A lightning-fast, secure, and reliable URL shortener. Create an account today to start tracking your clicks, managing custom aliases, and driving growth.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center items-center px-4 sm:px-0">
          <Link 
            href="/signup"
            className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.25)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden text-lg"
          >
            {/* Button Shine Animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            
            <span className="relative z-10">Get Started for Free</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/signin"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-zinc-300 bg-[#09090A] border border-emerald-900/30 hover:bg-[#111113] hover:border-emerald-700/50 hover:text-white transition-all duration-300 active:scale-[0.98] flex items-center justify-center text-lg shadow-sm"
          >
            Sign In
          </Link>
        </div>
        
      </main>

      {/* Subtle Green Grid Background */}
      <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)' }}></div>
    </div>
  );
}