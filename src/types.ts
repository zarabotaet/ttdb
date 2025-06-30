import { PlyMaterial } from "./generated/PlyMaterial";
import { Brand } from "./generated/Brand";

// Re-export enums for easier imports
export { Brand, PlyMaterial };

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
