"use client";

import { useState } from "react";
import type { MealType } from "@prisma/client";
import {
  FiArrowLeft,
  FiCalendar,
  FiChevronRight,
  FiCheckCircle,
  FiRefreshCw,
  FiSave,
} from "react-icons/fi";

const mealTypes: Array<{
  id: MealType;
  label: string;
  checked: boolean;
}> = [
    { id: "MORNING_DRINK", label: "Morning Drink", checked: false },
    { id: "MORNING_SNACK", label: "Morning Snack", checked: false },
    { id: "BREAKFAST", label: "Breakfast", checked: true },
    { id: "BRUNCH", label: "Brunch", checked: false },
    { id: "AFTERNOON_SNACK", label: "Afternoon Snack", checked: false },
    { id: "LUNCH", label: "Lunch", checked: true },
    { id: "EVENING_SNACK", label: "Evening Snack", checked: true },
    { id: "DINNER", label: "Dinner", checked: true },
    { id: "DESSERT", label: "Dessert", checked: false },
    { id: "DRINK", label: "Drink", checked: false },
  ];
const getWeekLabel = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  const startMonth = startDate.toLocaleString("default", { month: "long" });
  const endMonth = endDate.toLocaleString("default", { month: "long" });

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  if (startYear !== endYear) {
    return `Week (${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear})`;
  }
  if (startMonth !== endMonth) {
    return `Week (${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear})`;
  }
  return `Week (${startDay} - ${endDay} ${startMonth} ${startYear})`;
};

const getWeekDays = (startDate: Date) => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels.map((label, index) => {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + index);
    return {
      label,
      date: `${dayDate.getDate()} ${dayDate.toLocaleString("default", { month: "short" })}`,
    };
  });
};

const allMealRows = [
  {
    id: "MORNING_DRINK" as MealType,
    meal: "Morning Drink",
    icon: "🥛",
    items: [
      "Lemon Honey Water",
      "Jeera Water",
      "Warm Water",
      "Ginger Tea",
      "Lemon Honey Water",
      "Jeera Water",
      "Warm Water",
    ],
  },
  {
    id: "MORNING_SNACK" as MealType,
    meal: "Morning Snack",
    icon: "🍎",
    items: [
      "Mixed Nuts",
      "Sprouts Salad",
      "Fruit Bowl",
      "Roasted Makhana",
      "Boiled Egg",
      "Mixed Nuts",
      "Fruit Bowl",
    ],
  },
  {
    id: "BREAKFAST" as MealType,
    meal: "Breakfast",
    icon: "☀️",
    items: [
      "Oats Upma with Veggies",
      "Moong Dal Chilla",
      "Poha with Peanuts",
      "Vegetable Paratha",
      "Idli & Sambar",
      "Besan Chilla with Mint Chutney",
      "Upma with Coconut Chutney",
    ],
  },
  {
    id: "BRUNCH" as MealType,
    meal: "Brunch",
    icon: "🥞",
    items: [
      "Vegetable Sandwich",
      "Masala Omelette",
      "Poha",
      "Chole Bhature",
      "Misal Pav",
      "Vegetable Sandwich",
      "Masala Omelette",
    ],
  },
  {
    id: "AFTERNOON_SNACK" as MealType,
    meal: "Afternoon Snack",
    icon: "🍌",
    items: [
      "Fruit Bowl",
      "Sprouts Salad",
      "Mixed Nuts",
      "Fruit Bowl",
      "Sprouts Salad",
      "Mixed Nuts",
      "Roasted Makhana",
    ],
  },
  {
    id: "LUNCH" as MealType,
    meal: "Lunch",
    icon: "☀️",
    items: [
      "Brown Rice, Dal Tadka, Bhindi Sabzi, Salad",
      "Quinoa Pulao, Rajma, Cucumber Raita",
      "Jeera Rice, Mix Veg, Dal Fry, Salad",
      "Millet Khichdi, Kadhi, Cucumber Salad",
      "Veg Biryani, Raita, Salad",
      "Brown Rice, Chole, Gajar Sabzi, Salad",
      "Lemon Rice, Sambar, Beans Poriyal, Salad",
    ],
  },
  {
    id: "EVENING_SNACK" as MealType,
    meal: "Evening Snack",
    icon: "☕",
    items: [
      "Green Tea & Almonds",
      "Buttermilk & Roasted Chana",
      "Fruit Bowl",
      "Green Tea & Walnuts",
      "Buttermilk & Makhana",
      "Lemon Water & Pumpkin Seeds",
      "Coconut Water & Almonds",
    ],
  },
  {
    id: "DINNER" as MealType,
    meal: "Dinner",
    icon: "🌙",
    items: [
      "Moong Dal Chilla, Salad, Mint Chutney",
      "Mix Veg Soup, Grilled Paneer, Salad",
      "Lauki Chana Dal, Phulka, Salad",
      "Vegetable Soup, Moong Dal, Paneer Tikki",
      "Grilled Veg, Dal Soup, Salad",
      "Oats Khichdi, Curd, Salad",
      "Palak Paneer, Phulka, Salad",
    ],
  },
  {
    id: "DESSERT" as MealType,
    meal: "Dessert",
    icon: "🍰",
    items: [
      "Gulab Jamun",
      "Jalebi",
      "Rasgulla",
      "Kheer",
      "Gulab Jamun",
      "Jalebi",
      "Rasgulla",
    ],
  },
  {
    id: "DRINK" as MealType,
    meal: "Drink",
    icon: "🍹",
    items: [
      "Lassi",
      "Mango Lassi",
      "Lemonade",
      "Coconut Water",
      "Lassi",
      "Mango Lassi",
      "Coconut Water",
    ],
  },
];

export default function PlanPage() {
  const [activeMealTypes, setActiveMealTypes] = useState(mealTypes);
  const [weekStart, setWeekStart] = useState<Date>(() => new Date(2024, 6, 1)); // 1 July 2024

  const toggleMealType = (id: MealType) => {
    setActiveMealTypes((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, checked: !meal.checked } : meal
      )
    );
  };

  const resetMealTypes = () => {
    setActiveMealTypes(mealTypes);
  };

  const handlePrevWeek = () => {
    setWeekStart((prev) => {
      const nextDate = new Date(prev);
      nextDate.setDate(prev.getDate() - 7);
      return nextDate;
    });
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => {
      const nextDate = new Date(prev);
      nextDate.setDate(prev.getDate() + 7);
      return nextDate;
    });
  };

  const currentWeekDays = getWeekDays(weekStart);

  const visibleRows = allMealRows.filter((row) => {
    const mealTypeObj = activeMealTypes.find((m) => m.id === row.id);
    return mealTypeObj ? mealTypeObj.checked : false;
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between gap-4 rounded-3xl bg-white px-4 py-4 shadow-sm sm:px-6">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-200">
            <FiArrowLeft size={16} /> Back
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Meal Planning
            </h1>
            <p className="text-sm text-slate-500">
              Plan your week. Eat healthy, stay happy!
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            <FiSave size={16} /> Save
          </button>
        </div>

        {/* Week Nav */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="rounded-3xl bg-white px-4 py-4 shadow-sm sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handlePrevWeek}
                  className="inline-flex items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 transition text-slate-600 shadow-sm cursor-pointer"
                  title="Previous Week"
                >
                  <FiArrowLeft size={16} />
                </button>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <span>{getWeekLabel(weekStart)}</span>
                </div>
                <button
                  onClick={handleNextWeek}
                  className="inline-flex items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 transition text-slate-600 shadow-sm cursor-pointer"
                  title="Next Week"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white px-4 py-3 shadow-sm sm:px-6">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Select meal types
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeMealTypes.map((meal) => (
              <button
                key={meal.id}
                onClick={() => toggleMealType(meal.id)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${meal.checked ? "border-emerald-500 bg-emerald-50 text-slate-900 shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
              >
                <span>{meal.label}</span>
                {meal.checked && (
                  <FiCheckCircle size={12} className="text-emerald-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-4 sm:hidden">
          {visibleRows.map((row) => (
            <div
              key={row.id}
              className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                  <span>{row.icon}</span>
                  <span>{row.meal}</span>
                </div>
                <span className="text-xs text-slate-500">7 days</span>
              </div>
              <div className="mt-4 space-y-3">
                {row.items.map((item, index) => (
                  <div
                    key={`${row.id}-${index}`}
                    className="rounded-3xl bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      <span>Day {index + 1}</span>
                      <span>{currentWeekDays[index]?.label}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-sm sm:block">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-slate-100 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Meals \ Days</th>
                {currentWeekDays.map((day) => (
                  <th
                    key={day.label}
                    className="border-l border-slate-200 px-4 py-4"
                  >
                    <div className="text-sm font-semibold text-slate-900">
                      {day.label}
                    </div>
                    <div className="text-xs text-slate-500">{day.date}</div>
                  </th>
                ))}
                <th className="border-l border-slate-200 px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visibleRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-4 py-5 align-top">
                    <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                      <span>{row.icon}</span>
                      <span>{row.meal}</span>
                    </div>
                  </td>
                  {row.items.map((item, index) => (
                    <td
                      key={`${row.id}-${index}`}
                      className="border-l border-slate-200 px-4 py-5 align-top text-sm text-slate-700"
                    >
                      {item}
                    </td>
                  ))}
                  <td className="border-l border-slate-200 px-4 py-5 align-top text-right text-slate-400">
                    ···
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 shadow-sm sm:px-6">
          <div className="flex items-center gap-3 font-medium text-emerald-700">
            <span className="rounded-full bg-emerald-100 px-2 py-1">i</span>
            Tap on any cell to add or edit your meal. Long press and drag rows
            to reorder meals.
          </div>
        </div>
      </div>
    </div>
  );
}
