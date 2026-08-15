"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiLogOut, FiLogIn } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Drawer from "./Drawer";

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export default function AppHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user: fbUser, dbUser, logout } = useAuth();
  const router = useRouter();

  if (pathname === "/login") return null;

  const handleAuthAction = async () => {
    if (dbUser) {
      await logout();
      router.push("/login");
    } else {
      router.push("/login");
    }
  };

  const greeting = getTimeGreeting();
  const displayName = dbUser?.name ?? "Guest";
  const avatarUrl = fbUser?.photoURL || (dbUser?.name ? `https://api.dicebear.com/6.x/avataaars/svg?seed=${dbUser.name}` : undefined);

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={dbUser ? { name: displayName, avatarUrl: avatarUrl || "" } : null}
        onAuthAction={handleAuthAction}
      />
      <header className="bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-6xl p-1 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                aria-label="menu"
                className="p-2 rounded-2xl bg-white text-slate-800 shadow-sm lg:hidden hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                onClick={() => setDrawerOpen(true)}
              >
                <FiMenu size={20} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Plate Slate Logo" width={64} height={64} className="h-16 w-auto object-contain" />
              </Link>
              <span className="hidden md:inline text-slate-300">|</span>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-700">
                  {greeting}, {displayName}!
                </p>
                <p className="text-[10px] text-slate-400">
                  Socho kam, khao zyada
                </p>
              </div>
            </div>
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              <nav className="text-sm font-medium text-slate-600 flex items-center gap-4">
                <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                <span>·</span>
                <Link href="/plan" className="hover:text-emerald-600 transition-colors">Plans</Link>
                <span>·</span>
                <Link href="/dish" className="hover:text-emerald-600 transition-colors">Recipes</Link>
              </nav>

              <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                {dbUser ? (
                  <div className="flex items-center gap-3">
                    {avatarUrl && (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        width={36}
                        height={36}
                        unoptimized
                        className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-emerald-500/20"
                      />
                    )}
                    <button
                      onClick={handleAuthAction}
                      title="Log out"
                      className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 text-slate-500 shadow-sm border border-slate-200/60 active:scale-95 transition-all cursor-pointer"
                    >
                      <FiLogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthAction}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    <FiLogIn size={14} />
                    <span>Log in</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

