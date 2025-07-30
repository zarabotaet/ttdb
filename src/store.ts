import {
  createStore,
  createEffect,
  createEvent,
  combine,
  restore,
  merge,
} from "effector";
import { once } from "patronum";
import {
  Blade,
  Brand,
  Collection,
  LayerFilterCondition,
  PlyMaterial,
} from "./types";

export const setBrandFilter = createEvent<Brand | null>();
export const setPliesFilter = createEvent<PlyMaterial | null>();
export const setPliesNumberFilter = createEvent<number | null>();
export const updateLayerFilterCondition = createEvent<LayerFilterCondition>();
export const removeLayerFilterCondition = createEvent<{ layerIndex: number }>();
export const setCollectionFilter = createEvent<Collection>();
export const clearFilters = createEvent();

export const $brandFilter = restore(setBrandFilter, null).reset(clearFilters);
export const $pliesFilter = restore(setPliesFilter, null).reset(clearFilters);
export const $pliesNumberFilter = restore(setPliesNumberFilter, null).reset(
  clearFilters
);

const switchToAllOnce = once(
  merge([
    setBrandFilter,
    setPliesFilter,
    setPliesNumberFilter,
    updateLayerFilterCondition,
    removeLayerFilterCondition,
  ])
);

export const $collectionFilter = restore(
  setCollectionFilter,
  Collection.Popular
).on([switchToAllOnce, clearFilters], () => Collection.All);

export const $layerFilter = createStore<LayerFilterCondition[]>([])
  .on(updateLayerFilterCondition, (state, condition) => {
    const filtered = state.filter((c) => c.layerIndex !== condition.layerIndex);
    return [...filtered, condition];
  })
  .on(removeLayerFilterCondition, (state, { layerIndex }) =>
    state.filter((c) => c.layerIndex !== layerIndex)
  )
  .reset(clearFilters, setPliesFilter);

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
export const $popularBlades = $blades.map((blades) =>
  blades
    .filter((blade) => blade.popular)
    .sort((a, b) => a.popularityRank! - b.popularityRank!)
);

export const $filteredBlades = combine(
  $blades,
  $popularBlades,
  $brandFilter,
  $pliesFilter,
  $pliesNumberFilter,
  $layerFilter,
  $collectionFilter,
  (
    allBlades,
    popularBlades,
    brandFilter,
    pliesFilter,
    pliesNumberFilter,
    layerFilter,
    collectionFilter
  ) => {
    const blades =
      collectionFilter === Collection.Popular ? popularBlades : allBlades;
    if (
      brandFilter === null &&
      pliesFilter === null &&
      pliesNumberFilter === null &&
      layerFilter.length === 0
    ) {
      return blades;
    }

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

export type ActiveFilter = {
  key: string;
  label: string;
  onRemove: () => void;
  bgColor?: string;
};

export const $activeFilters = combine(
  $brandFilter,
  $pliesFilter,
  $pliesNumberFilter,
  $layerFilter,
  $collectionFilter,
  (
    brandFilter,
    pliesFilter,
    pliesNumberFilter,
    layerFilter,
    collectionFilter
  ) => {
    const filters: ActiveFilter[] = [];

    if (collectionFilter === "popular") {
      filters.push({
        key: "collection",
        label: "Collection: Popular",
        onRemove: () => setCollectionFilter(Collection.All),
        bgColor: "bg-yellow-500",
      });
    }

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
