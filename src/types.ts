import { PlyMaterial } from "./generated/PlyMaterial";
import { Brand } from "./generated/Brand";

// Re-export enums for easier imports
export { Brand, PlyMaterial };

/**
 * Raw CSV data structure matching the CSV headers
 * Uses enum types for type safety
 */
export interface BladeData {
  Brand: Brand;
  Model: string;
  "Nb plies": string;
  "Weight (g)": string;
  "Thick. (mm)": string;
  "Ply 1": PlyMaterial | "";
  "Ply 2": PlyMaterial | "";
  "Ply 3": PlyMaterial | "";
  "Ply 4": PlyMaterial | "";
  "Ply 5": PlyMaterial | "";
  "Ply 6": PlyMaterial | "";
  "Ply 7": PlyMaterial | "";
  "Ply 8": PlyMaterial | "";
  "Ply 9": PlyMaterial | "";
}

/**
 * Processed blade data with proper types
 * Brand and PlyMaterial fields use enum values for type safety
 */
export interface Blade {
  brand: Brand;
  model: string;
  pliesNumber: number;
  weight: number;
  thick: number;
  plies: PlyMaterial[];
}

/**
 * Filter state types using enums
 */
export type BrandFilter = Brand | null;
export type PliesFilter = PlyMaterial | null;

/**
 * Utility functions for enum operations
 */
export const BrandUtils = {
  getAllBrands: (): Brand[] => Object.values(Brand),
  isBrand: (value: string): value is Brand =>
    Object.values(Brand).includes(value as Brand),
};

export const PlyMaterialUtils = {
  getAllMaterials: (): PlyMaterial[] => Object.values(PlyMaterial),
  isPlyMaterial: (value: string): value is PlyMaterial =>
    Object.values(PlyMaterial).includes(value as PlyMaterial),
};
