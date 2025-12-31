import React, { useEffect } from "react";
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
export const StackedGraph = ({
  data,
  graphType = "engagement",
  size = "normal",
  seriesOrder,
}) => {
  const [filteredData, setFilteredData] = React.useState([]);
  const reasons = Object.keys(reasonMap[graphType]);

  const usefulStackOrder =
    graphType === "usefulEcon"
      ? seriesOrder && seriesOrder.length
        ? seriesOrder
        : DEFAULT_USEFUL_ORDER
      : null;

  useEffect(() => {
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
      data.forEach((survey) => {
        reasons.forEach((reason) => {
          if (survey[reason]) {
            usefulFrequency[reason][survey[reason]] =
              (usefulFrequency[reason][survey[reason]] || 0) + 1;
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
          totalCount: rowTotal, // SAVED: Sample size for tooltip
          sortValue: calcPercent(
            usefulFrequency[policy][usefulStackOrder[0]],
            rowTotal
          ),
          "Somewhat useful": calcPercent(v1, rowTotal),
          "Very useful": calcPercent(v2, rowTotal),
          "Not very useful": calcPercent(v3, rowTotal),
          "Not useful at all": calcPercent(v4, rowTotal),
        });
      });
    } else {
      data.forEach((survey) => {
        reasons.forEach((reason) => {
          if (!isNaN(survey[reason]) && survey[reason] !== null) {
            frequency[reason][survey[reason]] =
              (frequency[reason][survey[reason]] || 0) + 1;
          }
        });
      });

      Object.keys(reasonMap[graphType]).forEach((reason) => {
        const v1 = frequency[reason][1] || 0;
        const v2 = frequency[reason][2] || 0;
        const v3 = frequency[reason][3] || 0;
        const rowTotal = v1 + v2 + v3;

        temp.push({
          name: reasonMap[graphType][reason],
          totalCount: rowTotal, // SAVED: Sample size for tooltip
          sortValue: calcPercent(v1, rowTotal),
          "1st": calcPercent(v1, rowTotal),
          "2nd": calcPercent(v2, rowTotal),
          "3rd": calcPercent(v3, rowTotal),
        });
      });
    }

    temp.sort((a, b) => (b.sortValue || 0) - (a.sortValue || 0));
    setFilteredData(temp);
  }, [data, graphType, usefulStackOrder]);

  const graphHeight = size === "normal" ? 600 : 800;

  return (
    <ResponsiveContainer width="100%" height={graphHeight}>
      <BarChart
        layout="vertical"
        data={filteredData}
        margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
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

        {/* UPDATED: Tooltip labelFormatter shows "Name (n=X)" */}
        <Tooltip
          // Robust formatter to handle the (n=X) label
          labelFormatter={(label, items) => {
            // Check if items exist and have a payload
            if (items && items.length > 0 && items[0].payload) {
              const { totalCount } = items[0].payload;
              return `${label} (n=${totalCount})`;
            }
            return label;
          }}
          formatter={(value) => `${value}%`}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: 8,
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          // Ensure the tooltip items stay in the correct stack order
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
