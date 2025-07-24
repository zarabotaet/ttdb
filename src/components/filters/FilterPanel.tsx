import React from "react";
import { useUnit } from "effector-react";
import {
  $brandFilter,
  $pliesFilter,
  $pliesNumberFilter,
  setBrandFilter,
  setPliesFilter,
  setPliesNumberFilter,
  $blades,
} from "../../store";
import { Brand, PlyMaterial } from "../../types";
import { LayerFilter } from "./LayerFilter";
import { ActiveFilterList } from "./ActiveFilterList";

// Get all brands directly from the enum
const allBrands = Object.values(Brand).sort();
const allPlies = Object.values(PlyMaterial).sort();

export const FilterPanel: React.FC = () => {
  const [brandFilter, pliesFilter, pliesNumberFilter, blades] = useUnit([
    $brandFilter,
    $pliesFilter,
    $pliesNumberFilter,
    $blades,
  ]);

  // Get unique plies numbers from the actual data
  const availablePliesNumbers = React.useMemo(() => {
    const pliesNumbers = blades.map((blade) => blade.pliesNumber);
    return [...new Set(pliesNumbers)].sort((a, b) => a - b);
  }, [blades]);

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setBrandFilter(value === "" ? null : (value as Brand));
  };

  const handlePliesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as PlyMaterial;
    setPliesFilter(value);
  };

  const handlePliesNumberChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const newPliesNumber = value === "" ? null : parseInt(value, 10);

    setPliesNumberFilter(newPliesNumber);

    // Если выбрано количество слоев, очищаем фильтр по материалу, так как теперь используется сложный фильтр
    if (newPliesNumber !== null && pliesFilter !== null) {
      setPliesFilter(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
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
                htmlFor="plies-number-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by Number of Plies
              </label>
              <select
                id="plies-number-filter"
                value={pliesNumberFilter !== null ? pliesNumberFilter : ""}
                onChange={handlePliesNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blade-primary focus:border-transparent"
              >
                <option value="">All Plies Numbers</option>
                {availablePliesNumbers.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {pliesNumberFilter !== null ? (
            <LayerFilter />
          ) : (
            <div>
              <label
                htmlFor="plies-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by Ply Material
              </label>
              <select
                id="plies-filter"
                value={pliesFilter || ""}
                onChange={handlePliesChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blade-primary focus:border-transparent"
              >
                <option value="">All Ply Materials</option>
                {allPlies.map((ply) => (
                  <option key={ply} value={ply}>
                    {ply}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <ActiveFilterList />
    </div>
  );
};
