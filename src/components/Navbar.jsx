import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/services", label: "Services" },
  { to: "/visa-map", label: "Carte Visa" },
  { to: "/visa-scoring", label: "Scoring IA" },
  { to: "/suivi", label: "Suivi dossier" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const isActive = (to) => pathname === to;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--gray-200)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        {/* ── Logo ── */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background:
                "linear-gradient(135deg, var(--blue-700), var(--blue-500))",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            }}
          >
            <span
              style={{
                color: "white",
                fontWeight: 800,
                fontSize: 16,
                fontFamily: "var(--font-heading)",
              }}
            >
              TM
            </span>
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: 18,
                color: "var(--blue-800)",
              }}
            >
              Travel<span style={{ color: "var(--blue-500)" }}>Mundo</span>
            </span>
            <div
              style={{ fontSize: 10, color: "var(--gray-500)", marginTop: -2 }}
            >
              Visa & Passeport
            </div>
          </div>
        </Link>

        {/* ── Desktop Links ── */}
        <ul
          style={{
            display: "flex",
            gap: 2,
            listStyle: "none",
            alignItems: "center",
          }}
          className="nav-links-desktop"
        >
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                style={{
                  padding: "7px 13px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "var(--font-heading)",
                  color: isActive(l.to) ? "var(--blue-600)" : "var(--gray-600)",
                  background: isActive(l.to) ? "var(--blue-50)" : "transparent",
                  transition: "all 0.15s",
                  display: "block",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(l.to)) {
                    e.target.style.color = "var(--blue-600)";
                    e.target.style.background = "var(--gray-100)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(l.to)) {
                    e.target.style.color = "var(--gray-600)";
                    e.target.style.background = "transparent";
                  }
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right actions ── */}
        <div
          style={{ display: "flex", gap: 10, alignItems: "center" }}
          className="nav-links-desktop"
        >
          {user ? (
            <>
              <Link
                to="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                  color: "var(--blue-700)",
                  fontWeight: 600,
                  fontFamily: "var(--font-heading)",
                }}
              >
                <FiUser size={15} /> {user.nom}
              </Link>
              <button
                onClick={logout}
                className="btn-ghost"
                style={{ padding: "8px 16px", fontSize: 13 }}
              >
                <FiLogOut size={14} /> Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="btn-primary"
              style={{ padding: "9px 20px", fontSize: 14 }}
            >
              <FiLogIn size={15} /> Espace Admin
            </Link>
          )}
        </div>

        {/* ── Mobile burger ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-burger"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            color: "var(--gray-700)",
          }}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div
          style={{
            background: "white",
            borderTop: "1px solid var(--gray-100)",
            padding: "8px 24px 20px",
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "11px 0",
                borderBottom: "1px solid var(--gray-100)",
                color: isActive(l.to) ? "var(--blue-600)" : "var(--gray-700)",
                fontWeight: 500,
                fontSize: 15,
                fontFamily: "var(--font-heading)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: 16 }}>
            <Link
              to="/dashboard"
              className="btn-primary"
              onClick={() => setMenuOpen(false)}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <FiLogIn size={15} /> Espace Admin
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .nav-links-desktop { display: none !important; }
          .nav-burger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
