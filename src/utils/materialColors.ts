import { PlyMaterial } from "../generated/PlyMaterial";

/**
 * Generates a consistent color for a given material string using a hash function
 */
const generateColorFromMaterial = (material: string): string => {
  // Create a hash from the material string
  let hash = 0;
  for (let i = 0; i < material.length; i++) {
    const char = material.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate colors based on material type
  if (isCarbonMaterial(material)) {
    // Carbon materials: dark grays and blacks
    const lightness = 15 + (Math.abs(hash) % 25); // 15-40% lightness
    return `hsl(0, 0%, ${lightness}%)`;
  } else if (isSyntheticMaterial(material)) {
    // Synthetic materials: blues, grays, metallic colors
    const hue = 200 + (Math.abs(hash) % 80); // 200-280 degrees (blues to purples)
    const saturation = 40 + (Math.abs(hash >> 8) % 40); // 40-80%
    const lightness = 30 + (Math.abs(hash >> 16) % 40); // 30-70%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  } else {
    // Natural wood materials: browns, tans, yellows
    const baseHue = 20 + (Math.abs(hash) % 40); // 20-60 degrees
    const hue = baseHue + ((Math.abs(hash >> 8) % 20) - 10); // Add variation
    const saturation = 30 + (Math.abs(hash >> 16) % 50); // 30-80%
    const lightness = 40 + (Math.abs(hash >> 24) % 45); // 40-85% (lighter range)
    return `hsl(${Math.max(
      0,
      Math.min(360, hue)
    )}, ${saturation}%, ${lightness}%)`;
  }
};

/**
 * Checks if a material is carbon-based
 */
const isCarbonMaterial = (material: string): boolean => {
  const carbonKeywords = ["carbon", "carbotox"];
  return carbonKeywords.some((keyword) =>
    material.toLowerCase().includes(keyword.toLowerCase())
  );
};

/**
 * Checks if a material is synthetic (non-wood, non-carbon)
 */
const isSyntheticMaterial = (material: string): boolean => {
  const syntheticKeywords = [
    "alc",
    "salc",
    "zlc",
    "szlc",
    "zlf",
    "ulc",
    "t5000",
    "cnf",
    "caf",
    "arylate",
    "kevlar",
    "aramid",
    "texalium",
    "glass",
    "aratox",
    "dotec",
    "flax",
    "cloth",
  ];

  return (
    syntheticKeywords.some((keyword) =>
      material.toLowerCase().includes(keyword.toLowerCase())
    ) && !isCarbonMaterial(material)
  );
};

/**
 * Generates a color map for all PlyMaterial enum values using a loop
 * Generated at build time for consistency and performance
 */
const generateMaterialColorMap = (): Record<PlyMaterial, string> => {
  const colorMap = {} as Record<PlyMaterial, string>;

  // Get all enum values and generate colors for each
  Object.values(PlyMaterial).forEach((material) => {
    colorMap[material] = generateColorFromMaterial(material);
  });

  return colorMap;
};

/**
 * Pre-computed color map for all PlyMaterial enum values
 * Generated at build time for consistency and performance
 */
export const MATERIAL_COLOR_MAP: Record<PlyMaterial, string> =
  generateMaterialColorMap();

/**
 * Gets the color for a material from the pre-computed map
 */
export const getMaterialColor = (material: PlyMaterial): string => {
  return MATERIAL_COLOR_MAP[material];
};

/**
 * Determines if text should be light or dark based on background color lightness
 */
export const getTextColorForBackground = (backgroundColor: string): string => {
  // Extract lightness from HSL color
  const lightnessMatch = backgroundColor.match(/(\d+)%\)$/);
  const lightness = lightnessMatch ? parseInt(lightnessMatch[1]) : 50;
  return lightness > 50 ? "text-gray-800" : "text-white";
};
