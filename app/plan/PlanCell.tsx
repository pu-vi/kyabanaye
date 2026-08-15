"use client";

import { useEffect, useRef, useState } from "react";
import type { MealType } from "@prisma/client";
import { FiPlus, FiX, FiSearch } from "react-icons/fi";

export interface DishSuggestion {
  id: string;
  name: string;
  category?: string | null;
}

interface PlanCellProps {
  dateStr: string;
  mealType: MealType;
  selectedDishes: string[];
  allDishes: DishSuggestion[];
  onAddDish: (name: string) => void;
  onRemoveDish: (name: string) => void;
  readOnly?: boolean;
}

export default function PlanCell({
  selectedDishes = [],
  allDishes = [],
  onAddDish,
  onRemoveDish,
  readOnly = false,
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

  const handleSelectDishName = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !selectedDishes.includes(trimmed)) {
      onAddDish(trimmed);
    }
    setIsSearching(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsSearching(false);
      setSearchQuery("");
    } else if (e.key === "Enter") {
      if (matches.length > 0) {
        handleSelectDishName(matches[0].name);
      } else if (searchQuery.trim().length > 0) {
        handleSelectDishName(searchQuery);
      }
    }
  };

  const showAddCustom = searchQuery.trim().length > 0 &&
    !matches.some((m) => m.name.toLowerCase() === searchQuery.trim().toLowerCase());

  return (
    <div ref={containerRef} className="relative min-w-[140px] p-1">
      {/* List of selected dishes */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {selectedDishes.map((dishName) => (
          <span
            key={dishName}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-800 transition"
          >
            <span className="truncate max-w-[120px]">{dishName}</span>
            {!readOnly && (
              <button
                onClick={() => onRemoveDish(dishName)}
                className="text-slate-400 hover:text-red-600 transition-colors p-0.5 rounded-full cursor-pointer flex items-center justify-center"
                title="Remove"
              >
                <FiX size={10} />
              </button>
            )}
          </span>
        ))}

        {/* Empty state for readOnly when no dishes are selected */}
        {readOnly && selectedDishes.length === 0 && (
          <span className="text-xs text-slate-400 italic py-0.5 px-1">—</span>
        )}

        {/* Action Button: Show Input or + Add Button */}
        {!readOnly && (
          !isSearching ? (
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
                placeholder="Search or type..."
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
              {(searchQuery.trim().length >= 3 || showAddCustom) && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                  {searchQuery.trim().length >= 3 && matches.length > 0 && (
                    <div className="border-b border-slate-50 pb-1">
                      {matches.map((dish) => (
                        <button
                          key={dish.id}
                          onClick={() => handleSelectDishName(dish.name)}
                          className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition cursor-pointer"
                        >
                          <div className="font-medium truncate">{dish.name}</div>
                          {dish.category && (
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              {dish.category.replace("_", "-")}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {showAddCustom && (
                    <button
                      onClick={() => handleSelectDishName(searchQuery)}
                      className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 hover:text-emerald-950 transition cursor-pointer font-semibold"
                    >
                      + Add: "{searchQuery.trim()}"
                    </button>
                  )}

                  {searchQuery.trim().length >= 3 && matches.length === 0 && !showAddCustom && (
                    <div className="px-3 py-2 text-center text-xs text-slate-400">
                      No matching dishes
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
