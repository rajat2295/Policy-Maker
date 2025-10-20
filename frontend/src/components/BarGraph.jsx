import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
  XAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

// Helper to compute median from an array
const calcMedian = (arr) => {
  if (!arr.length) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

export const BarGraph = ({
  data,
  column = "how_often_use",
  orientation = "horizontal", // "horizontal" or "vertical"
  showReferenceLine = false,
}) => {
  // Prepare chart data and compute median
  const { chartData, median } = useMemo(() => {
    let frequency = {};
    let valueArray = [];

    data.forEach((survey) => {
      if (survey[column] !== undefined && survey[column] !== null) {
        frequency[survey[column]] = (frequency[survey[column]] || 0) + 1;
        valueArray.push(Number(survey[column]));
      }
    });

    let chartArray = Object.keys(frequency).map((key) => ({
      name: key,
      count: frequency[key],
    }));

    chartArray.sort((a, b) => a.count - b.count);
    const medianValue = calcMedian(valueArray);
    return { chartData: chartArray, median: medianValue };
  }, [data, column]);

  if (chartData.length === 0) {
    return <p>No data available</p>;
  }

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className="w-full h-full"
      style={{ background: "#fff", borderRadius: 12, padding: 16 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          {isHorizontal ? (
            <>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} />
              {showReferenceLine && (
                <ReferenceLine y={median} stroke="red" strokeWidth={3} />
              )}
            </>
          ) : (
            <>
              <XAxis dataKey="name" type="category" />
              <YAxis type="number" />
              {showReferenceLine && (
                <ReferenceLine y={median} stroke="red" strokeWidth={3} />
              )}
            </>
          )}
          <Tooltip formatter={(value) => value} />
          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
