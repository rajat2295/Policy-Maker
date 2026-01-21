import React from "react";

/**
 * ExtremeLabelTick Component
 * [COMPONENT_DESCRIPTION]: A custom SVG tick renderer for Recharts X-Axis.
 * Functionality: It renders the standard numeric value for every tick, but
 * injects bold "Extreme Labels" (e.g., "Strongly Disagree" / "Strongly Agree")
 * specifically under the first and last ticks of the scale.
 */
export const ExtremeLabelTick = ({
  x, // Functionality: SVG coordinate provided by Recharts
  y, // Functionality: SVG coordinate provided by Recharts
  payload, // Functionality: Contains the specific tick value (e.g., 0, 1, 2)
  ticks, // Functionality: The full array of ticks to determine start/end
  extremeLeftLabel, // [CONFIGURABLE_TEXT]: Label for the lowest value
  extremeRightLabel, // [CONFIGURABLE_TEXT]: Label for the highest value
}) => {
  const value = payload.value;

  // Logic: Identify if the current tick being rendered is the start or the end of the axis
  const isFirst = value === ticks[0];
  const isLast = value === ticks[ticks.length - 1];

  return (
    <g>
      {/* 1. Standard Tick Label
          Functionality: Draws the numeric value (0, 1, 2, etc.) centered under the tick.
      */}
      <text
        x={x}
        y={y + 15} // [EDITABLE_VALUE]: Vertical offset from the axis line
        textAnchor="middle"
        fill="#1e293b"
        fontWeight={500}
        fontSize={14}
      >
        {value}
      </text>

      {/* 2. Left Extreme Label
          Functionality: Only renders if this is the first tick and a label was provided.
          It is placed lower (y + 35) than the number to avoid overlap.
      */}
      {isFirst && extremeLeftLabel && (
        <text
          x={x}
          y={y + 35} // [EDITABLE_VALUE]: Pushed lower for visual hierarchy
          textAnchor="middle"
          fill="#1e293b"
          fontWeight={700}
          fontSize={16}
        >
          {extremeLeftLabel}
        </text>
      )}

      {/* 3. Right Extreme Label
          Functionality: Only renders if this is the last tick and a label was provided.
      */}
      {isLast && extremeRightLabel && (
        <text
          x={x}
          y={y + 35}
          textAnchor="middle"
          fill="#1e293b"
          fontWeight={700}
          fontSize={16}
        >
          {extremeRightLabel}
        </text>
      )}
    </g>
  );
};
