import React from "react";

export function Button({ children, variant = "primary", className = "", ...props }) {
  let baseClasses = "px-4 py-2 rounded-md font-semibold focus:outline-none transition-colors";

  let variantClasses = "";

  switch (variant) {
    case "secondary":
      variantClasses = "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600";
      break;
    case "outline":
      variantClasses = "border border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-700";
      break;
    case "ghost":
      variantClasses = "bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-700";
      break;
    default: // primary
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600";
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
