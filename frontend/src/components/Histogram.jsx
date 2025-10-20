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
import { ExtremeLabelTick } from "./ExtremeLabelTick.jsx";
const calcMedian = (arr) => {
  if (!arr.length) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

export const Histogram = ({
  data,
  column = "how_often_use",
  orientation = "horizontal",
  showReferenceLine = false,
  extremeLeftLabel = "",
  extremeRightLabel = "",
}) => {
  const { chartData, median, uniqueTicks, minTick, maxTick } = useMemo(() => {
    let frequency = {};
    let valueArray = [];
    data.forEach((survey) => {
      if (survey[column] !== undefined && survey[column] !== null) {
        const val = Number(survey[column]);
        frequency[val] = (frequency[val] || 0) + 1;
        valueArray.push(val);
      }
    });
    const min = Math.min(...valueArray);
    const max = Math.max(...valueArray);
    let ticks = [];
    let chartArray = [];
    for (let i = min; i <= max; i++) {
      ticks.push(i);
      chartArray.push({ name: i, count: frequency[i] || 0 });
    }
    return {
      chartData: chartArray,
      median: calcMedian(valueArray),
      uniqueTicks: ticks,
      minTick: min,
      maxTick: max,
    };
  }, [data, column]);

  if (!chartData.length) return <p>No data available</p>;

  return (
    <div
      className="w-full h-full"
      style={{ background: "#fff", borderRadius: 12, padding: 16 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout={"horizontal"}
          margin={{ top: 5, right: 30, left: 60, bottom: 32 }}
        >
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <Tooltip formatter={(value) => value} />
          <Bar dataKey="count" fill="#2563eb" />
          <XAxis
            dataKey="name"
            type="number"
            ticks={uniqueTicks}
            domain={["auto", "auto"]}
            interval={0}
            allowDuplicatedCategory={false}
            tick={(props) =>
              ExtremeLabelTick({
                ...props,
                ticks: uniqueTicks,
                extremeLeftLabel,
                extremeRightLabel,
              })
            }
            padding={{ left: 8, right: 8 }}
          />
          <YAxis type="number" />
          <ReferenceLine
            x={0}
            stroke="#333"
            strokeDasharray="6 6"
            strokeWidth={2}
            label={{
              position: "top",
              value: "0",
              fill: "#333",
              fontWeight: 600,
            }}
          />
          {showReferenceLine && (
            <ReferenceLine x={median} stroke="red" strokeWidth={3} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
