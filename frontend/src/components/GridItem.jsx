import React from "react";

/**
 * GridItem Component
 * [COMPONENT_DESCRIPTION]: This is the standard "Card" container for all dashboard visuals.
 * It provides a consistent header, caption area, and a flexible body to house various
 * graph components (Bars, Histograms, etc.).
 */
export const GridItem = ({
  title, // [CONFIGURABLE_TEXT]: The main header for the chart
  size = "small", // [EDITABLE_VALUE]: Controls width/height via CSS classes (e.g., small, large, xl)
  caption = "", // [CONFIGURABLE_TEXT]: Contextual info or the exact survey question text
  children, // Functionality: The actual graph component passed from HomePage
}) => {
  return (
    <section
      /* Functionality: Flex-col ensures the header/caption stay at the top while 
         the chart (flex-grow) fills the remaining vertical space. 
      */
      className={`flex flex-col p-6 border border-gray-200 rounded-xl shadow-sm bg-white h-[100%] focus-within:ring-2 focus-within:ring-blue-600 transition-shadow`}
      /* [ACCESSIBILITY]: aria-label & tabIndex
         Functionality: Ensures screen readers identify the chart section by its title. 
         tabIndex={0} allows keyboard users to navigate between cards using the 'Tab' key.
      */
      aria-label={title}
      tabIndex={0}
    >
      {/* Functionality: Visual Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
        {title}
      </h2>

      {/* Functionality: Conditional Rendering of the Caption. 
          If no caption is provided, this space is collapsed to give more room to the chart. 
      */}
      {caption && (
        <figcaption className="mt-1 mb-5 text-s text-gray-500 font-medium italic">
          {caption}
        </figcaption>
      )}

      {/* Functionality: flex-grow + overflow-y-auto ensures that if a graph 
         is taller than its container, it stays contained within the card 
         without breaking the dashboard layout.
      */}
      <div className="flex-grow overflow-y-auto">{children}</div>
    </section>
  );
};
