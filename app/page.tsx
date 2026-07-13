"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiCalendar, FiArrowRight, FiBookOpen } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import type { MealType } from "@prisma/client";
import BottomNav from "./components/BottomNav";

const toISODateString = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const allMealMetadata: Record<
  MealType,
  { title: string; time: string; icon: string; iconBg: string }
> = {
  MORNING_DRINK: { title: "Morning Drink", time: "7:00 AM", icon: "🥛", iconBg: "bg-blue-100 text-blue-700" },
  MORNING_SNACK: { title: "Morning Snack", time: "10:30 AM", icon: "🍎", iconBg: "bg-rose-100 text-rose-700" },
  BREAKFAST: { title: "Breakfast", time: "8:30 AM", icon: "☀️", iconBg: "bg-amber-100 text-amber-700" },
  BRUNCH: { title: "Brunch", time: "11:30 AM", icon: "🥞", iconBg: "bg-orange-100 text-orange-700" },
  AFTERNOON_SNACK: { title: "Afternoon Snack", time: "4:00 PM", icon: "🍌", iconBg: "bg-yellow-100 text-yellow-700" },
  LUNCH: { title: "Lunch", time: "1:30 PM", icon: "☀️", iconBg: "bg-emerald-100 text-emerald-700" },
  EVENING_SNACK: { title: "Evening Snack", time: "5:30 PM", icon: "☕", iconBg: "bg-violet-100 text-violet-700" },
  DINNER: { title: "Dinner", time: "8:30 PM", icon: "🌙", iconBg: "bg-pink-100 text-pink-700" },
  DESSERT: { title: "Dessert", time: "9:30 PM", icon: "🍰", iconBg: "bg-red-100 text-red-700" },
  DRINK: { title: "Drink", time: "10:00 PM", icon: "🍹", iconBg: "bg-teal-100 text-teal-700" },
};

const chronologicalOrder: MealType[] = [
  "MORNING_DRINK",
  "MORNING_SNACK",
  "BREAKFAST",
  "BRUNCH",
  "LUNCH",
  "AFTERNOON_SNACK",
  "EVENING_SNACK",
  "DINNER",
  "DESSERT",
  "DRINK",
];

export default function Home() {
  const { dbUser, loading } = useAuth();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [dayPlan, setDayPlan] = useState<Record<string, string[]>>({});
  const [fetchingPlan, setFetchingPlan] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !dbUser) {
      router.push("/login");
    }
  }, [dbUser, loading, router]);

  // Fetch plan for the selected single date
  useEffect(() => {
    const fetchPlan = async () => {
      if (!dbUser?.id) return;
      setFetchingPlan(true);

      const dateStr = toISODateString(selectedDate);
      try {
        const res = await fetch(`/api/mealplans?userId=${dbUser.id}&startDate=${dateStr}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setDayPlan(data[0].meals || {});
          } else {
            setDayPlan({});
          }
        }
      } catch (e) {
        console.error("Failed to load daily plan:", e);
      } finally {
        setFetchingPlan(false);
      }
    };

    if (!loading && dbUser) {
      fetchPlan();
    }
  }, [selectedDate, dbUser, loading]);

  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 1);
      return d;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 1);
      return d;
    });
  };

  // Generate 5 days starting from the selected date
  const getVisibleDays = (startDate: Date) => {
    const daysList = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      daysList.push(d);
    }
    return daysList;
  };

  const visibleDays = getVisibleDays(selectedDate);

  // Compile list of meals to display
  const getMealsToDisplay = () => {
    const list: Array<{
      id: MealType;
      title: string;
      time: string;
      icon: string;
      iconBg: string;
      dishes: string[];
    }> = [];

    chronologicalOrder.forEach((mealId) => {
      const dishes = dayPlan[mealId] || [];
      const isCore =
        mealId === "BREAKFAST" ||
        mealId === "LUNCH" ||
        mealId === "EVENING_SNACK" ||
        mealId === "DINNER";

      if (isCore || dishes.length > 0) {
        const meta = allMealMetadata[mealId];
        list.push({
          id: mealId,
          ...meta,
          dishes,
        });
      }
    });

    return list;
  };

  const displayMeals = getMealsToDisplay();

  const formattedSelectedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!dbUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 text-slate-900 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mt-4 lg:flex lg:gap-8">
          {/* Main Daily Plan Section */}
          <div className="lg:w-2/3 space-y-6">

            {/* Infinite Date Slider */}
            <section className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handlePrevDay}
                  className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-600 border border-slate-200 transition-all cursor-pointer"
                  title="Previous Day"
                >
                  <FiChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {visibleDays.map((d) => {
                    const isActive = toISODateString(d) === toISODateString(selectedDate);
                    const isToday = toISODateString(d) === toISODateString(new Date());
                    const dayNum = d.getDate();
                    const dayShort = d.toLocaleString("default", { weekday: "short" });
                    const monthShort = d.toLocaleString("default", { month: "short" });

                    return (
                      <button
                        key={d.getTime()}
                        onClick={() => setSelectedDate(d)}
                        className={`flex-shrink-0 w-16 text-center py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${isActive
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md scale-105"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                      >
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-85">
                          {dayShort}
                        </div>
                        <div className="text-lg font-black leading-tight my-0.5">
                          {dayNum}
                        </div>
                        <div className="text-[9px] font-semibold opacity-85">
                          {monthShort}
                        </div>
                        {isToday && !isActive && (
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mx-auto mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextDay}
                  className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-600 border border-slate-200 transition-all cursor-pointer"
                  title="Next Day"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </section>

            {/* Meals Display Area */}
            <main className="space-y-4">
              {fetchingPlan ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">Loading daily plan...</p>
                </div>
              ) : (
                displayMeals.map((meal) => {
                  const hasDishes = meal.dishes.length > 0;
                  return (
                    <article
                      key={meal.id}
                      className="flex items-start justify-between bg-white rounded-3xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md"
                    >
                      <div className="flex gap-4">
                        <div
                          className={`flex items-center justify-center p-3 rounded-2xl ${meal.iconBg} w-12 h-12 text-xl font-bold flex-shrink-0`}
                        >
                          {meal.icon}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                              {meal.title}
                            </h3>
                          </div>

                          {hasDishes ? (
                            <div className="space-y-1.5">
                              <p className="text-base font-black text-slate-800">
                                {meal.dishes[0]}
                              </p>
                              {meal.dishes.length > 1 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {meal.dishes.slice(1).map((dish, i) => (
                                    <span
                                      key={`${dish}-${i}`}
                                      className="inline-flex items-center rounded-xl bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200"
                                    >
                                      {dish}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-400 italic">
                              No meals planned for this slot
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                          {meal.time}
                        </span>
                      </div>
                    </article>
                  );
                })
              )}
            </main>
          </div>

        </div>
      </div>
      <BottomNav />
    </div>
  );
}
