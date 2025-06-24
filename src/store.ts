import { createStore, createEvent, createEffect, sample } from "effector";
import Papa from "papaparse";
import { Blade, BladeData } from "./types";

export const loadCsvFx = createEffect<void, Blade[]>(async () => {
  const response = await fetch("./parsing/all_blades.csv");
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: ({ data }: { data: BladeData[] }) => {
        const convertedData = data.map((item: BladeData) => ({
          brand: item.Brand,
          model: item.Model,
          pliesNumber: parseInt(item["Nb plies"], 10),
          weight: parseFloat(item["Weight (g)"]),
          thick: parseFloat(item["Thick. (mm)"]),
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
          ].filter(Boolean),
        }));

        resolve(convertedData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
});

export const $blades = createStore<Blade[]>([]);

sample({
  clock: loadCsvFx.doneData,
  target: $blades,
});
