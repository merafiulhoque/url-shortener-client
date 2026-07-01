import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-4">
      <main className="text-center flex flex-col items-center max-w-3xl">
        
        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Shorten Your Links. <br className="hidden md:block" />
          <span className="text-indigo-600">Expand Your Reach.</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl">
          A lightning-fast, secure, and reliable URL shortener. Create an account today to start tracking your clicks and managing your custom links.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/signin"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link 
            href="/signup"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
        
      </main>
    </div>
  );
}