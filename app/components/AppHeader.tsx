"use client";

import { useEffect, useState } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import Drawer from "./Drawer";

type User = {
  name: string;
  avatarUrl: string;
};

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export default function AppHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("kyabana-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem("kyabana-user");
      }
    }
  }, []);

  const handleAuthAction = () => {
    if (user) {
      setUser(null);
      window.localStorage.removeItem("kyabana-user");
      return;
    }

    const demoUser: User = {
      name: "Pooja",
      avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Pooja",
    };

    setUser(demoUser);
    window.localStorage.setItem("kyabana-user", JSON.stringify(demoUser));
  };

  const greeting = getTimeGreeting();
  const displayName = user?.name ?? "Guest";

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onAuthAction={handleAuthAction}
      />
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
                  {greeting}, {displayName}!
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
              {user ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow">
                  <FiUser />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
