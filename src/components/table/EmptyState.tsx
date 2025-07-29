import React from "react";
import { clearFilters } from "../../store";

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        <div className="mb-6"></div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          The applied filters didn't return any results. Try changing or
          clearing the filters to find other blades.
        </p>

        <button
          onClick={() => clearFilters()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear all filters
        </button>
      </div>
    </div>
  );
};
