import {
  createStore,
  createEffect,
  sample,
  createEvent,
  combine,
} from "effector";
import Papa from "papaparse";
import { Blade, BladeData, Brand, PlyMaterial } from "./types";

// Filter events and stores
export const setBrandFilter = createEvent<Brand | null>();
export const setPliesFilter = createEvent<PlyMaterial | null>();
export const clearFilters = createEvent();

export const $brandFilter = createStore<Brand | null>(null)
  .on(setBrandFilter, (_, brand) => brand)
  .reset(clearFilters);

export const $pliesFilter = createStore<PlyMaterial | null>(null)
  .on(setPliesFilter, (_, plies) => plies)
  .reset(clearFilters);

export const loadCsvFx = createEffect<void, Blade[]>(async () => {
  const response = await fetch("./parsing/all_blades.csv");
  const csvText = await response.text();

  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      complete: ({ data }: { data: BladeData[] }) => {
        const convertedData = data
          .filter((item: BladeData) => item.Brand && item.Model) // Filter out empty rows
          .map((item: BladeData) => ({
            brand: item.Brand,
            model: item.Model,
            pliesNumber: parseInt(item["Nb plies"], 10),
            weight: parseFloat(item["Weight (g)"]) || 0,
            thick: parseFloat(item["Thick. (mm)"]) || 0,
            plies: [
              item["Ply 1"],
              item["Ply 2"],
              item["Ply 3"],
              item["Ply 4"],
              item["Ply 5"],
              item["Ply 6"],
              item["Ply 7"],
              item["Ply 8"],
              item["Ply 9"],
            ].filter((ply): ply is PlyMaterial => Boolean(ply)),
          }));

        resolve(convertedData);
      },
    });
  });
});

export const $blades = createStore<Blade[]>([]);

// Filtered blades store
export const $filteredBlades = combine(
  $blades,
  $brandFilter,
  $pliesFilter,
  (blades, brandFilter, pliesFilter) => {
    return blades.filter((blade) => {
      if (brandFilter && blade.brand !== brandFilter) {
        return false;
      }
      if (pliesFilter && !blade.plies.includes(pliesFilter)) {
        return false;
      }
      return true;
    });
  }
);

sample({
  clock: loadCsvFx.doneData,
  target: $blades,
});
