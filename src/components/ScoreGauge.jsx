// src/components/ScoreGauge.jsx
// Composant réutilisable : jauge circulaire pour afficher un score

export default function ScoreGauge({ score, couleur, niveau, size = 160 }) {
  const strokeWidth = size * 0.075;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

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
          {/* Piste de fond */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--gray-200)"
            strokeWidth={strokeWidth}
          />
          {/* Arc du score */}
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

        {/* Texte centré */}
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
            {score}
          </span>
          <span
            style={{
              fontSize: size * 0.08,
              color: "var(--gray-400)",
              marginTop: 2,
            }}
          >
            / 100
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
