import React from "react";

/**
 * [GRAPH_MENU_CONFIG]: Navigation Structure
 * Functionality: Organizes the navigation items into logical groupings.
 * The 'id' must strictly match the HTML ID of the graph sections to enable scrolling.
 */
const graphMenu = [
  {
    category: "Economic policy", // [CONFIGURABLE_TEXT]
    items: [
      { id: "graph-health-engagement", label: "Health – engagement" },
      { id: "graph-tax-engagement", label: "Tax policy – engagement" },
    ],
  },
  {
    category: "Social policy", // [CONFIGURABLE_TEXT]
    items: [
      { id: "graph-education-engagement", label: "Education – engagement" },
    ],
  },
];

/**
 * [SCROLL_ENGINE]: scrollToSection
 * Functionality: Orchestrates the smooth transition to a specific graph.
 * 1. Finds the element by ID.
 * 2. Subtracts the 'headerOffset' (72px) to prevent the sticky navbar from covering the chart title.
 * 3. Uses the native window.scrollTo with 'smooth' behavior for a professional UX.
 */
const scrollToSection = (targetId) => {
  const el = document.getElementById(targetId);
  if (!el) return;
  const headerOffset = 72; // [EDITABLE_VALUE]: Adjust based on your actual navbar height
  const rect = el.getBoundingClientRect();
  const offsetTop = rect.top + window.scrollY - headerOffset;
  window.scrollTo({ top: offsetTop, behavior: "smooth" });
};

/**
 * GraphsMenu Component
 * [COMPONENT_DESCRIPTION]: A specialized dropdown with an internal accordion.
 * It allows users to browse a large library of charts by category without
 * leaving the current page.
 */
const GraphsMenu = () => {
  const [open, setOpen] = React.useState(false); // Controls the main dropdown visibility
  const [activeCategory, setActiveCategory] = React.useState(
    graphMenu[0]?.category ?? null // Functionality: Defaults to opening the first category
  );

  return (
    <div className="relative">
      {/* Functionality: Main Dropdown Trigger */}
      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-400/70"
        onClick={() => setOpen((v) => !v)}
      >
        Graphs {/* [CONFIGURABLE_TEXT] */}
        <span className="text-[10px] opacity-80">▾</span>
      </button>

      {/* Functionality: Conditional rendering of the menu panel */}
      {open && (
        <div className="absolute left-0 top-full mt-2 z-40 bg-slate-900/95 text-slate-50 rounded-md border border-slate-700/60 shadow-sm text-sm min-w-[260px] overflow-hidden">
          {graphMenu.map((group) => (
            <div
              key={group.category}
              className="border-b border-slate-800/70 last:border-none"
            >
              {/* Functionality: Accordion Header 
                  Toggles the 'activeCategory' to show/hide items within this group.
              */}
              <button
                type="button"
                onClick={() =>
                  setActiveCategory((prev) =>
                    prev === group.category ? null : group.category
                  )
                }
                className={`w-full flex items-center justify-between px-3 py-2 hover:bg-slate-800/80 ${
                  activeCategory === group.category ? "bg-slate-800/80" : ""
                }`}
              >
                <span className="text-[11px] uppercase tracking-wide text-slate-300">
                  {group.category}
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeCategory === group.category ? "▲" : "▼"}
                </span>
              </button>

              {/* Functionality: Accordion Content 
                  Only renders the item buttons if the category is currently active.
              */}
              {activeCategory === group.category && (
                <div className="pb-2">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        scrollToSection(item.id); // Triggers the smooth scroll
                        setOpen(false); // Closes the menu after selection
                      }}
                      className="block w-full text-left px-5 py-1.5 text-[13px] hover:bg-slate-800/80"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GraphsMenu;
