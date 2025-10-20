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

const reasonMap = {
  engagement: {
    reason_why_not_read_1: "Can't access journal articles",
    reason_why_not_read_2: "Don't know where to find",
    reason_why_not_read_3: "Too technical",
    reason_why_not_read_4: "Not relevant",
    reason_why_not_read_5: "Not timely enough",
    reason_why_not_read_6: "Don't trust research",
    reason_why_not_read_7: "No time",
  },
  communication: {
    comm_approach_1: "5-6 page summary",
    comm_approach_2: "1-2 page written summary",
    comm_approach_3: "1-2 page visual summary",
    comm_approach_4: "Slide deck",
    comm_approach_5: "2-sentence summary",
    comm_approach_6: "2-sentence policy recommendation",
    comm_approach_7: "Academic journal article",
  },
};

export const StackedGraph = ({ data, graphType = "engagement" }) => {
  const [filteredData, setFilteredData] = React.useState([]);
  const reasons = Object.keys(reasonMap[graphType]);

  useEffect(() => {
    const temp = [];
    let frequency = {};
    reasons.forEach((reason) => {
      frequency[reason] = { 1: 0, 2: 0, 3: 0 };
    });

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
        sum: frequency[reason][1] + frequency[reason][2] + frequency[reason][3],
      });
    });

    // Sort by the sum of 1st, 2nd, and 3rd (ascending)
    temp.sort((a, b) => b.sum - a.sum);

    // Remove sum before setting state if you don't want it in the data for the chart
    setFilteredData(temp.map(({ sum, ...rest }) => rest));
  }, [data, graphType]);
  return (
    <ResponsiveContainer width="93%">
      <BarChart
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
        <Bar dataKey="1st" stackId="a" fill="#184e77" />
        <Bar dataKey="2nd" stackId="a" fill="#168aad" />
        <Bar dataKey="3rd" stackId="a" fill="#76c893 " radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
