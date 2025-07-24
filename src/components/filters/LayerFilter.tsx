import React, { useState } from "react";
import { useUnit } from "effector-react";
import {
  $pliesNumberFilter,
  $layerFilter,
  updateLayerFilterCondition,
  removeLayerFilterCondition,
  LayerFilterCondition,
  clearFilters,
} from "../../store";
import { PlyMaterial } from "../../types";
import {
  getMaterialColor,
  getTextColorForBackground,
} from "../../utils/materialColors";

const allPlies = Object.values(PlyMaterial).sort();

interface LayerRowProps {
  layerIndex: number;
  condition?: LayerFilterCondition;
  onRemove: () => void;
}

const LayerRow: React.FC<LayerRowProps> = ({
  layerIndex,
  condition,
  onRemove,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<PlyMaterial | "">(
    condition?.material || ""
  );
  const [shouldHave, setShouldHave] = useState(condition?.shouldHave ?? true);

  const handleMaterialChange = (material: PlyMaterial | "") => {
    setSelectedMaterial(material);
    if (material) {
      updateLayerFilterCondition({
        layerIndex,
        material,
        shouldHave,
      });
    } else {
      // If no material selected, remove condition
      onRemove();
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
    : "#f3f4f6";
  const textColor = selectedMaterial
    ? getTextColorForBackground(backgroundColor)
    : "text-gray-700";

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-200">
      <div className="w-8 text-xs font-medium text-gray-600 text-center">
        {layerIndex + 1}
      </div>

      <div className="flex-1">
        <select
          value={selectedMaterial}
          onChange={(e) =>
            handleMaterialChange(e.target.value as PlyMaterial | "")
          }
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blade-primary"
          style={{
            backgroundColor: selectedMaterial ? backgroundColor : undefined,
            color: selectedMaterial
              ? textColor.includes("white")
                ? "white"
                : "black"
              : undefined,
          }}
        >
          <option value="">Select material</option>
          {allPlies.map((ply) => (
            <option key={ply} value={ply}>
              {ply}
            </option>
          ))}
        </select>
      </div>

      {selectedMaterial && (
        <>
          <div className="flex gap-1">
            <button
              onClick={() => handleConditionChange(true)}
              className={`px-2 py-1 text-xs rounded ${
                shouldHave
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title="Must have this material"
            >
              ✓
            </button>
            <button
              onClick={() => handleConditionChange(false)}
              className={`px-2 py-1 text-xs rounded ${
                !shouldHave
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title="Must NOT have this material"
            >
              ✗
            </button>
          </div>

          <button
            onClick={onRemove}
            className="w-6 h-6 text-red-500 hover:text-red-700 hover:bg-red-50 rounded flex items-center justify-center"
            title="Remove condition"
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};

export const LayerFilter: React.FC = () => {
  const [pliesNumber, layerConditions] = useUnit([
    $pliesNumberFilter,
    $layerFilter,
  ]);

  if (!pliesNumber) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-sm text-gray-500 mb-2">Layer Filter</div>
        <div className="text-xs text-gray-400">
          Choose number of plies first to enable layer filtering
        </div>
      </div>
    );
  }

  const layers = Array.from({ length: pliesNumber }, (_, index) => index);
  const hasConditions = layerConditions.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">Layer Filter</div>
        {hasConditions && (
          <button
            onClick={() => clearFilters()}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        {layers.map((layerIndex) => {
          const existingCondition = layerConditions.find(
            (c) => c.layerIndex === layerIndex
          );

          return (
            <LayerRow
              key={layerIndex}
              layerIndex={layerIndex}
              condition={existingCondition}
              onRemove={() => {
                removeLayerFilterCondition({ layerIndex });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
