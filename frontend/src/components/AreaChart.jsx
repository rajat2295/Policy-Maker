import React from "react";

export const AreaChart = () => {
  return (
    <div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart width={500} height={400} data={data}></AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
