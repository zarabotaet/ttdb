import {
  createStore,
  createEffect,
  sample,
  createEvent,
  combine,
} from "effector";
import { Blade, Brand, PlyMaterial } from "./types";

// Filter events and stores
export const setBrandFilter = createEvent<Brand | null>();
export const setPliesFilter = createEvent<PlyMaterial | null>();
export const setPliesNumberFilter = createEvent<number | null>();
export const clearFilters = createEvent();

export const $brandFilter = createStore<Brand | null>(null)
  .on(setBrandFilter, (_, brand) => brand)
  .reset(clearFilters);

export const $pliesFilter = createStore<PlyMaterial | null>(null)
  .on(setPliesFilter, (_, plies) => plies)
  .reset(clearFilters);

export const $pliesNumberFilter = createStore<number | null>(null)
  .on(setPliesNumberFilter, (_, pliesNumber) => pliesNumber)
  .reset(clearFilters);

export const loadJsonFx = createEffect<void, Blade[]>(async () => {
  const response = await fetch("./all_blades.json");
  const data: Blade[] = await response.json();
  return data;
});

export const $blades = createStore<Blade[]>([]);

// Filtered blades store
export const $filteredBlades = combine(
  $blades,
  $brandFilter,
  $pliesFilter,
  $pliesNumberFilter,
  (blades, brandFilter, pliesFilter, pliesNumberFilter) => {
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
      return true;
    });
  }
);

sample({
  clock: loadJsonFx.doneData,
  target: $blades,
});
