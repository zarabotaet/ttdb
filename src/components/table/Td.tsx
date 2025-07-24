import React from "react";

interface TdProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
  onClick?: () => void;
  title?: string;
}

export const Td: React.FC<TdProps> = ({
  children,
  className = "",
  centered = true,
  onClick,
  title,
}) => (
  <td
    className={`px-4 py-3 text-sm text-gray-700 border ${
      centered ? "text-center" : ""
    } ${className}`}
    onClick={onClick}
    title={title}
  >
    {children}
  </td>
);
