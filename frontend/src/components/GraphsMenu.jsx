import React from "react";

const graphMenu = [
  {
    category: "Economic policy",
    items: [
      { id: "graph-health-engagement", label: "Health – engagement" },
      { id: "graph-tax-engagement", label: "Tax policy – engagement" },
    ],
  },
  {
    category: "Social policy",
    items: [
      { id: "graph-education-engagement", label: "Education – engagement" },
    ],
  },
];

const scrollToSection = (targetId) => {
  const el = document.getElementById(targetId);
  if (!el) return;
  const headerOffset = 72;
  const rect = el.getBoundingClientRect();
  const offsetTop = rect.top + window.scrollY - headerOffset;
  window.scrollTo({ top: offsetTop, behavior: "smooth" });
};

const GraphsMenu = () => {
  const [open, setOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState(
    graphMenu[0]?.category ?? null
  );

  return (
    <div className="relative">
      {/* Top-level item */}
      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-400/70"
        onClick={() => setOpen((v) => !v)}
      >
        Graphs
        <span className="text-[10px] opacity-80">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-40 bg-slate-900/95 text-slate-50 rounded-md border border-slate-700/60 shadow-sm text-sm min-w-[260px] overflow-hidden">
          {/* Categories + items in one clean panel */}
          {graphMenu.map((group) => (
            <div
              key={group.category}
              className="border-b border-slate-800/70 last:border-none"
            >
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

              {activeCategory === group.category && (
                <div className="pb-2">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        scrollToSection(item.id);
                        setOpen(false);
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
