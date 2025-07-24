import React from "react";

interface ActiveFilterTagProps {
  label: string;
  onRemove: () => void;
  className?: string;
  bgColor?: string;
}

export const ActiveFilterTag: React.FC<ActiveFilterTagProps> = ({
  label,
  onRemove,
  className = "",
  bgColor = "bg-blue-500",
}) => {
  return (
    <div
      className={`inline-flex items-center justify-between px-2.5 py-1 rounded-full text-xs font-medium text-white ${bgColor} ${className}`}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="inline-flex items-center justify-center w-4 h-4 py-1 ml-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-150 text-center leading-none"
        title="Remove filter"
      >
        ×
      </button>
    </div>
  );
};
