import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
  XAxis,
  CartesianGrid,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

/**
 * [HELPER]: calcAverage
 * Functionality: Performs a simple arithmetic mean calculation.
 * Used here to determine the "Average Rank" or "Average Proportion" for a topic.
 */
const calcAverage = (arr) => {
  if (!arr.length) return 0;
  const sum = arr.reduce((acc, v) => acc + v, 0);
  return sum / arr.length;
};

/**
 * AverageRankBarGraph Component
 * [COMPONENT_DESCRIPTION]: A specialized bar chart that automatically scans
 * raw data for specific keys and calculates their averages.
 * * Best Used For: "Pick your top 5" questions where you want to show
 * the relative popularity of many different options on a single horizontal scale.
 */
export const AverageRankBarGraph = ({
  data,
  keyPrefix = "rank_nowork_", // [CONFIGURABLE_TEXT]: Filters for keys starting with this string
  customOrder = [], // [EDITABLE_VALUE]: Forces a specific order of labels
}) => {
  /**
   * [DATA_TRANSFORMATION_LOGIC]: useMemo
   * Functionality:
   * 1. Discovery: Scans the first object in the data array to find relevant keys.
   * 2. Sanitization: Replaces underscores with spaces and removes prefixes for clean UI labels.
   * 3. Computation: Iterates through all survey rows to find the mean value for each key.
   * 4. Sorting: Defaults to "Descending" so the most popular items are at the top.
   */
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    // 1. Collect all keys that start with the prefix (e.g., rank_nowork_health)
    const allKeys = Object.keys(data[0] || {}).filter((key) =>
      key.startsWith(keyPrefix)
    );

    // 2. Compute averages
    const items = allKeys.map((key) => {
      const values = [];
      data.forEach((row) => {
        const raw = row[key];
        const num = Number(raw);
        if (!isNaN(num)) values.push(num);
      });

      const avg = calcAverage(values);
      // Logic: "rank_nowork_mental_health" -> "mental health"
      const label = key.replace(keyPrefix, "").replace(/_/g, " ");

      return {
        key,
        name: label,
        average: Number(avg.toFixed(3)),
      };
    });

    // 3. Sorting Logic
    if (customOrder && customOrder.length > 0) {
      items.sort((a, b) => {
        const ia = customOrder.indexOf(a.name);
        const ib = customOrder.indexOf(b.name);
        return (ia === -1 ? 9999 : ia) - (ib === -1 ? 9999 : ib);
      });
    } else {
      // Functionality: Auto-sort by highest average first
      items.sort((a, b) => b.average - a.average);
    }

    return items;
  }, [data, keyPrefix, customOrder]);

  if (!chartData.length)
    return <p className="p-4 text-gray-500">No data available</p>;

  // [UI_LOGIC]: Dynamic Axis Scaling
  const maxValue = Math.max(...chartData.map((d) => d.average));
  const domainMax =
    maxValue < 0.05 ? 0.05 : (Math.ceil((maxValue * 100) / 5) * 5) / 100;

  return (
    <div
      className="w-full h-full"
      style={{ background: "#fff", borderRadius: 12, padding: 16 }}
    >
      <ResponsiveContainer width="100%" height={800}>
        <BarChart
          data={chartData}
          layout="vertical" // Functionality: Horizontal bars for better label readability
          margin={{ top: 10, bottom: 40, right: 30 }}
        >
          <CartesianGrid
            stroke="#e5e7eb"
            strokeDasharray="3 3"
            vertical={true}
            horizontal={false}
          />

          <XAxis
            type="number"
            domain={[0, domainMax]}
            tickFormatter={(tick) => tick.toFixed(2)}
            tick={{ fontWeight: 500, fill: "#1e293b" }}
            label={{
              value: "Proportion ranking topic in top 5", // [CONFIGURABLE_TEXT]
              position: "bottom",
              offset: 20,
              style: { fontWeight: 500, fill: "#1e293b" },
            }}
          />

          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontWeight: 500, fill: "#1e293b" }}
            width={200} // [EDITABLE_VALUE]: Space allocated for the category labels
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="average"
            fill="#184e77"
            radius={[0, 4, 4, 0]} // Rounded right corners
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
