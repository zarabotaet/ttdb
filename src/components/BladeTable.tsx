import React from "react";
import { useUnit } from "effector-react";
import { $blades } from "../store";
import { Blade, PlyMaterial } from "../types";

const generateColorFromMaterial = (material: PlyMaterial): string => {
  // Create a hash from the material string
  let hash = 0;
  for (let i = 0; i < material.length; i++) {
    const char = material.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate wood-like colors (browns, tans, yellows)
  // Hue range: 20-60 (yellows to browns) with some variation
  const baseHue = 20 + (Math.abs(hash) % 40); // 20-60 degrees
  const hue = baseHue + ((Math.abs(hash >> 8) % 20) - 10); // Add some variation

  // Saturation: 30-80% (wood has moderate saturation)
  const saturation = 30 + (Math.abs(hash >> 16) % 50);

  // Lightness: 15-85% (from very dark to very light wood)
  const lightness = 15 + (Math.abs(hash >> 24) % 70);

  return `hsl(${Math.max(
    0,
    Math.min(360, hue)
  )}, ${saturation}%, ${lightness}%)`;
};

const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <th
    className={`px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider sticky top-0 z-10 bg-gradient-to-b from-blade-primary to-blade-secondary text-white ${className}`}
  >
    {children}
  </th>
);

export const BladeTable: React.FC = () => {
  const blades = useUnit($blades);

  return (
    <table className="min-w-full bg-white border-collapse">
      <thead>
        <tr>
          <Th className="max-w-24">Brand</Th>
          <Th className="max-w-24">Model</Th>
          <Th>Plies</Th>
          <Th>Weight (g)</Th>
          <Th>Thickness (mm)</Th>
          <Th>Layers</Th>
        </tr>
      </thead>
      <tbody>
        {blades.map((blade: Blade) => (
          <tr
            key={blade.model}
            className="hover:bg-gray-50 transition-colors duration-150"
          >
            <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-24 break-words border text-center">
              {blade.brand}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 max-w-24 break-words border text-center">
              {blade.model}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 border text-center">
              {blade.pliesNumber}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 border text-center">
              {blade.weight}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 border text-center">
              {blade.thick === 0 ? "-" : blade.thick}
            </td>
            <td className="px-4 py-3 text-sm border text-center">
              <div className="flex flex-col gap-0">
                {blade.plies.map((ply, index) => {
                  const backgroundColor = generateColorFromMaterial(ply);
                  // Extract lightness from HSL to determine text color
                  const lightnessMatch = backgroundColor.match(/(\d+)%\)$/);
                  const lightness = lightnessMatch
                    ? parseInt(lightnessMatch[1])
                    : 50;
                  const textColor =
                    lightness > 50 ? "text-gray-800" : "text-white";

                  return (
                    <div
                      key={index}
                      className={`px-2 py-1 text-xs font-medium ${textColor} border-b border-black/10`}
                      style={{
                        backgroundColor,
                      }}
                      title={ply}
                    >
                      {ply}
                    </div>
                  );
                })}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
