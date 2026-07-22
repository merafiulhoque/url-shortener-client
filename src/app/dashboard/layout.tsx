// app/dashboard/layout.tsx
import { getToken } from "@/actions/getToken";
import Navbar from "@/components/Dashboard/Navbar";
import Sidebar from "@/components/Dashboard/Sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const token = await getToken();
  if (!token) {
    redirect("/signin");
  }
  
  return (
    // Applied the deep dark background and custom indigo selection color
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Subtle ambient background glow for premium feel */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950 to-zinc-950" />
      
      {/* Content wrapper keeping everything above the background glow */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Navbar sits at the top */}
        <Navbar />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar sits on the left */}
          <Sidebar />
          
          {/* The main page content renders here */}
          {/* Added responsive padding and prevented horizontal scrollbar bleeding */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4">
            {children}
          </main>
        </div>
      </div>

    </div>
  );
}