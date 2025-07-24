import React from "react";
import { useUnit } from "effector-react";
import { $filteredBlades } from "../../store";
import { Blade } from "../../types";
import { Th } from "./Th";
import { Td } from "./Td";
import { LayersDisplay } from "./LayersDisplay";

export const BladesTable: React.FC = () => {
  const blades = useUnit($filteredBlades);

  console.log(blades);

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
            <Td className="font-medium text-gray-900 max-w-24 break-words">
              {blade.brand}
            </Td>
            <Td className="max-w-24 break-words">{blade.model}</Td>
            <Td>{blade.pliesNumber}</Td>
            <Td>{blade.weight}</Td>
            <Td>{blade.thick === 0 ? "-" : blade.thick}</Td>
            <Td>
              <LayersDisplay plies={blade.plies} />
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
