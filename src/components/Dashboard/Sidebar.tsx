"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PencilIcon, ChartBarIncreasing, Unlink, MenuIcon, Settings2Icon} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Create",
      fullName: "Create New URL",
      href: "/dashboard/create",
      icon: <PencilIcon className="w-5 h-5 md:w-5 md:h-5" />,
    },
    {
      name: "Links",
      fullName: "All URLs",
      href: "/dashboard",
      icon: <Unlink className="w-5 h-5 md:w-5 md:h-5" />,
    },
    {
      name: "Analytics",
      fullName: "Analytics",
      href: "/dashboard/analytics",
      icon: <ChartBarIncreasing className="w-5 h-5 md:w-5 md:h-5" />,
    },
    {
      name: "Bulk",
      fullName: "Bulk Process",
      href: "/dashboard/bulk-process",
      icon: <MenuIcon className="w-5 h-5 md:w-5 md:h-5" />
    },
    {
      name: "Jobs",
      fullName: "Bulk Jobs",
      href: "/dashboard/bulk-jobs",
      icon: <Settings2Icon className="w-5 h-5 md:w-5 md:h-5"/>
    }
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-[#050505] border-r border-white/5 h-[calc(100vh-4rem)] shrink-0 hidden md:flex flex-col relative z-20">
        {/* Subtle Inner Glow */}
        <div className="absolute top-0 left-0 w-full h-[150px] bg-emerald-500/[0.02] blur-[50px] pointer-events-none" />

        <div className="p-4 space-y-2 flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 active:scale-[0.98] ${
                  isActive
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    : "border border-transparent text-zinc-400 hover:bg-[#111113] hover:border-white/5 hover:text-zinc-200"
                }`}
              >
                <div
                  className={`transition-colors duration-300 ${
                    isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-emerald-500/70"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[13px] tracking-wide">{item.fullName}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#09090A] relative z-10">
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
              URL Shortener
            </p>
            <p className="text-[9px] text-zinc-700 font-mono">
              v1.0.0
            </p>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#09090A]/90 backdrop-blur-xl border-t border-white/10 z-[100] pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between px-2 py-2 sm:px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-full py-1.5 gap-1 active:scale-95 transition-transform"
              >
                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute -top-2 w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                )}
                
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-emerald-500/15 text-emerald-400 shadow-inner border border-emerald-500/20" 
                      : "text-zinc-500"
                  }`}
                >
                  {item.icon}
                </div>
                <span 
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}