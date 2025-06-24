import { PlyMaterial } from "./generated/PlyMaterial";
import { Brand } from "./generated/Brand";

export { Brand, PlyMaterial };

export type BladeData = {
  Brand: Brand;
  Model: string;
  "Nb plies": string;
  "Weight (g)": string;
  "Thick. (mm)": string;
  "Ply 1": PlyMaterial;
  "Ply 2": PlyMaterial;
  "Ply 3": PlyMaterial;
  "Ply 4": PlyMaterial;
  "Ply 5": PlyMaterial;
  "Ply 6": PlyMaterial;
  "Ply 7": PlyMaterial;
  "Ply 8": PlyMaterial;
  "Ply 9": PlyMaterial;
};

export type Blade = {
  brand: Brand;
  model: string;
  pliesNumber: number;
  weight: number;
  thick: number;
  plies: PlyMaterial[];
};
