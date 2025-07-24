import React from "react";
import { useUnit } from "effector-react";
import { ActiveFilterTag } from "./ActiveFilterTag";
import { clearFilters, $activeFilters, $hasActiveFilters } from "../../store";

export const ActiveFilterList: React.FC = () => {
  const [activeFilters, hasActiveFilters] = useUnit([
    $activeFilters,
    $hasActiveFilters,
  ]);

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {activeFilters.map((filter) => (
            <ActiveFilterTag
              key={filter.key}
              label={filter.label}
              onRemove={filter.onRemove}
              bgColor={filter.bgColor}
            />
          ))}
        </div>

        <div className="flex-shrink-0 ml-auto">
          <button
            onClick={() => clearFilters()}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};
