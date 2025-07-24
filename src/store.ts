import {
  createStore,
  createEffect,
  createEvent,
  combine,
  restore,
} from "effector";
import { Blade, Brand, PlyMaterial } from "./types";

export type LayerFilterCondition = {
  layerIndex: number;
  material: PlyMaterial;
  shouldHave: boolean;
};

export const setBrandFilter = createEvent<Brand | null>();
export const setPliesFilter = createEvent<PlyMaterial | null>();
export const setPliesNumberFilter = createEvent<number | null>();
export const setLayerFilter = createEvent<LayerFilterCondition[]>();
export const updateLayerFilterCondition = createEvent<LayerFilterCondition>();
export const removeLayerFilterCondition = createEvent<{ layerIndex: number }>();
export const clearFilters = createEvent();

export const $brandFilter = restore(setBrandFilter, null).reset(clearFilters);
export const $pliesFilter = restore(setPliesFilter, null).reset(
  clearFilters,
  setLayerFilter
);
export const $pliesNumberFilter = restore(setPliesNumberFilter, null).reset(
  clearFilters
);
export const $layerFilter = createStore<LayerFilterCondition[]>([])
  .on(setLayerFilter, (_, conditions) => conditions)
  .on(updateLayerFilterCondition, (state, condition) => {
    const filtered = state.filter((c) => c.layerIndex !== condition.layerIndex);
    return [...filtered, condition];
  })
  .on(removeLayerFilterCondition, (state, { layerIndex }) =>
    state.filter((c) => c.layerIndex !== layerIndex)
  )
  .reset(clearFilters, setPliesFilter, setPliesNumberFilter);

export const loadJsonFx = createEffect<void, Blade[]>(async () => {
  const response = await fetch("./all_blades.json");
  const data: Blade[] = await response.json();
  return data;
});

export const $blades = restore<Blade[]>(loadJsonFx, []);
export const $availablePliesNumbers = $blades.map((blades) => {
  const pliesNumbers = blades.map((blade) => blade.pliesNumber);
  return [...new Set(pliesNumbers)].sort((a, b) => a - b);
});
export const $maximumPliesNumber = $availablePliesNumbers.map((numbers) =>
  Math.max(...numbers, 0)
);

export const $filteredBlades = combine(
  $blades,
  $brandFilter,
  $pliesFilter,
  $pliesNumberFilter,
  $layerFilter,
  (blades, brandFilter, pliesFilter, pliesNumberFilter, layerFilter) => {
    return blades.filter((blade) => {
      if (brandFilter && blade.brand !== brandFilter) {
        return false;
      }
      if (pliesFilter && !blade.plies.includes(pliesFilter)) {
        return false;
      }
      if (
        pliesNumberFilter !== null &&
        blade.pliesNumber !== pliesNumberFilter
      ) {
        return false;
      }

      if (layerFilter.length > 0) {
        for (const condition of layerFilter) {
          const layerMaterial = blade.plies[condition.layerIndex];
          if (condition.shouldHave) {
            if (layerMaterial !== condition.material) {
              return false;
            }
          } else {
            if (layerMaterial === condition.material) {
              return false;
            }
          }
        }
      }

      return true;
    });
  }
);

export const $activeFilters = combine(
  $brandFilter,
  $pliesFilter,
  $pliesNumberFilter,
  $layerFilter,
  (brandFilter, pliesFilter, pliesNumberFilter, layerFilter) => {
    const filters = [];

    if (brandFilter) {
      filters.push({
        key: "brand",
        label: `Brand: ${brandFilter}`,
        onRemove: () => setBrandFilter(null),
        bgColor: "bg-blade-primary",
      });
    }

    if (pliesFilter) {
      filters.push({
        key: "plies",
        label: `Plies: ${pliesFilter}`,
        onRemove: () => setPliesFilter(null),
        bgColor: "bg-blade-secondary",
      });
    }

    if (pliesNumberFilter !== null) {
      filters.push({
        key: "pliesNumber",
        label: `Plies Number: ${pliesNumberFilter}`,
        onRemove: () => setPliesNumberFilter(null),
        bgColor: "bg-blade-tertiary",
      });
    }

    layerFilter.forEach((condition, index) => {
      filters.push({
        key: `layer-${condition.layerIndex}-${index}`,
        label: `Layer ${condition.layerIndex + 1}: ${
          condition.shouldHave ? "✓" : "✗"
        } ${condition.material}`,
        onRemove: () =>
          removeLayerFilterCondition({ layerIndex: condition.layerIndex }),
        bgColor: "bg-purple-500",
      });
    });

    return filters;
  }
);

export const $hasActiveFilters = $activeFilters.map(
  (filters) => filters.length > 0
);
