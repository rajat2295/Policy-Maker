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

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const reasonMap = {
  reason_why_not_read_1: "Can't access journal articles",
  reason_why_not_read_2: "Don't know where to find",
  reason_why_not_read_3: "Too technical",
  reason_why_not_read_4: "Not relevant",
  reason_why_not_read_5: "Not timely enough",
  reason_why_not_read_6: "Don't trust research",
  reason_why_not_read_7: "No time",
};
const reasons = Object.keys(reasonMap);
// console.log("reasons", reasons);

export const StackedGraph = ({ data }) => {
  const [filteredData, setFilteredData] = React.useState([]);
  useEffect(() => {
    const temp = [];
    let frequency = {
      reason_why_not_read_1: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      reason_why_not_read_2: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      reason_why_not_read_3: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      reason_why_not_read_4: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      reason_why_not_read_5: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      reason_why_not_read_6: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      reason_why_not_read_7: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
    };
    data.forEach((survey) => {
      reasons.forEach((reason) => {
        if (!isNaN(survey[reason])) {
          if (isNaN(frequency[reason][survey[reason]])) debugger;
          frequency[reason][survey[reason]] =
            frequency[reason][survey[reason]] !== "undefined"
              ? frequency[reason][survey[reason]] + 1
              : 0;
        }
      });
    });

    Object.keys(reasonMap).forEach((reason) => {
      temp.push({
        name: reasonMap[reason],
        "1st": frequency[reason][1],
        "2nd": frequency[reason][2],
        "3rd": frequency[reason][3],
      });
    });
    setFilteredData([...temp]);
  }, [data]);
  console.log("filteredData", filteredData);
  return (
    <ResponsiveContainer width="100%" height="95%">
      <BarChart
        width={500}
        height={300}
        data={filteredData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: "white" }} fontSize={12} />
        <YAxis tick={{ fill: "white" }} />
        <Tooltip />
        <Legend />
        {/* {Object.values(reasonMap).map((reason) => (
          <Bar dataKey={reason} stackId="a" fill="#8884d8" />
        ))} */}
        <Bar dataKey="1st" stackId="a" fill="#184e77" />
        <Bar dataKey="2nd" stackId="a" fill="#168aad" />
        <Bar dataKey="3rd" stackId="a" fill="#76c893" />
      </BarChart>
    </ResponsiveContainer>
  );
};
