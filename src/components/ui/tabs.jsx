import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext();

export function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }) {
  return <div className="flex border-b border-gray-300">{children}</div>;
}

export function TabsTrigger({ value, children }) {
  const { value: selectedValue, setValue } = useContext(TabsContext);
  const isSelected = selectedValue === value;
  return (
    <button
      onClick={() => setValue(value)}
      className={`px-4 py-2 -mb-px border-b-2 ${
        isSelected
          ? "border-blue-600 font-semibold text-blue-600"
          : "border-transparent hover:text-blue-500"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  const { value: selectedValue } = useContext(TabsContext);
  if (value !== selectedValue) return null;
  return <div className="p-4">{children}</div>;
}
