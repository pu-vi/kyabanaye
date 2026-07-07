"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCalendar, FiGrid, FiBookOpen, FiList } from "react-icons/fi";

const links = [
  { href: "/plan/today", label: "Today", icon: FiCalendar },
  { href: "/plan", label: "Weekly", icon: FiGrid },
  { href: "/menu", label: "My Menu", icon: FiBookOpen },
  { href: "/dish", label: "Dishes", icon: FiList },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex lg:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs transition-colors ${
              active ? "text-emerald-600" : "text-slate-500"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
