import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

const QUICK_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/visa-map", label: "Carte Visa interactive" },
  { to: "/visa-scoring", label: "Scoring IA" },
  { to: "/suivi", label: "Suivi de dossier" },
  { to: "/a-propos", label: "À propos" },
];

const SERVICES_LINKS = [
  "Visa Schengen",
  "Visa USA",
  "Passeport ",
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--gray-900)",
        color: "var(--gray-400)",
        padding: "64px 0 0",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 48,
            marginBottom: 56,
          }}
        >
          {/* ── Brand ── */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  background:
                    "linear-gradient(135deg, var(--blue-700), var(--blue-500))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>
                  TM
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "white",
                }}
              >
                Travel<span style={{ color: "var(--blue-400)" }}>Mundo</span>
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                maxWidth: 240,
                marginBottom: 20,
              }}
            >
              Agence spécialisée dans les services administratifs visa et
              passeport.
            </p>
            <div
              style={{
                display: "inline-block",
                background: "rgba(37,99,235,0.2)",
                border: "1px solid rgba(96,165,250,0.3)",
                color: "var(--blue-300)",
                padding: "5px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Agréé — Services officiels
            </div>
          </div>

          {/* ── Quick links ── */}
          <div>
            <h4
              style={{
                color: "white",
                fontFamily: "var(--font-heading)",
                fontSize: 15,
                marginBottom: 18,
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: "none" }}>
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to} style={{ marginBottom: 10 }}>
                  <Link
                    to={to}
                    style={{
                      fontSize: 14,
                      color: "var(--gray-400)",
                      transition: "color 0.15s",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--blue-400)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--gray-400)")
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ── */}
          <div>
            <h4
              style={{
                color: "white",
                fontFamily: "var(--font-heading)",
                fontSize: 15,
                marginBottom: 18,
              }}
            >
              Nos services
            </h4>
            <ul style={{ listStyle: "none" }}>
              {SERVICES_LINKS.map((s) => (
                <li key={s} style={{ marginBottom: 10 }}>
                  <Link
                    to="/services"
                    style={{
                      fontSize: 14,
                      color: "var(--gray-400)",
                      transition: "color 0.15s",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--blue-400)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--gray-400)")
                    }
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4
              style={{
                color: "white",
                fontFamily: "var(--font-heading)",
                fontSize: 15,
                marginBottom: 18,
              }}
            >
              Contact
            </h4>
            {[
              {
                icon: <FiMapPin size={14} />,
                text: "Lac 1 ,Tunis , Crystal Palace Building, 3ème étage",
              },
              { icon: <FiPhone size={14} />, text: "+216 71 000 000" },
              { icon: <FiMail size={14} />, text: "contact@travelmundo.tn" },
              { icon: <FiClock size={14} />, text: "Lun–Ven : 8h30 – 17h30" },
            ].map(({ icon, text }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 12,
                  fontSize: 14,
                }}
              >
                <span
                  style={{
                    color: "var(--blue-400)",
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "20px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} Travel Mundo. Tous droits réservés.
          </p>
          <p style={{ fontSize: 12, color: "var(--gray-600)" }}>
            Plateforme non affiliée aux portails officiels gouvernementaux.
          </p>
        </div>
      </div>
    </footer>
  );
}
