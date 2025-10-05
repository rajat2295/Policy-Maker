import React from "react";

export const GridItem = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border rounded shadow bg-slate-900/50 h-[400px]">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  );
};
