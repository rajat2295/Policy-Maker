import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  Tooltip,
  Legend,
  ZAxis,
  ReferenceLine,
} from "recharts";

// Define label/order explicitly for clarity and axis control
const LABELS = [
  "Never",
  "Less than once a month",
  "Once a month",
  "2-3 times a month",
  "Once a week",
  "At least a few times a week",
];

const labelToIndex = (label) => LABELS.indexOf(label);

// Main component
export const BubbleGraph = ({
  data,
  xKey = "how_often_learn",
  yKey = "if_changes_how_often",
}) => {
  // Aggregate counts for every possible (x, y) pair
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
    console.log("BubbleGraph counts:", counts);
    // Fill out all grid cells, 0 if not present
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

  // Get largest count for bubble scaling
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div style={{ width: "100%", height: 600 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 40, right: 20, bottom: 30, left: 50 }}>
          <CartesianGrid />
          <XAxis
            type="category"
            dataKey="xLabel"
            name="Current Frequency"
            tick={{ fontWeight: 600 }}
            allowDuplicatedCategory={false}
            interval={0}
            label={{
              value: "Learning about research",
              position: "bottom",
              offset: 17,
            }}
          />
          <YAxis
            type="category"
            dataKey="yLabel"
            name="If Matched Preferences"
            tick={{ fontWeight: 600 }}
            allowDuplicatedCategory={false}
            interval={0}
            label={{
              value: "Research matched preferences",
              angle: -90,
              position: "insideLeft", // Could also use "left" for outside
              offset: -18, // or try 8, 10, etc.
            }}
          />
          <ZAxis
            type="number"
            dataKey="count"
            range={[60, 400]} // min/max bubble size
            name="People"
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => [
              `${value}`,
              name === "count" ? "Responses" : name,
            ]}
            contentStyle={{ fontWeight: 600 }}
          />
          {/* Diagonal reference line for context */}
          <ReferenceLine
            segment={[
              { x: LABELS[0], y: LABELS[0] },
              { x: LABELS[LABELS.length - 1], y: LABELS[LABELS.length - 1] },
            ]}
            stroke="#666"
            strokeDasharray="3 3"
          />
          <Scatter
            data={chartData.filter((d) => d.count > 0)}
            shape="circle"
            fill="#2d6cdf"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
