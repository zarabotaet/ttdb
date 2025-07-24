import React from "react";

interface ThProps {
  children: React.ReactNode;
  className?: string;
}

export const Th: React.FC<ThProps> = ({ children, className = "" }) => (
  <th
    className={`px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider sticky top-0 z-10 bg-gradient-to-b from-blade-primary to-blade-secondary text-white ${className}`}
  >
    {children}
  </th>
);
