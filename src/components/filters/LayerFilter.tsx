import React, { useState } from "react";
import { useUnit } from "effector-react";
import {
  $pliesNumberFilter,
  $layerFilter,
  $maximumPliesNumber,
  updateLayerFilterCondition,
  removeLayerFilterCondition,
  LayerFilterCondition,
} from "../../store";
import { PlyMaterial } from "../../types";
import {
  getMaterialColor,
  getTextColorForBackground,
} from "../../utils/materialColors";

const allPlies = Object.values(PlyMaterial).sort();

type LayerRowProps = {
  layerIndex: number;
  condition?: LayerFilterCondition;
};

const LayerRow: React.FC<LayerRowProps> = ({ layerIndex, condition }) => {
  const selectedMaterial = condition?.material || "";
  const [shouldHave, setShouldHave] = useState(condition?.shouldHave ?? true);

  const handleMaterialChange = (material: PlyMaterial | "") => {
    if (material) {
      updateLayerFilterCondition({
        layerIndex,
        material,
        shouldHave,
      });
    } else {
      removeLayerFilterCondition({ layerIndex });
    }
  };

  const handleConditionChange = (newShouldHave: boolean) => {
    setShouldHave(newShouldHave);
    if (selectedMaterial) {
      updateLayerFilterCondition({
        layerIndex,
        material: selectedMaterial,
        shouldHave: newShouldHave,
      });
    }
  };

  const backgroundColor = selectedMaterial
    ? getMaterialColor(selectedMaterial)
    : "transparent";
  const textColor = selectedMaterial
    ? getTextColorForBackground(backgroundColor)
    : "text-gray-700";

  return (
    <div className="flex items-center border-b border-gray-200 last:border-b-0">
      <div className="w-8 text-xs font-medium text-gray-600 text-center flex-shrink-0">
        {layerIndex + 1}
      </div>

      <div className="w-12 flex items-center justify-center flex-shrink-0 border-l border-gray-300">
        <button
          onClick={() => handleConditionChange(!shouldHave)}
          disabled={!selectedMaterial}
          className={`px-2 py-1 text-xs rounded ${
            !selectedMaterial
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : !shouldHave
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          title={
            !selectedMaterial
              ? "Select material first"
              : shouldHave
              ? "Click to negate condition"
              : "Click to make positive condition"
          }
        >
          NOT
        </button>
      </div>

      <div
        className="flex-1 min-w-0 relative border-l border-r border-gray-300"
        style={{
          backgroundColor,
        }}
      >
        <select
          value={selectedMaterial}
          onChange={(e) =>
            handleMaterialChange(e.target.value as PlyMaterial | "")
          }
          className={`w-full px-2 py-1 pr-2 text-xs bg-transparent border-none focus:outline-none appearance-none ${textColor}`}
        >
          <option value="">Select material</option>
          {allPlies.map((ply) => (
            <option key={ply} value={ply}>
              {ply}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
          <svg
            className={`w-3 h-3 text-gray-400 ${textColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => removeLayerFilterCondition({ layerIndex })}
          disabled={!selectedMaterial}
          className={`w-6 h-6 rounded flex items-center justify-center text-sm ${
            !selectedMaterial
              ? "text-gray-300 cursor-not-allowed"
              : "text-red-500 hover:text-red-700 hover:bg-red-50"
          }`}
          title={
            !selectedMaterial ? "Select material first" : "Remove condition"
          }
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const LayerFilter: React.FC = () => {
  const [pliesNumber, layerConditions, maximumPliesNumber] = useUnit([
    $pliesNumberFilter,
    $layerFilter,
    $maximumPliesNumber,
  ]);

  const layers = Array.from(
    { length: pliesNumber || maximumPliesNumber },
    (_, index) => index
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 mt-7">
      {layers.map((layerIndex) => {
        const existingCondition = layerConditions.find(
          (c) => c.layerIndex === layerIndex
        );

        return (
          <LayerRow
            key={layerIndex}
            layerIndex={layerIndex}
            condition={existingCondition}
          />
        );
      })}
    </div>
  );
};
