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
// Helper to compute average from array of numbers
const calcAverage = (arr) => {
  if (!arr.length) return 0;
  const sum = arr.reduce((acc, v) => acc + v, 0);
  return sum / arr.length;
};

export const AverageRankBarGraph = ({
  data,
  keyPrefix = "rank_nowork_", // keys start with this
  customOrder = [], // optional: explicit order of labels
}) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    // 1. Collect all keys that start with the prefix
    const allKeys = Object.keys(data[0] || {}).filter((key) =>
      key.startsWith(keyPrefix)
    );

    // 2. For each key, compute average across rows
    const items = allKeys.map((key) => {
      const values = [];
      data.forEach((row) => {
        const raw = row[key];
        const num = Number(raw);
        if (!isNaN(num)) values.push(num);
      });

      const avg = calcAverage(values);
      const label = key.replace(keyPrefix, "").replace(/_/g, " ");

      return {
        key,
        name: label, // label used on axis
        average: Number(avg.toFixed(3)), // adjust decimals as you like
      };
    });

    // 3. Sort:
    //    - if customOrder provided, use that order on name
    //    - otherwise sort descending by average (like example figure)
    if (customOrder && customOrder.length > 0) {
      items.sort((a, b) => {
        const ia = customOrder.indexOf(a.name);
        const ib = customOrder.indexOf(b.name);
        const ra = ia === -1 ? 9999 : ia;
        const rb = ib === -1 ? 9999 : ib;
        return ra - rb;
      });
    } else {
      items.sort((a, b) => b.average - a.average);
    }

    return items;
  }, [data, keyPrefix, customOrder]);

  if (!chartData.length) return <p>No data available</p>;

  const maxValue = Math.max(...chartData.map((d) => d.average));
  const domainMax =
    maxValue < 0.05 ? 0.05 : (Math.ceil((maxValue * 100) / 5) * 5) / 100; // round up a bit

  return (
    <div
      className="w-full h-full"
      style={{ background: "#fff", borderRadius: 12, padding: 16 }}
    >
      <ResponsiveContainer width="100%" height={800}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, bottom: 20 }}
        >
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, domainMax]}
            tickFormatter={(tick) => tick.toFixed(2)}
            tick={{ fontWeight: 500, fill: "#1e293b" }}
            label={{
              value: "Proportion ranking topic in top 5",
              position: "bottom",
              style: { fontWeight: 500, fill: "#1e293b" },
            }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontWeight: 500, fill: "#1e293b" }}
            width={200}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="average" fill="#184e77" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
