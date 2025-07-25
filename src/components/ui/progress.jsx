import React from "react";

export function Progress({ value = 0, className = "" }) {
  return (
    <div className={`w-full h-3 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
