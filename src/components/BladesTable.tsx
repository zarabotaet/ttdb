import React from "react";
import { useUnit } from "effector-react";
import { $blades } from "../store";
import { Blade } from "../types";
import {
  getMaterialColor,
  getTextColorForBackground,
} from "../utils/materialColors";

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

export const BladesTable: React.FC = () => {
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
            key={blade.model + blade.pliesNumber}
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
                  const backgroundColor = getMaterialColor(ply);
                  const textColor = getTextColorForBackground(backgroundColor);

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
