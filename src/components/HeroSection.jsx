// src/components/HeroSection.jsx
// Composant réutilisable : section hero pour les pages intérieures

import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function HeroSection({
  badge,
  title,
  highlight,
  subtitle,
  ctaLabel,
  ctaTo,
  ctaSecondLabel,
  ctaSecondTo,
  children,
}) {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 55%, var(--blue-500) 100%)",
        padding: "80px 0 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cercles décoratifs */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        {badge && (
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "var(--blue-100)",
              padding: "5px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-heading)",
              marginBottom: 22,
            }}
          >
            {badge}
          </span>
        )}

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
            marginBottom: 18,
            fontFamily: "var(--font-heading)",
            maxWidth: 700,
            margin: "0 auto 18px",
          }}
        >
          {title}
          {highlight && (
            <span style={{ color: "var(--blue-300)" }}> {highlight}</span>
          )}
        </h1>

        {subtitle && (
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.82)",
              maxWidth: 540,
              margin: "0 auto 36px",
              lineHeight: 1.75,
            }}
          >
            {subtitle}
          </p>
        )}

        {(ctaLabel || ctaSecondLabel) && (
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {ctaLabel && ctaTo && (
              <Link
                to={ctaTo}
                className="btn-primary"
                style={{
                  background: "white",
                  color: "var(--blue-700)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                  fontSize: 15,
                }}
              >
                {ctaLabel} <FiArrowRight />
              </Link>
            )}
            {ctaSecondLabel && ctaSecondTo && (
              <Link
                to={ctaSecondTo}
                className="btn-outline"
                style={{
                  borderColor: "rgba(255,255,255,0.45)",
                  color: "white",
                }}
              >
                {ctaSecondLabel}
              </Link>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
