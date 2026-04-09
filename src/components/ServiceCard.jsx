// src/components/ServiceCard.jsx
// Carte réutilisable pour afficher un service visa ou passeport

import { FiExternalLink, FiClock, FiCheck } from "react-icons/fi";

export default function ServiceCard({ service }) {
  const { titre, description, docs, delai, frais, lien, couleur, bg } = service;

  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--gray-200)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Bandeau couleur */}
      <div
        style={{ background: couleur, padding: "20px 24px", color: "white" }}
      >
        <h3
          style={{
            color: "white",
            fontSize: "1.1rem",
            fontFamily: "var(--font-heading)",
            marginBottom: 6,
          }}
        >
          {titre}
        </h3>
        <p style={{ fontSize: 13, opacity: 0.88, lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      {/* Documents */}
      <div style={{ padding: "20px 24px", flexGrow: 1 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--gray-500)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 12,
          }}
        >
          Documents requis
        </p>
        <ul style={{ listStyle: "none", marginBottom: 16 }}>
          {docs.map((d, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "3px 0",
                fontSize: 13,
                color: "var(--gray-700)",
              }}
            >
              <FiCheck
                size={13}
                color={couleur}
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              {d}
            </li>
          ))}
        </ul>

        {/* Délai & frais */}
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              flex: 1,
              background: bg || "var(--blue-50)",
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                color: "var(--gray-500)",
                marginBottom: 2,
              }}
            >
              <FiClock size={10} /> Délai
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: couleur }}>
              {delai}
            </p>
          </div>
          <div
            style={{
              flex: 1,
              background: "var(--gray-50)",
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "var(--gray-500)",
                marginBottom: 2,
              }}
            >
              Frais
            </p>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--gray-700)",
              }}
            >
              {frais}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 24px 20px" }}>
        <a
          href={lien}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            background: couleur,
            fontSize: 13,
            padding: "10px",
            width: "100%",
          }}
        >
          <FiExternalLink size={13} /> Portail officiel
        </a>
      </div>
    </div>
  );
}
