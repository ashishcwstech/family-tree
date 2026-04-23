import Image from "next/image";
import { useState } from "react";
import AddMemberModal from "@/components/models/AddMemberModal";

export default function Header({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <nav className="sticky  top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm h-16 flex justify-between items-center px-6">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleSidebar}
            aria-label="Open menu"
            className=" p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              menu
            </span>
          </button>

          <h1 className="text-xl font-bold text-indigo-600">
            MOM
          </h1>

          {/* Search */}
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              aria-label="Search ancestors"
              placeholder="Search..."
              className="bg-surface-container-low border-none rounded-full py-1.5 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white"
          >
            Add Member
          </button>

          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full"
          >
            <span className="material-symbols-outlined">notifications</span>

            {/* dynamic badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <Image
            src="/images/profile.png"
            alt="User profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </nav>
      {/* ✅ Modal */}
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
    </>
  );
}
