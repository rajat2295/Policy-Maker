import React, { useEffect } from "react";
import {
  AreaChart,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  XAxis,
  Rectangle,
  CartesianGrid,
  Text,
} from "recharts";
export const BarGraph = ({ data, column = "how_often_use" }) => {
  const [howOften, setHowOften] = React.useState([]);
  useEffect(() => {
    let frequency = {};
    if (howOften.length) return;
    const temp = [];
    // console.log("data", data);
    data.forEach((survey) => {
      if (survey[column]) {
        frequency[survey[column]] = frequency[survey[column]]
          ? frequency[survey[column]] + 1
          : 1;
      }
    });
    console.log("frequency", frequency);
    const total = Object.values(frequency).reduce((a, b) => a + b, 0);
    Object.keys(frequency).forEach((key) => {
      frequency[key] = ((frequency[key] / total) * 100).toFixed(2);
    });
    Object.keys(frequency).forEach((key) => {
      temp.push({ name: key, percentage: frequency[key] });
    });
    console.log("temp", temp);

    setHowOften([...temp]);
    // setHowOften();
    // console.log("howOften", howOften
  }, [data]);
  //   console.log("howOften", howOften);

  return (
    <ResponsiveContainer width="100%" height="95%">
      <BarChart
        width={500}
        height={100}
        data={howOften}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" tick={{ fill: "white" }} />
        <YAxis unit="%" tick={{ fill: "white" }} yAxisId="left" />
        <Tooltip
          cursor={{ stroke: "#d9ed92", strokeWidth: 4 }}
          contentStyle={{ color: "yellow", stroke: "blue" }}
          labelStyle={{ color: "green", fontSize: 12 }}
        />
        <CartesianGrid yAxisId="left" />

        {/* <Legend /> */}
        <Bar
          yAxisId="left"
          dataKey="percentage"
          fill="#168aad"
          unit="%"
          padding={{ left: 20, right: 20 }}
          activeBar={
            <Rectangle color="#b5e48c" fill="#52b69a" stroke="#1a759f" />
          }
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
