import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  Tooltip,
  ZAxis,
  ReferenceLine,
} from "recharts";

/**
 * [EDITABLE_VALUE]: Ordinal Labels
 * Functionality: These strings are mapped to numeric indices (0-5) to allow
 * Recharts to calculate mathematical positioning on a scatter plot.
 */
const LABELS = [
  "Never",
  "Less than once a month",
  "Once a month",
  "2-3 times a month",
  "Once a week",
  "At least a few times a week",
];

const labelToIndex = (label) => LABELS.indexOf(label);

/**
 * BubbleGraph Component
 * [COMPONENT_DESCRIPTION]: A correlation matrix visualization.
 * It compares "Actual" vs "Ideal" behavior.
 * - Circles on the diagonal line mean behavior matches preference.
 * - Circle size indicates the volume of participants in that specific intersection.
 */
export const BubbleGraph = ({
  data,
  xKey = "how_often_learn", // [EDITABLE_VALUE]: Raw data key for horizontal axis
  yKey = "if_changes_how_often", // [EDITABLE_VALUE]: Raw data key for vertical axis
}) => {
  /**
   * [DATA_TRANSFORMATION_LOGIC]: Matrix Aggregation
   * Functionality:
   * 1. Creates a unique key for every possible intersection (e.g., "Never||Once a week").
   * 2. Counts how many survey rows match that specific intersection.
   * 3. Flattens the matrix into an array of objects that include xIndex and yIndex.
   */
  const chartData = useMemo(() => {
    const counts = {};
    data.forEach((row) => {
      const x = row[xKey];
      const y = row[yKey];
      if (LABELS.includes(x) && LABELS.includes(y)) {
        const key = `${x}||${y}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    return LABELS.flatMap((yLabel) =>
      LABELS.map((xLabel) => {
        const key = `${xLabel}||${yLabel}`;
        return {
          xLabel,
          yLabel,
          xIndex: labelToIndex(xLabel),
          yIndex: labelToIndex(yLabel),
          count: counts[key] || 0,
        };
      })
    );
  }, [data, xKey, yKey]);

  // Functionality: Generates [0, 1, 2, 3, 4, 5] to position the axis ticks
  const ticks = LABELS.map((_, i) => i);

  return (
    <div style={{ width: "100%", height: 600 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 40, right: 20, bottom: 30, left: 50 }}>
          <CartesianGrid />

          {/* X-Axis Functionality: 
              Translates the internal index (0-5) back into human-readable strings for the UI. 
          */}
          <XAxis
            type="number"
            dataKey="xIndex"
            name="Current Frequency"
            ticks={ticks}
            tickFormatter={(index) => LABELS[index]}
            tick={{ fontWeight: 600 }}
            interval={0}
            label={{
              value: "Current frequency of learning about research", // [CONFIGURABLE_TEXT]
              position: "bottom",
              offset: 17,
            }}
          />

          <YAxis
            type="number"
            dataKey="yIndex"
            name="If Matched Preferences"
            ticks={ticks}
            tickFormatter={(index) => LABELS[index]}
            tick={{ fontWeight: 600 }}
            interval={0}
            label={{
              value: "Frequency if research matched preferences", // [CONFIGURABLE_TEXT]
              angle: -90,
              position: "insideLeft",
              offset: -18,
            }}
          />

          {/* [Z-AXIS_LOGIC]: Bubble Scaling
              Functionality: 'range' defines the [min, max] size of the circles in pixels.
              'count' determines where in that range a specific bubble falls.
          */}
          <ZAxis
            type="number"
            dataKey="count"
            range={[60, 400]} // [EDITABLE_VALUE]: Adjust for smaller/larger bubbles
            name="People"
          />

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => {
              if (name === "count") return [`${value}`, "Responses"];
              // Logic: Reverse mapping index back to text for the tooltip display
              if (
                name === "Current Frequency" ||
                name === "If Matched Preferences"
              )
                return LABELS[value];
              return value;
            }}
            contentStyle={{ fontWeight: 600 }}
          />

          {/* [REFERENCE_LINE]: The "Equilibrium" Line
              Functionality: Draws a 45-degree line. 
              Bubbles above the line want MORE frequency than they have.
              Bubbles below the line want LESS frequency than they have.
          */}
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: 5, y: 5 },
            ]}
            stroke="black"
            strokeWidth={1}
            ifOverflow="extendDomain"
          />

          <Scatter
            data={chartData.filter((d) => d.count > 0)} // Optimization: Don't render empty bubbles
            shape="circle"
            fill="#2d6cdf" // [EDITABLE_VALUE]: Bubble color
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
