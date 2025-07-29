import React from "react";
import { useUnit } from "effector-react";
import {
  $brandFilter,
  $pliesFilter,
  $pliesNumberFilter,
  $availablePliesNumbers,
  setBrandFilter,
  setPliesFilter,
  setPliesNumberFilter,
} from "../../store";
import { Brand, PlyMaterial } from "../../types";
import { BrandUtils, PlyMaterialUtils } from "../../utils/enumUtils";
import { LayerFilter } from "./LayerFilter";
import { ActiveFilterList } from "./ActiveFilterList";
import { Select } from "./Select";

const brandOptions = BrandUtils.getAllBrands().map((brand) => ({
  value: brand,
  label: brand,
}));
const pliesOptions = PlyMaterialUtils.getAllMaterials().map((ply) => ({
  value: ply,
  label: ply,
}));

export const FilterPanel: React.FC = () => {
  const [brandFilter, pliesFilter, pliesNumberFilter, availablePliesNumbers] =
    useUnit([
      $brandFilter,
      $pliesFilter,
      $pliesNumberFilter,
      $availablePliesNumbers,
    ]);

  const pliesNumberOptions = availablePliesNumbers.map((number) => ({
    value: number.toString(),
    label: number.toString(),
  }));

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
    const newPliesNumber = value === "" ? null : Number(value);
    setPliesNumberFilter(newPliesNumber);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Select
            id="brand-filter"
            label="Filter by Brand"
            value={brandFilter || ""}
            onChange={handleBrandChange}
            options={brandOptions}
            placeholder="All Brands"
          />

          <Select
            id="plies-number-filter"
            label="Filter by Number of Plies"
            value={pliesNumberFilter !== null ? pliesNumberFilter : ""}
            onChange={handlePliesNumberChange}
            options={pliesNumberOptions}
            placeholder="All Plies Numbers"
          />

          <Select
            id="plies-filter"
            label="Filter by Ply Material"
            value={pliesFilter || ""}
            onChange={handlePliesChange}
            options={pliesOptions}
            placeholder="All Ply Materials"
          />
        </div>

        <div>
          <LayerFilter />
        </div>
      </div>

      <ActiveFilterList />
    </div>
  );
};
