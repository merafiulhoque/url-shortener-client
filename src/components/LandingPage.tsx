import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 px-4 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Ambient Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none" />
      
      <main className="text-center flex flex-col items-center max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Sleek Announcement Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-sm font-medium text-zinc-300 backdrop-blur-md shadow-xl hover:border-indigo-500/50 transition-colors cursor-default">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>The next generation of link management</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight md:leading-tight">
          Shorten Your Links. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-500 to-cyan-400">
            Expand Your Reach.
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed font-light">
          A lightning-fast, secure, and reliable URL shortener. Create an account today to start tracking your clicks, managing custom aliases, and driving growth.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center items-center">
          <Link 
            href="/signup"
            className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 overflow-hidden text-lg"
          >
            {/* Button Shine Animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            
            Get Started for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/signin"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-zinc-300 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all duration-300 flex items-center justify-center text-lg hover:border-zinc-700"
          >
            Sign In
          </Link>
        </div>
        
      </main>

      {/* Subtle Grid Background (Optional but highly recommended for SaaS landing pages) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)' }}></div>
    </div>
  );
}