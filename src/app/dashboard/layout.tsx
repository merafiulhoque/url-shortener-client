// app/dashboard/layout.tsx
import Navbar from "@/components/Dashboard/Navbar";
import Sidebar from "@/components/Dashboard/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const token = (await cookies()).get("token")
  if(!token){
    redirect("/signin")
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar sits at the top */}
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar sits on the left */}
        <Sidebar />
        
        {/* The main page content renders here */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}