// Placed above the BarGraph component
export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  // Show all bars in the series if many
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e0e5ec",
        borderRadius: 7,
        padding: "1em",
        boxShadow: "0 2px 8px #e5e7eb80",
      }}
    >
      <div style={{ fontWeight: 500, color: "black", marginBottom: 3 }}>
        {label}
      </div>
      {payload.map((entry, idx) => (
        <div
          key={idx}
          style={{
            color: "#22306d", // dark blue for numbers
            fontWeight: 500,
            fontSize: "1em",
            lineHeight: 1.4,
            marginBottom: 2,
            marginTop: 2,
          }}
        >
          {entry.dataKey === "percentage"
            ? `percentage : ${entry.value}%`
            : `${entry.dataKey}: ${entry.value}`}
        </div>
      ))}
    </div>
  );
};
