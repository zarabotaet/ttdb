import React from "react";
import { useUnit } from "effector-react";
import {
  $filteredBlades,
  setPliesNumberFilter,
  setBrandFilter,
} from "../../store";
import { Blade, Brand } from "../../types";
import { Th } from "./Th";
import { Td } from "./Td";
import { LayersDisplay } from "./LayersDisplay";

export const BladesTable: React.FC = () => {
  const blades = useUnit($filteredBlades);

  return (
    <table className="min-w-full bg-white border-collapse">
      <thead>
        <tr>
          <Th className="max-w-24">Brand</Th>
          <Th className="max-w-24">Model</Th>
          <Th>Plies</Th>
          <Th>Weight (g)</Th>
          <Th>Thickness (mm)</Th>
          <Th>Details</Th>
        </tr>
      </thead>
      <tbody>
        {blades.map((blade: Blade, index: number) => (
          <tr
            key={index}
            className="hover:bg-gray-50 transition-colors duration-150"
          >
            <Td
              className="font-medium text-gray-900 max-w-24 break-words cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => setBrandFilter(blade.brand as Brand)}
              title={`Filter by ${blade.brand}`}
            >
              {blade.brand}
            </Td>
            <Td className="max-w-24 break-words">{blade.model}</Td>
            <Td
              className="cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => setPliesNumberFilter(blade.pliesNumber)}
              title={`Filter by ${blade.pliesNumber} plies`}
            >
              {blade.pliesNumber}
            </Td>
            <Td>{blade.weight === 0 ? "?" : blade.weight}</Td>
            <Td>{blade.thick === 0 ? "?" : blade.thick}</Td>
            <Td className="w-80 min-w-[320px]">
              <LayersDisplay plies={blade.plies} />
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
