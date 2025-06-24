import React from "react";
import { useUnit } from "effector-react";
import {
  $brandFilter,
  $pliesFilter,
  setBrandFilter,
  setPliesFilter,
  clearFilters,
} from "../store";
import { Brand, PlyMaterial } from "../types";

// Get all brands directly from the enum
const allBrands = Object.values(Brand).sort();
const allPlies = Object.values(PlyMaterial).sort();

export const FilterPanel: React.FC = () => {
  const [brandFilter, pliesFilter] = useUnit([$brandFilter, $pliesFilter]);

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setBrandFilter(value === "" ? null : (value as Brand));
  };

  const handlePliesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as PlyMaterial;
    setPliesFilter(value);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const hasActiveFilters = brandFilter !== null || pliesFilter !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="brand-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter by Brand
          </label>
          <select
            id="brand-filter"
            value={brandFilter || ""}
            onChange={handleBrandChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blade-primary focus:border-transparent"
          >
            <option value="">All Brands</option>
            {allBrands.map((brand: Brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="plies-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter by Number of Plies
          </label>
          <select
            id="plies-filter"
            value={pliesFilter || ""}
            onChange={handlePliesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blade-primary focus:border-transparent"
          >
            <option value="">All Plies</option>
            {allPlies.map((ply) => (
              <option key={ply} value={ply}>
                {ply}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex-shrink-0">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {brandFilter && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blade-primary text-white">
                Brand: {brandFilter}
                <button
                  onClick={() => setBrandFilter(null)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  ×
                </button>
              </span>
            )}
            {pliesFilter && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blade-secondary text-white">
                Plies: {pliesFilter}
                <button
                  onClick={() => setPliesFilter(null)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
