"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiX, FiCalendar, FiGrid, FiList } from "react-icons/fi";

const links = [
  { href: "/", label: "Today's Plan", icon: FiCalendar },
  { href: "/plan", label: "Weekly Plan", icon: FiGrid },
  { href: "/dish", label: "Dishes", icon: FiList },
];

export default function Drawer({
  open,
  onClose,
  user,
  onAuthAction,
}: {
  open: boolean;
  onClose: () => void;
  user: { name: string; avatarUrl: string } | null;
  onAuthAction: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col border-b border-slate-100 px-5 py-4 gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Plate Slate Logo" className="h-16 w-auto object-contain" />
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <FiX size={22} />
            </button>
          </div>
          {user && (
            <div className="flex items-center gap-3 mt-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-emerald-500/20"
                />
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Logged in</p>
              </div>
            </div>
          )}
        </div>

        <nav className="flex flex-col mt-4 px-3 gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100 px-4 py-4">
          <button
            onClick={onAuthAction}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer active:scale-[0.98]"
          >
            {user ? "Log out" : "Log in"}
          </button>
        </div>
      </aside>
    </>
  );
}
