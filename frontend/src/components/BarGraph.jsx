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
import { DEFAULT_BAR_SIZE } from "../helpers/constants";

/**
 * [HELPER]: calcMedian
 * Functionality: Computes the median percentage across all categories.
 */
const calcMedian = (arr) => {
  if (!arr.length) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

/**
 * [HELPER]: sortTooltipPayload
 * Functionality: Synchronizes the tooltip display order with the graph's visual order.
 * This prevents confusion where the top bar in the chart might be the bottom item in the tooltip.
 */
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
    const rankA = orderMap[nameA] !== undefined ? orderMap[nameA] : 999;
    const rankB = orderMap[nameB] !== undefined ? orderMap[nameB] : 999;
    return rankA - rankB;
  });
};

/**
 * BarGraph Component
 * [COMPONENT_DESCRIPTION]: A versatile bar chart that supports horizontal and vertical layouts.
 * It automatically calculates percentage distributions from raw survey counts.
 */
export const BarGraph = ({
  data,
  column = "how_often_use",
  orientation = "horizontal", // Functionality: "horizontal" results in vertical bars, and vice-versa.
  showReferenceLine = false, // Functionality: Toggles the median indicator.
  customOrder = [], // [EDITABLE_VALUE]: Array of strings defining the specific X/Y axis order.
}) => {
  /**
   * [DATA_ENGINE]: useMemo
   * Functionality:
   * 1. Aggregates counts for each unique value in the specified column.
   * 2. Converts counts into percentages based on the total responses.
   * 3. Applies custom ordering logic (e.g., placing "High" before "Low" regardless of values).
   */
  const { chartData, median, maxValue } = useMemo(() => {
    let frequency = {};
    data.forEach((survey) => {
      const val = survey[column];
      if (val !== undefined && val !== null) {
        frequency[val] = (frequency[val] || 0) + 1;
      }
    });

    const total = Object.values(frequency).reduce((a, b) => a + b, 0);
    let chartArray = Object.keys(frequency).map((key) => ({
      name: key,
      percentage: Number(((frequency[key] / total) * 100).toFixed(2)),
      count: frequency[key],
    }));

    // --- ORDERING LOGIC ---
    if (customOrder && customOrder.length > 0) {
      chartArray.sort((a, b) => {
        const indexA = customOrder.indexOf(a.name);
        const indexB = customOrder.indexOf(b.name);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
    } else {
      chartArray.sort((a, b) => a.percentage - b.percentage);
    }

    const medianValue = calcMedian(chartArray.map((e) => e.percentage));
    const maxValue = Math.max(...chartArray.map((e) => e.percentage));

    return { chartData: chartArray, median: medianValue, maxValue };
  }, [data, column, customOrder]);

  if (!chartData.length)
    return <p className="p-4 text-gray-500">No data available</p>;

  const isHorizontal = orientation === "horizontal";

  /**
   * [UI_LOGIC]: domainMax
   * Functionality: Ensures the chart axis always has some "breathing room" by setting
   * a minimum scale of 45% or rounding up to the nearest 10th.
   */
  const domainMax = maxValue < 45 ? 45 : Math.ceil(maxValue / 10) * 10;

  const tooltipContent = (tooltipProps) => {
    const sortedPayload = sortTooltipPayload(tooltipProps.payload, customOrder);
    return <CustomTooltip {...tooltipProps} payload={sortedPayload} />;
  };

  return (
    <div className="w-full h-full bg-white rounded-xl p-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{ top: 10, right: 30, left: 70, bottom: 10 }}
        >
          <CartesianGrid
            stroke="#e5e7eb"
            strokeDasharray="3 3"
            horizontal={!isHorizontal}
            vertical={isHorizontal}
          />

          {isHorizontal ? (
            /* --- HORIZONTAL LAYOUT (Vertical Bars) --- */
            <>
              <XAxis
                type="number"
                unit="%"
                domain={[0, domainMax]}
                tick={{ fill: "#1e293b" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                tick={{ fill: "#1e293b" }}
              />
              <Tooltip content={tooltipContent} />
              <Bar
                radius={[0, 6, 6, 0]}
                barSize={DEFAULT_BAR_SIZE}
                dataKey="percentage"
                fill="#184e77"
              />
              {showReferenceLine && (
                <ReferenceLine
                  x={median}
                  stroke="red"
                  strokeWidth={3}
                  label="Median"
                />
              )}
            </>
          ) : (
            /* --- VERTICAL LAYOUT (Horizontal Bars) --- */
            <>
              <XAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#1e293b" }}
              />
              <YAxis
                type="number"
                unit="%"
                domain={[0, domainMax]}
                tick={{ fill: "#1e293b" }}
              />
              <Tooltip content={tooltipContent} />
              <Bar
                radius={[6, 6, 0, 0]}
                barSize={DEFAULT_BAR_SIZE}
                dataKey="percentage"
                fill="#184e77"
              />
              {showReferenceLine && (
                <ReferenceLine
                  y={median}
                  stroke="red"
                  strokeWidth={3}
                  label="Median"
                />
              )}
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
