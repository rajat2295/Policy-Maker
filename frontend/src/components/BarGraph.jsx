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
import { CustomTooltip } from "./CustomTooltip";

// Helper to compute median
const calcMedian = (arr) => {
  if (!arr.length) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

// Optional helper: sort tooltip payload by the same order as x-axis labels
const sortTooltipPayload = (payload, customOrder) => {
  if (!Array.isArray(payload) || !customOrder || !customOrder.length) {
    return payload;
  }

  const orderMap = customOrder.reduce((acc, label, index) => {
    acc[label] = index;
    return acc;
  }, {});

  return [...payload].sort((a, b) => {
    const nameA = a.payload?.name ?? a.name;
    const nameB = b.payload?.name ?? b.name;

    const rankA =
      orderMap[nameA] !== undefined ? orderMap[nameA] : Number.MAX_SAFE_INTEGER;
    const rankB =
      orderMap[nameB] !== undefined ? orderMap[nameB] : Number.MAX_SAFE_INTEGER;

    return rankA - rankB;
  });
};

export const BarGraph = ({
  data,
  column = "how_often_use",
  orientation = "horizontal",
  showReferenceLine = false,
  customOrder = [], // static list defining visual + tooltip order
}) => {
  const { chartData, median, maxValue } = useMemo(() => {
    let frequency = {};
    let numericValues = [];

    // Frequency mapping
    data.forEach((survey) => {
      const val = survey[column];
      if (val !== undefined && val !== null) {
        frequency[val] = (frequency[val] || 0) + 1;
        if (!isNaN(Number(val))) numericValues.push(Number(val));
      }
    });

    const total = Object.values(frequency).reduce((a, b) => a + b, 0);

    let chartArray = Object.keys(frequency).map((key) => {
      const value = frequency[key];
      const percentage = (value / total) * 100;
      return {
        name: key,
        percentage: Number(percentage.toFixed(2)),
        count: value,
      };
    });

    // --- ORDERING LOGIC ---
    if (customOrder && customOrder.length > 0) {
      chartArray.sort((a, b) => {
        const indexA = customOrder.indexOf(a.name);
        const indexB = customOrder.indexOf(b.name);

        const rankA = indexA === -1 ? 9999 : indexA;
        const rankB = indexB === -1 ? 9999 : indexB;

        return rankA - rankB;
      });
    } else {
      // Default: Sort by percentage if no custom order is given
      chartArray.sort((a, b) => a.percentage - b.percentage);
    }
    // ----------------------

    // Median and Max calculations (unaffected by sorting)
    const medianValue = calcMedian(chartArray.map((e) => e.percentage));
    const maxValue = Math.max(...chartArray.map((e) => e.percentage));

    return { chartData: chartArray, median: medianValue, maxValue };
  }, [data, column, customOrder]);

  if (!chartData.length) return <p>No data available</p>;

  const isHorizontal = orientation === "horizontal";
  const domainMax = maxValue < 45 ? 45 : Math.ceil(maxValue / 10) * 10;

  // Wrap CustomTooltip so payload is sorted consistently
  const tooltipContent = (tooltipProps) => {
    const sortedPayload = sortTooltipPayload(tooltipProps.payload, customOrder);
    return <CustomTooltip {...tooltipProps} payload={sortedPayload} />;
  };

  return (
    <div
      className="w-full h-full"
      style={{ background: "#fff", borderRadius: 12, padding: 16 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{ top: 10, right: 30, left: 70, bottom: 10 }}
        >
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          {isHorizontal ? (
            <>
              <XAxis
                type="number"
                unit="%"
                domain={[0, domainMax]}
                tickFormatter={(tick) => `${tick}`}
                tick={{ fontWeight: 500, fill: "#1e293b" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontWeight: 500, fill: "#1e293b" }}
                width={140}
              />
              <Tooltip content={tooltipContent} />
              <Bar dataKey="percentage" fill="#184e77" />
              {showReferenceLine && (
                <ReferenceLine
                  x={median}
                  stroke="red"
                  strokeWidth={3}
                  label={{
                    position: "top",
                    value: "Median",
                    fill: "#d32f2f",
                    fontWeight: 500,
                  }}
                />
              )}
            </>
          ) : (
            <>
              <XAxis
                dataKey="name"
                type="category"
                tick={{ fontWeight: 500, fill: "#1e293b" }}
              />
              <YAxis
                type="number"
                unit="%"
                domain={[0, domainMax]}
                tickFormatter={(tick) => `${tick}%`}
                tick={{ fontWeight: 500, fill: "#1e293b" }}
              />
              <Tooltip content={tooltipContent} />
              <Bar dataKey="percentage" fill="#184e77" radius={[0, 6, 6, 0]} />
              {showReferenceLine && (
                <ReferenceLine
                  y={median}
                  stroke="red"
                  strokeWidth={3}
                  label={{
                    position: "right",
                    value: "Median",
                    fill: "#d32f2f",
                    fontWeight: 500,
                  }}
                />
              )}
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
