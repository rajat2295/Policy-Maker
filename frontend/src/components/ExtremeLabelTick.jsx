export const ExtremeLabelTick = ({
  x,
  y,
  payload,
  ticks,
  extremeLeftLabel,
  extremeRightLabel,
}) => {
  const value = payload.value;
  const isFirst = value === ticks[0];
  const isLast = value === ticks[ticks.length - 1];
  return (
    <g>
      {/* Draw the tick number as usual */}
      <text
        x={x}
        y={y + 15}
        textAnchor="middle"
        fill="#1e293b"
        fontWeight={500}
        fontSize={14}
      >
        {value}
      </text>
      {/* Below, add the extreme label for first/last tick ONLY */}
      {isFirst && extremeLeftLabel && (
        <text
          x={x}
          y={y + 35}
          textAnchor="middle"
          fill="#1e293b"
          fontWeight={700}
          fontSize={16}
        >
          {extremeLeftLabel}
        </text>
      )}
      {isLast && extremeRightLabel && (
        <text
          x={x}
          y={y + 35}
          textAnchor="middle"
          fill="#1e293b"
          fontWeight={700}
          fontSize={16}
        >
          {extremeRightLabel}
        </text>
      )}
    </g>
  );
};
