import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blade-primary mb-4"></div>
      <p className="text-gray-600 text-lg">Loading blade data...</p>
    </div>
  );
};
