import React from "react";

export const DashboardTabs = ({ activeTab, setActiveTab }) => (
  <nav
    role="tablist"
    aria-label="Dashboard sections"
    className="flex gap-2 mb-7"
    style={{ borderBottom: "2px solid #e5e7eb" }}
  >
    {[
      { label: "Evidence", id: 0 },
      { label: "Communication", id: 1 },
      { label: "Type", id: 2 },
    ].map((tab) => (
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        tabIndex={activeTab === tab.id ? 0 : -1}
        key={tab.id}
        className={`
          px-6 py-2 rounded-none font-medium transition
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-emerald-600
          border border-b-0 border-gray-200
          ${
            activeTab === tab.id
              ? "bg-emerald-700 text-white shadow"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }
        `}
        style={{
          boxShadow:
            activeTab === tab.id
              ? "0 4px 16px rgba(34,197,94,0.08)"
              : undefined,
          outline: "none",
        }}
        onClick={() => setActiveTab(tab.id)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            setActiveTab((activeTab + 1) % 3);
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            setActiveTab((activeTab + 2) % 3);
          }
        }}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);
