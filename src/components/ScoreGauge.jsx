export default function ScoreGauge({
  score,
  couleur,
  niveau,
  size = 160,
  label = "readiness",
}) {
  const safeScore = Number.isFinite(Number(score))
    ? Math.max(0, Math.min(100, Math.round(Number(score))))
    : 0;
  const strokeWidth = size * 0.075;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--gray-200)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={couleur}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: size * 0.225,
              fontWeight: 800,
              color: couleur,
              fontFamily: "var(--font-heading)",
              lineHeight: 1,
            }}
          >
            {safeScore}%
          </span>
          <span
            style={{
              fontSize: size * 0.08,
              color: "var(--gray-400)",
              marginTop: 2,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      </div>

      {niveau && (
        <span
          style={{
            display: "inline-block",
            background: couleur + "18",
            color: couleur,
            padding: "5px 20px",
            borderRadius: 20,
            fontWeight: 800,
            fontSize: 14,
            fontFamily: "var(--font-heading)",
          }}
        >
          {niveau}
        </span>
      )}
    </div>
  );
}
