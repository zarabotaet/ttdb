import React from "react";
import {
  getMaterialColor,
  getTextColorForBackground,
} from "../../utils/materialColors";
import { PlyMaterial } from "../../types";
import { updateLayerFilterCondition } from "../../store";

interface LayersDisplayProps {
  plies: PlyMaterial[];
}

export const LayersDisplay: React.FC<LayersDisplayProps> = ({ plies }) => {
  const handleLayerClick = (layerIndex: number, material: PlyMaterial) => {
    updateLayerFilterCondition({
      layerIndex,
      material,
      shouldHave: true,
    });
  };

  return (
    <div className="flex flex-col gap-0">
      {plies.map((ply, index) => {
        const backgroundColor = getMaterialColor(ply);
        const textColor = getTextColorForBackground(backgroundColor);

        return (
          <div
            key={index}
            className={`px-2 py-1 text-xs font-medium ${textColor} border-b border-black/10 cursor-pointer hover:opacity-80 transition-opacity`}
            style={{
              backgroundColor,
            }}
            title={`Click to filter by ${ply} on layer ${index + 1}`}
            onClick={() => handleLayerClick(index, ply)}
          >
            {ply}
          </div>
        );
      })}
    </div>
  );
};
