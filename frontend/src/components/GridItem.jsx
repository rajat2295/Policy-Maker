import React from "react";

export const GridItem = ({ title, size = "small", caption = "", children }) => {
  return (
    <section
      className={`flex flex-col p-6 border border-gray-200 rounded-xl shadow-sm bg-white h-[100%] focus-within:ring-2 focus-within:ring-blue-600 transition-shadow`}
      aria-label={title}
      tabIndex={0}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
        {title}
      </h2>
      {caption && (
        <figcaption className="mt-1 mb-5 text-s text-gray-500 font-medium italic">
          {caption}
        </figcaption>
      )}
      <div className="flex-grow overflow-y-auto">{children}</div>
    </section>
  );
};
