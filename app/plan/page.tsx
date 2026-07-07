"use client";

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

const weekDays = [
  { label: "Mon", date: "1 Jul" },
  { label: "Tue", date: "2 Jul" },
  { label: "Wed", date: "3 Jul" },
  { label: "Thu", date: "4 Jul" },
  { label: "Fri", date: "5 Jul" },
  { label: "Sat", date: "6 Jul" },
  { label: "Sun", date: "7 Jul" },
];

const rows = [
  {
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
];

export default function PlanPage() {
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

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="rounded-3xl bg-white px-4 py-4 shadow-sm sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 shadow-sm">
                <FiArrowLeft size={16} />
                <span>Week (1 - 7 July 2024)</span>
                <FiChevronRight size={16} />
              </div>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
                <FiCalendar size={16} /> View Plan
              </button>
            </div>
          </div>
          <div className="hidden items-center justify-between rounded-3xl bg-white px-4 py-4 shadow-sm sm:flex sm:px-6">
            <span className="text-sm font-medium text-slate-700">
              Select Meals to Plan
            </span>
            <button className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-900">
              <FiRefreshCw size={16} /> Reset
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white px-4 py-3 shadow-sm sm:px-6">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Select meal types
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {mealTypes.map((meal) => (
              <button
                key={meal.id}
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
          {rows.map((row) => (
            <div
              key={row.meal}
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
                    key={`${row.meal}-${index}`}
                    className="rounded-3xl bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      <span>Day {index + 1}</span>
                      <span>{weekDays[index]?.label}</span>
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
                {weekDays.map((day) => (
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
              {rows.map((row) => (
                <tr key={row.meal} className="hover:bg-slate-50">
                  <td className="px-4 py-5 align-top">
                    <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                      <span>{row.icon}</span>
                      <span>{row.meal}</span>
                    </div>
                  </td>
                  {row.items.map((item, index) => (
                    <td
                      key={`${row.meal}-${index}`}
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
