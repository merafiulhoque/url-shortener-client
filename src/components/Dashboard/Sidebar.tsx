"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {PencilIcon, ChartBarIncreasing, Unlink} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname();

  // Define navigation items for easy mapping and future additions
  const navItems = [
    {
      name: "Create New URL",
      href: "/dashboard/create", // Route for your creation form
      icon: <PencilIcon />,
    },
    {
      name: "All URLs",
      href: "/dashboard", // Main dashboard view showing the list
      icon: <Unlink />
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: <ChartBarIncreasing />
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] flex flex-col shrink-0 md:flex">
      {/* Note: h-[calc(100vh-4rem)] assumes your Navbar is 4rem (16 units) tall.
        Adjust the '4rem' if your Navbar height changes.
      */}
      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          // Check if the current route matches the item's href
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {/* Render the icon and apply conditional styling if active */}
              <div className={`${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Optional: Add a subtle footer or pro-tier upsell area at the bottom of the sidebar */}
      <div className="p-4 border-t border-slate-100">
        <p className="text-xs text-center text-slate-400">
          URL Shortener v1.0
        </p>
      </div>
    </aside>
  );
}