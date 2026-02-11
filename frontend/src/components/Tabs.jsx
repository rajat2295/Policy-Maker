import React from "react";
import { Link } from "react-router-dom"; // Ensure correct router import
/**
 * DashboardTabs Component
 * [COMPONENT_DESCRIPTION]: The primary navigation for the dashboard.
 * It manages which group of graphs is currently rendered.
 * Built with full ARIA support for screen readers and keyboard accessibility.
 */
export const DashboardTabs = ({
  activeTab, // Functionality: The current numeric ID of the active section
  setActiveTab, // Functionality: State setter to switch sections
}) => (
  <nav
    role="tablist" // [ACCESSIBILITY]: Informs screen readers this is a tabbed interface
    aria-label="Dashboard sections"
    className="flex gap-2 mb-7"
    style={{ borderBottom: "2px solid #e5e7eb" }}
  >
    {[
      { label: "Highlights", id: 0 }, // [EDITABLE_VALUE]: Tab labels and indices
      { label: "Evidence", id: 1 },
      { label: "Communication", id: 2 },
      { label: "Type", id: 3 },
    ].map((tab) => (
      <Link to={`/${tab.label.toLowerCase()}`} key={tab.id}>
        <button
          type="button"
          role="tab" // [ACCESSIBILITY]: Identifies individual buttons as tabs
          aria-selected={activeTab === tab.id}
          /* Functionality: Only the active tab can be reached via 'Tab' key. 
           Others are reached via Arrow keys (managed in onKeyDown). 
        */
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
              ? "bg-emerald-700 text-white shadow" // [EDITABLE_VALUE]: Active color theme
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
          /**
           * [UX_LOGIC]: Arrow Key Navigation
           * Functionality: Implements standard tab behavior.
           * Users can cycle through "Highlights" -> "Type" using Arrow keys.
           * Note: The current logic (mod 3) should likely be (mod 4) to match the number of tabs.
           */
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              setActiveTab((activeTab + 1) % 4);
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              setActiveTab((activeTab + 3) % 4);
            }
          }}
        >
          {tab.label}
        </button>
      </Link>
    ))}
  </nav>
);
