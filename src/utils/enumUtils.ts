import { Brand } from "../generated/Brand";
import { PlyMaterial } from "../generated/PlyMaterial";

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
