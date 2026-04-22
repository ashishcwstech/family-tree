"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", icon: "dashboard", href: "/family/dashboard" },
  { name: "Family Tree", icon: "account_tree", href: "/family/family-tree" },
  { name: "Timeline", icon: "timeline", href: "/family/timeline" },
  { name: "Photos", icon: "photo_library", href: "/family/photos" },
  { name: "Activity", icon: "history", href: "/family/activity" },
  { name: "Settings", icon: "settings", href: "/family/settings" },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {

  const pathname = usePathname();

  return (
    <aside
  className={`
    fixed left-0 top-16 h-[calc(100vh-64px)]
    bg-slate-50 dark:bg-slate-950 flex flex-col py-6 px-2 z-40
    transition-all duration-300 ease-in-out

    ${isOpen ? "translate-x-0" : "-translate-x-full"}   // 👈 mobile hide

    md:translate-x-0                                   // 👈 always visible on desktop
    ${isOpen ? "md:w-64" : "md:w-20"}                  // 👈 desktop collapse
    w-64                                               // 👈 mobile full width
  `}
>
      {/* BRAND */}
      <div className="mb-6 px-3">
        <h2
          className={`text-lg font-black text-slate-900 dark:text-slate-100 transition-all duration-200 ${
            isOpen ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          The Living Archive
        </h2>
        <p
          className={`text-xs uppercase opacity-60 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          Premium Genealogy
        </p>
      </div>

    
      <nav className="flex-1 space-y-1" aria-label="Sidebar Navigation">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={!isOpen ? item.name : ""}
   
              className={`flex items-center gap-3 px-3 py-3  rounded-xl transition-all duration-200
                ${isOpen ? "justify-start" : "justify-center"}
                ${
                  active
                    ? "text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
            >
              <span className="material-symbols-outlined text-xl">
                {item.icon}
              </span>

              {/* LABEL */}
              <span
                className={`whitespace-nowrap transition-all duration-200 ${
                  isOpen ? "opacity-100 ml-1" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto">
        <Link
          href="/help"
          title={!isOpen ? "Help Center" : ""}
          className={`flex items-center gap-3 px-3 py-2 transition-all
            ${isOpen ? "justify-start" : "justify-center"}
            text-slate-500 hover:text-slate-900`}
        >
          <span className="material-symbols-outlined">help</span>

          <span
            className={`transition-all ${
              isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Help Center
          </span>
        </Link>
      </div>
    </aside>
  );
}