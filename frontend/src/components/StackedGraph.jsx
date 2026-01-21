import React, { useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { reasonMap } from "../helpers/constants";

/**
 * [EDITABLE_VALUES]: Ordinal Scales & Colors
 * Functionality: Defines the logical sequence and color palette for Likert-scale questions.
 */
const DEFAULT_USEFUL_ORDER = [
  "Not useful at all",
  "Not very useful",
  "Somewhat useful",
  "Very useful",
];

const colorMapUseful = {
  "Not useful at all": "#34a0a4",
  "Not very useful": "#76c893",
  "Somewhat useful": "#168aad",
  "Very useful": "#184e77",
};

/**
 * [HELPER]: Sorting & Legend Rendering
 * Functionality: ensures the Legend and Tooltip entries follow the semantic order
 * (e.g., Negative to Positive) rather than alphabetical or random order.
 */
const makeItemSorter = (order) => (item) => {
  if (!order) return 0;
  const idx = order.indexOf(item.name);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
};

const renderOrderedLegend = (order) => (props) => {
  const { payload } = props;
  if (!payload || !order) return null;
  const sorted = [...payload].sort(
    (a, b) => order.indexOf(a.value) - order.indexOf(b.value)
  );
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {sorted.map((entry, index) => (
        <span
          key={index}
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              backgroundColor: entry.color,
              display: "inline-block",
            }}
          />
          <p style={{ color: entry.color, fontWeight: 500 }}>{entry.value}</p>
        </span>
      ))}
    </div>
  );
};

const calcPercent = (val, total) => {
  if (!total || total === 0) return 0;
  return parseFloat(((val / total) * 100).toFixed(1));
};

/**
 * StackedGraph Component
 * [COMPONENT_DESCRIPTION]: A vertical stacked bar chart that visualizes rankings
 * or sentiment across multiple categories.
 * Use Case: Comparing which policies were ranked "1st" most often,
 * or which topics were rated "Very Useful."
 */
export const StackedGraph = ({
  data,
  graphType = "engagement", // [CONFIGURABLE_TEXT]: Determines which keys to pull from the dataset
  size = "normal", // Functionality: Toggles container height (600px vs 800px)
  seriesOrder, // [NEW_PROP]: Optional custom ordering for the legend
}) => {
  const [filteredData, setFilteredData] = React.useState([]);

  // --- MEMOIZED CONFIGURATION ---
  const reasons = useMemo(() => {
    return reasonMap[graphType] ? Object.keys(reasonMap[graphType]) : [];
  }, [graphType]);

  const grandTotal = useMemo(() => {
    // Logic: Ensure we count unique respondents, even if data rows are duplicated
    const uniqueIDs = new Set(data.map((item) => item.id || item._id));
    return uniqueIDs.size;
  }, [data]);

  const usefulStackOrder = useMemo(() => {
    return graphType === "usefulEcon"
      ? seriesOrder && seriesOrder.length
        ? seriesOrder
        : DEFAULT_USEFUL_ORDER
      : null;
  }, [graphType, seriesOrder]);

  /**
   * [DATA_ENGINE]: useEffect
   * Functionality:
   * 1. De-duplicates incoming data by unique ID.
   * 2. Aggregates responses based on graphType (Sentiment vs Ranking).
   * 3. Calculates the 'sortValue' based on the first item in the order
   * (this ensures the chart is ranked by the strongest sentiment).
   */
  useEffect(() => {
    const uniqueData = Array.from(
      new Map(data.map((item) => [item.id || item._id, item])).values()
    );

    const temp = [];
    let frequency = {};
    let usefulFrequency = {};

    reasons.forEach((reason) => {
      frequency[reason] = { 1: 0, 2: 0, 3: 0, 4: 0 };
      usefulFrequency[reason] = {
        "Somewhat useful": 0,
        "Very useful": 0,
        "Not very useful": 0,
        "Not useful at all": 0,
      };
    });

    if (graphType === "usefulEcon") {
      uniqueData.forEach((survey) => {
        reasons.forEach((reason) => {
          if (
            survey[reason] &&
            usefulFrequency[reason][survey[reason]] !== undefined
          ) {
            usefulFrequency[reason][survey[reason]]++;
          }
        });
      });

      reasons.forEach((policy) => {
        const v1 = usefulFrequency[policy]["Somewhat useful"] || 0;
        const v2 = usefulFrequency[policy]["Very useful"] || 0;
        const v3 = usefulFrequency[policy]["Not very useful"] || 0;
        const v4 = usefulFrequency[policy]["Not useful at all"] || 0;
        const rowTotal = v1 + v2 + v3 + v4;

        temp.push({
          name: reasonMap[graphType][policy],
          totalCount: rowTotal,
          // Sorting Logic: Rank categories by the percentage of "Very useful" responses
          sortValue: calcPercent(
            usefulFrequency[policy][usefulStackOrder[3]],
            rowTotal
          ),
          "Somewhat useful": calcPercent(v1, rowTotal),
          "Very useful": calcPercent(v2, rowTotal),
          "Not very useful": calcPercent(v3, rowTotal),
          "Not useful at all": calcPercent(v4, rowTotal),
        });
      });
    } else {
      /* Logic for Ranking (1st, 2nd, 3rd) */
      uniqueData.forEach((survey) => {
        reasons.forEach((reason) => {
          const rank = Number(survey[reason]);
          if (!isNaN(rank) && frequency[reason][rank] !== undefined) {
            frequency[reason][rank]++;
          }
        });
      });

      reasons.forEach((reason) => {
        const v1 = frequency[reason][1] || 0;
        const v2 = frequency[reason][2] || 0;
        const v3 = frequency[reason][3] || 0;

        temp.push({
          name: reasonMap[graphType][reason],
          totalCount: grandTotal,
          sortValue: calcPercent(v1, grandTotal),
          "1st": calcPercent(v1, grandTotal),
          "2nd": calcPercent(v2, grandTotal),
          "3rd": calcPercent(v3, grandTotal),
        });
      });
    }

    temp.sort((a, b) => (b.sortValue || 0) - (a.sortValue || 0));
    setFilteredData(temp);
  }, [data, graphType, usefulStackOrder, grandTotal, reasons]);

  return (
    <ResponsiveContainer width="100%" height={size === "normal" ? 600 : 800}>
      <BarChart
        layout="vertical"
        data={filteredData}
        margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
        barCategoryGap="25%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(val) => `${val.toFixed(0)}%`}
          tick={{ fill: "#1e293b", fontWeight: 600 }}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={170}
          tick={{ fill: "#1e293b", fontWeight: 600, fontSize: 14 }}
        />

        <Tooltip
          labelFormatter={(label, items) => {
            if (items?.length > 0 && items[0].payload) {
              const { totalCount } = items[0].payload;
              return `${label} (n=${totalCount})`; // Functionality: Shows sample size per row
            }
            return label;
          }}
          formatter={(value) => `${value}%`}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            color: "black",
          }}
          itemSorter={
            graphType === "usefulEcon" && usefulStackOrder
              ? makeItemSorter(usefulStackOrder)
              : undefined
          }
        />

        <Legend
          content={
            graphType === "usefulEcon" && usefulStackOrder
              ? renderOrderedLegend(usefulStackOrder)
              : undefined
          }
        />

        {/* Dynamic Bar Generation */}
        {graphType === "usefulEcon" ? (
          usefulStackOrder.map((label, index) => (
            <Bar
              key={label}
              dataKey={label}
              stackId="a"
              fill={colorMapUseful[label]}
              radius={
                index === usefulStackOrder.length - 1
                  ? [0, 6, 6, 0]
                  : [0, 0, 0, 0]
              }
            />
          ))
        ) : (
          <>
            <Bar dataKey="1st" stackId="a" fill="#184e77" />
            <Bar dataKey="2nd" stackId="a" fill="#168aad" />
            <Bar
              dataKey="3rd"
              stackId="a"
              fill="#76c893"
              radius={[0, 6, 6, 0]}
            />
          </>
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};
