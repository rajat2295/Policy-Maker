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

const LABELS = [
  "Never",
  "Less than once a month",
  "Once a month",
  "2-3 times a month",
  "Once a week",
  "At least a few times a week",
];

const labelToIndex = (label) => LABELS.indexOf(label);

export const BubbleGraph = ({
  data,
  xKey = "how_often_learn",
  yKey = "if_changes_how_often",
}) => {
  // 1. Map string data to numeric indices (0 to 5)
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
          xIndex: labelToIndex(xLabel), // We will plot these numbers
          yIndex: labelToIndex(yLabel), // We will plot these numbers
          count: counts[key] || 0,
        };
      })
    );
  }, [data, xKey, yKey]);

  // Create array of indices [0, 1, 2, 3, 4, 5] for ticks
  const ticks = LABELS.map((_, i) => i);

  return (
    <div style={{ width: "100%", height: 600 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 40, right: 20, bottom: 30, left: 50 }}>
          <CartesianGrid />

          {/* 2. Use type="number" and format the ticks back to strings */}
          <XAxis
            type="number"
            dataKey="xIndex"
            name="Current Frequency"
            ticks={ticks}
            tickFormatter={(index) => LABELS[index]}
            tick={{ fontWeight: 600 }}
            interval={0}
            label={{
              value: "Current frequency of learning about research",
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
              value: "Frequency if research matched preferences",
              angle: -90,
              position: "insideLeft",
              offset: -18,
            }}
          />

          <ZAxis
            type="number"
            dataKey="count"
            range={[60, 400]}
            name="People"
          />

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name, props) => {
              if (name === "count") return [`${value}`, "Responses"];
              // For X and Y tooltip values, convert index back to label
              if (name === "Current Frequency") return LABELS[value];
              if (name === "If Matched Preferences") return LABELS[value];
              return value;
            }}
            contentStyle={{ fontWeight: 600 }}
          />

          {/* 3. Reference line now uses simple coordinates from 0,0 to 5,5 */}
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: 5, y: 5 },
            ]}
            stroke="black"
            strokeWidth={1} // Made it slightly thicker
            ifOverflow="extendDomain"
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
