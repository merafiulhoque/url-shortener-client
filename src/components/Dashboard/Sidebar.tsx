"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PencilIcon, ChartBarIncreasing, Unlink } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // Define navigation items for easy mapping and future additions
  const navItems = [
    {
      name: "Create New URL",
      href: "/dashboard/create",
      icon: <PencilIcon className="w-5 h-5" />,
    },
    {
      name: "All URLs",
      href: "/dashboard",
      icon: <Unlink className="w-5 h-5" />,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: <ChartBarIncreasing className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-zinc-950/80 backdrop-blur-md border-r border-zinc-800 h-[calc(100vh-4rem)] flex flex-col shrink-0 hidden md:flex">
      {/* Note: h-[calc(100vh-4rem)] assumes your Navbar is 4rem (16 units) tall. */}
      
      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          // Check if the current route matches the item's href
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 shadow-sm shadow-indigo-500/5"
                  : "border border-transparent text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
              }`}
            >
              {/* Render the icon and apply conditional styling if active */}
              <div
                className={`transition-colors duration-300 ${
                  isActive ? "text-indigo-400" : "text-zinc-500"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer / Pro-tier upsell area */}
      <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/50">
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
            URL Shortener
          </p>
          <p className="text-[10px] text-zinc-700">
            v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}