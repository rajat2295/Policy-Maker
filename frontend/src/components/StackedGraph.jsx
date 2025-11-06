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
export const StackedGraph = ({
  data,
  graphType = "engagement",
  size = "normal",
}) => {
  const [filteredData, setFilteredData] = React.useState([]);
  const reasons = Object.keys(reasonMap[graphType]);

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
        temp.push({
          name: reasonMap[graphType][policy],
          "Somewhat useful": usefulFrequency[policy]["Somewhat useful"],
          "Very useful": usefulFrequency[policy]["Very useful"],
          "Not very useful": usefulFrequency[policy]["Not very useful"],
          "Not useful at all": usefulFrequency[policy]["Not useful at all"],
        });
      });
    } else {
      data.forEach((survey) => {
        reasons.forEach((reason) => {
          if (!isNaN(survey[reason])) {
            frequency[reason][survey[reason]] =
              (frequency[reason][survey[reason]] || 0) + 1;
          }
        });
      });
      Object.keys(reasonMap[graphType]).forEach((reason) => {
        temp.push({
          name: reasonMap[graphType][reason],
          "1st": frequency[reason][1],
          "2nd": frequency[reason][2],
          "3rd": frequency[reason][3],
          sum:
            frequency[reason][1] + frequency[reason][2] + frequency[reason][3],
        });
      });
    }
    console.log("Temp data before sort:", temp);
    // Sort by the sum of 1st, 2nd, and 3rd (ascending)
    temp.sort((a, b) => b.sum - a.sum);

    // Remove sum before setting state if you don't want it in the data for the chart
    setFilteredData(temp.map(({ sum, ...rest }) => rest));
  }, [data, graphType]);
  console.log("Filtered Data for StackedGraph:", filteredData);
  const graphHeight = size === "normal" ? 600 : 800;
  return (
    <ResponsiveContainer width="100%" height={graphHeight}>
      <BarChart
        height={graphHeight}
        width={"100%"}
        layout="vertical"
        data={filteredData}
        margin={{
          top: 20,
          right: 30,
          left: 50,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fill: "#1e293b", fontWeight: 600 }} />
        <YAxis
          dataKey="name"
          type="category"
          width={170}
          tick={{ fill: "#1e293b", fontWeight: 600, fontSize: 15 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            color: "black",
            borderRadius: 8,
            border: "none",
          }}
        />
        <Legend />
        {graphType === "usefulEcon" ? (
          <>
            <Bar dataKey="Not useful at all" stackId="a" fill="#34a0a4" />
            <Bar dataKey="Not very useful" stackId="a" fill="#76c893" />

            <Bar dataKey="Somewhat useful" stackId="a" fill="#184e77" />
            <Bar
              dataKey="Very useful"
              stackId="a"
              fill="#168aad"
              radius={[0, 6, 6, 0]}
            />
          </>
        ) : (
          <>
            <Bar dataKey="1st" stackId="a" fill="#184e77" />
            <Bar dataKey="2nd" stackId="a" fill="#168aad" />
            <Bar
              dataKey="3rd"
              stackId="a"
              fill="#76c893 "
              radius={[0, 6, 6, 0]}
            />
          </>
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};
