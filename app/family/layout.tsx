"use client";

import { useState } from "react";
import Header from "@/components/layout/family/Header";
import Sidebar from "@/components/layout/family/Sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header FULL WIDTH */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`
            relative h-screen
            transition-all duration-300 ease-in-out
            ${isOpen ? "w-64" : "w-16"}
          `}
        >
          <Sidebar isOpen={isOpen} />
        </div>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
