import React from "react";

/**
 * CustomTooltip Component
 * [COMPONENT_DESCRIPTION]: A specialized tooltip renderer for Recharts components.
 * It overrides the default browser look to provide a cleaner, branded experience
 * with dynamic units based on the data key.
 */
export const CustomTooltip = ({ active, payload, label }) => {
  /**
   * [GUARD_CLAUSE]:
   * Functionality: Only renders the tooltip if the mouse is actively
   * hovering over a data point (bar, line, or area).
   */
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e0e5ec",
        borderRadius: 7,
        padding: "1em",
        boxShadow: "0 2px 8px #e5e7eb80", // [EDITABLE_VALUE]: Depth and glow of tooltip
      }}
    >
      {/* Functionality: Displays the category name (X-axis label) as the header */}
      <div style={{ fontWeight: 500, color: "black", marginBottom: 3 }}>
        {label}
      </div>

      {/* Functionality: Maps through every data series (payload) visible at this point. 
          Allows the tooltip to support both single bars and stacked bar series. 
      */}
      {payload.map((entry, idx) => (
        <div
          key={idx}
          style={{
            color: "#22306d", // [EDITABLE_VALUE]: Contrast color for numerical data
            fontWeight: 500,
            fontSize: "1em",
            lineHeight: 1.4,
            marginBottom: 2,
            marginTop: 2,
          }}
        >
          {/* [CONDITIONAL_FORMATTING]: 
              Logic: If the data key is explicitly named "percentage", 
              it appends a '%' sign. Otherwise, it prints the raw key and value.
          */}
          {entry.dataKey === "percentage"
            ? `percentage : ${entry.value}%`
            : `${entry.dataKey}: ${entry.value}`}
        </div>
      ))}
    </div>
  );
};
