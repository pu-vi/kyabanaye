"use client";

import { useEffect, useRef, useState } from "react";
import type { MealType } from "@prisma/client";
import { FiPlus, FiX, FiSearch } from "react-icons/fi";

export interface Dish {
  id: string;
  name: string;
  category?: string | null;
  suggestedMealTypes?: MealType[];
}

interface PlanCellProps {
  dateStr: string;
  mealType: MealType;
  selectedDishes: Dish[];
  allDishes: Dish[];
  onAddDish: (dish: Dish) => void;
  onRemoveDish: (dishId: string) => void;
}

export default function PlanCell({
  selectedDishes = [],
  allDishes = [],
  onAddDish,
  onRemoveDish,
}: PlanCellProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSearching(false);
        setSearchQuery("");
      }
    }
    if (isSearching) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearching]);

  // Focus input when search mode is activated
  useEffect(() => {
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearching]);

  // Filter matching dishes based on search query
  const matches = searchQuery.trim().length >= 3
    ? allDishes.filter((dish) =>
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectDish = (dish: Dish) => {
    // Avoid duplicates in the same cell
    if (!selectedDishes.some((d) => d.id === dish.id)) {
      onAddDish(dish);
    }
    setIsSearching(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsSearching(false);
      setSearchQuery("");
    } else if (e.key === "Enter" && matches.length > 0) {
      handleSelectDish(matches[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative min-w-[140px] p-1">
      {/* List of selected dishes */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {selectedDishes.map((dish) => (
          <span
            key={dish.id}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-800 transition"
          >
            <span className="truncate max-w-[120px]">{dish.name}</span>
            <button
              onClick={() => onRemoveDish(dish.id)}
              className="text-slate-400 hover:text-red-600 transition-colors p-0.5 rounded-full cursor-pointer"
              title="Remove dish"
            >
              <FiX size={10} />
            </button>
          </span>
        ))}

        {/* Action Button: Show Input or + Add Button */}
        {!isSearching ? (
          <button
            onClick={() => setIsSearching(true)}
            className={`inline-flex items-center justify-center transition-all cursor-pointer ${
              selectedDishes.length === 0
                ? "w-full border border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 text-slate-400 py-1.5 rounded-xl text-xs gap-1 font-medium"
                : "h-6 w-6 rounded-full border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400"
            }`}
            title={selectedDishes.length === 0 ? "Add meal" : "Add another dish"}
          >
            <FiPlus size={selectedDishes.length === 0 ? 12 : 14} />
            {selectedDishes.length === 0 && <span>Add Meal</span>}
          </button>
        ) : (
          <div className="relative flex items-center w-full min-w-[150px] rounded-xl border border-emerald-500 bg-white px-2 py-1 shadow-sm">
            <FiSearch size={12} className="text-slate-400 mr-1 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full text-xs text-slate-800 bg-transparent outline-none border-none p-0 placeholder-slate-400"
            />
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
              className="text-slate-400 hover:text-slate-600 transition p-0.5 cursor-pointer flex-shrink-0"
            >
              <FiX size={12} />
            </button>

            {/* Typeahead Dropdown */}
            {searchQuery.trim().length >= 3 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                {matches.length > 0 ? (
                  matches.map((dish) => (
                    <button
                      key={dish.id}
                      onClick={() => handleSelectDish(dish)}
                      className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition cursor-pointer"
                    >
                      <div className="font-medium truncate">{dish.name}</div>
                      {dish.category && (
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          {dish.category.replace("_", "-")}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-center text-xs text-slate-400">
                    No matching dishes
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
