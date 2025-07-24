import React from "react";

interface TdProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export const Td: React.FC<TdProps> = ({
  children,
  className = "",
  centered = true,
}) => (
  <td
    className={`px-4 py-3 text-sm text-gray-700 border ${
      centered ? "text-center" : ""
    } ${className}`}
  >
    {children}
  </td>
);
