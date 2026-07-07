"use client";

import Image from "next/image";
import { FiMenu, FiChevronLeft, FiChevronRight, FiUser } from "react-icons/fi";

export default function Home() {
  const days = [
    { short: "Fri", date: 4 },
    { short: "Sat", date: 5 },
    { short: "Sun", date: 6, active: true },
    { short: "Mon", date: 7 },
    { short: "Tue", date: 8 },
  ];

  const meals = [
    {
      title: "Breakfast",
      time: "8:00 AM",
      titleSecondary: "Oats Upma",
      description: "with Veggies & Peanuts",
      image: "/dish-placeholder.jpg",
      iconBg: "bg-amber-100",
    },
    {
      title: "Mid-Morning Snack",
      time: "11:00 AM",
      titleSecondary: "Apple",
      description: "with Almonds (5)",
      image: "/dish-placeholder-2.jpg",
      iconBg: "bg-sky-100",
    },
    {
      title: "Lunch",
      time: "1:30 PM",
      titleSecondary: "Brown Rice, Dal Tadka",
      description: "Bhindi Sabzi, Cucumber Salad",
      image: "/dish-placeholder-3.jpg",
      iconBg: "bg-emerald-100",
    },
    {
      title: "Evening Snack",
      time: "5:00 PM",
      titleSecondary: "Green Tea",
      description: "with Roasted Makhana",
      image: "/dish-placeholder.jpg",
      iconBg: "bg-violet-100",
    },
    {
      title: "Dinner",
      time: "8:00 PM",
      titleSecondary: "Moong Dal Chilla",
      description: "with Mint Chutney & Salad",
      image: "/dish-placeholder-2.jpg",
      iconBg: "bg-pink-100",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button aria-label="menu" className="p-2 lg:hidden">
              <FiMenu size={20} />
            </button>
            <div className="text-left">
              <p className="text-sm text-slate-600">Good morning, Pooja! <span className="ml-1">🌞</span></p>
              <p className="text-xs text-slate-400">Let's make today healthy & amazing</p>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            <nav className="text-sm text-slate-600">Home · Plans · Recipes</nav>
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow">
              <FiUser />
            </div>
          </div>
        </header>

        <div className="mt-6 lg:flex lg:gap-8">
          <div className="lg:w-2/3">
            <section>
              <div className="flex items-center gap-3 overflow-x-auto pb-3">
                <button className="p-2 rounded-md bg-white/60 shadow"><FiChevronLeft /></button>
                {days.map((d) => (
                  <div key={d.date} className={`flex-shrink-0 w-16 text-center p-2 rounded-xl ${d.active ? 'bg-emerald-600 text-white' : 'bg-white'}`}>
                    <div className="text-xs">{d.short}</div>
                    <div className="text-lg font-semibold">{d.date}</div>
                    <div className="text-[10px]">Jul</div>
                  </div>
                ))}
                <button className="p-2 rounded-md bg-white/60 shadow"><FiChevronRight /></button>
              </div>
            </section>

            <main className="mt-4 space-y-4 pb-32">
              {meals.map((m) => (
                <article key={m.title} className="flex items-center justify-between bg-white rounded-xl p-3 shadow">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${m.iconBg} w-12 h-12`}></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold">{m.title}</h3>
                      </div>
                      <p className="text-sm text-emerald-600">{m.time}</p>
                      <p className="text-sm font-medium">{m.titleSecondary}</p>
                      <p className="text-xs text-slate-500">{m.description}</p>
                    </div>
                  </div>
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={m.image} alt="dish" width={80} height={80} className="object-cover" />
                  </div>
                </article>
              ))}
            </main>
          </div>

          <aside className="mt-6 lg:mt-0 lg:w-1/3">
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl p-6 shadow">
                <h4 className="text-sm text-slate-500">Viewing plan</h4>
                <p className="mt-1 text-xl font-semibold">My Meal Plan</p>
                <p className="mt-4 text-sm text-slate-600">Default Meal Plan (Admin)</p>
                <div className="mt-6 flex justify-between">
                  <button className="px-4 py-2 border border-emerald-500 text-emerald-700 rounded-lg">View & Edit</button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Use Plan</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
