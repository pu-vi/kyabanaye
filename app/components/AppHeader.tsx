"use client";

import { useState } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import Drawer from "./Drawer";

export default function AppHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <header className="bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                aria-label="menu"
                className="p-2 rounded-2xl bg-white text-slate-800 shadow-sm lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <FiMenu size={20} />
              </button>
              <div className="text-left">
                <p className="text-sm text-slate-600">
                  Good morning, Pooja! <span className="ml-1">🌞</span>
                </p>
                <p className="text-xs text-slate-400">
                  Let's make today healthy & amazing
                </p>
              </div>
            </div>
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              <nav className="text-sm text-slate-600">
                Home · Plans · Recipes
              </nav>
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow">
                <FiUser />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
