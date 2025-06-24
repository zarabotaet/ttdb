import React from "react";
import { useUnit } from "effector-react";
import { $blades } from "../store";
import { Blade } from "../types";

export const BladeTable: React.FC = () => {
  const blades = useUnit($blades);

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gradient-to-r from-blade-primary to-blade-secondary text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Brand
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Model
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Plies
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Weight (g)
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Thickness (mm)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {blades.map((blade: Blade, index: number) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {blade.brand}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{blade.model}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {blade.pliesNumber}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {blade.weight}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {blade.thick === 0 ? "-" : blade.thick}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
