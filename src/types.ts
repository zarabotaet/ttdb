import { PlyMaterial } from "./generated/PlyMaterial";
import { Brand } from "./generated/Brand";

export { Brand, PlyMaterial };

export interface Blade {
  brand: Brand;
  model: string;
  pliesNumber: number;
  weight: number;
  thick: number;
  popular: boolean;
  popularityRank: number | null;
  plies: PlyMaterial[];
}

export type BrandFilter = Brand | null;
export type PliesFilter = PlyMaterial | null;

export type LayerFilterCondition = {
  layerIndex: number;
  material: PlyMaterial;
  shouldHave: boolean;
};

export enum Collection {
  All = "all",
  Popular = "popular",
}
