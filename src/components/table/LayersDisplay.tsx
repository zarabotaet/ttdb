import React from "react";
import {
  getMaterialColor,
  getTextColorForBackground,
} from "../../utils/materialColors";
import { PlyMaterial } from "../../types";

interface LayersDisplayProps {
  plies: PlyMaterial[];
}

export const LayersDisplay: React.FC<LayersDisplayProps> = ({ plies }) => (
  <div className="flex flex-col gap-0">
    {plies.map((ply, index) => {
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
);
