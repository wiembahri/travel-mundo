import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FAKE_DOSSIERS } from "../services/dossiers";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiLogOut,
  FiRefreshCw,
  FiFilter,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const DOSSIERS_LIST = Object.values(FAKE_DOSSIERS);

const MONTHLY_DATA = [
  { mois: "Sep", dossiers: 28 },
  { mois: "Oct", dossiers: 35 },
  { mois: "Nov", dossiers: 42 },
  { mois: "Déc", dossiers: 38 },
  { mois: "Jan", dossiers: 55 },
  { mois: "Fév", dossiers: 61 },
];

const SERVICES_DATA = [
  { name: "Schengen", value: 45 },
  { name: "Passeport", value: 30 },
  { name: "USA", value: 15 },
  { name: "Canada", value: 10 },
];

const STATUS_COLORS = {
  "En attente": { bg: "#FFF7ED", color: "#C2410C", dot: "#F97316" },
  "En cours de traitement": { bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  Terminé: { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
};

const STATS_CARDS = [
  {
    label: "Total dossiers",
    value: "127",
    icon: <FiFileText size={20} />,
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
  },
  {
    label: "Terminés",
    value: "89",
    icon: <FiCheckCircle size={20} />,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    label: "En cours",
    value: "31",
    icon: <FiLoader size={20} />,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    label: "En attente",
    value: "7",
    icon: <FiClock size={20} />,
    color: "#D97706",
    bg: "#FFFBEB",
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [dossiers, setDossiers] = useState(DOSSIERS_LIST);

  const filtered =
    filterStatus === "Tous"
      ? dossiers
      : dossiers.filter((d) => d.statut === filterStatus);

  const updateStatut = (ref, newStatut) => {
    setDossiers((prev) =>
      prev.map((d) => (d.reference === ref ? { ...d, statut: newStatut } : d)),
    );
  };

  return (
    <div
      style={{
        padding: "40px 0 80px",
        background: "var(--gray-50)",
        minHeight: "80vh",
      }}
    >
      <div className="container">
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: 4 }}>
              Tableau de bord
            </h1>
            <p style={{ color: "var(--gray-600)", fontSize: 14 }}>
              Bienvenue, <strong>{user?.nom}</strong> — vue d'ensemble des
              opérations
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost" onClick={() => {}}>
              <FiRefreshCw size={14} /> Actualiser
            </button>
            <button
              className="btn-outline"
              onClick={logout}
              style={{ fontSize: 14, padding: "9px 18px" }}
            >
              <FiLogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {STATS_CARDS.map((s, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-md)",
                padding: "20px 22px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: s.bg,
                  color: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <p
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: s.color,
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--gray-600)",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 36,
          }}
          className="charts-grid"
        >
          {/* Volume mensuel */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-md)",
              padding: "24px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                marginBottom: 20,
                fontFamily: "var(--font-heading)",
              }}
            >
              Volume mensuel des dossiers
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="dossiers"
                  stroke="var(--blue-600)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--blue-600)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par service */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-md)",
              padding: "24px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                marginBottom: 20,
                fontFamily: "var(--font-heading)",
              }}
            >
              Répartition par service
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SERVICES_DATA} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="var(--blue-500)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Gestion dossiers ── */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--gray-200)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
          {/* Entête tableau */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--gray-200)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h3 style={{ fontSize: 16, fontFamily: "var(--font-heading)" }}>
              Gestion des dossiers
            </h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <FiFilter size={14} color="var(--gray-500)" />
              {["Tous", "En attente", "En cours de traitement", "Terminé"].map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      border:
                        filterStatus === f
                          ? "1.5px solid var(--blue-600)"
                          : "1.5px solid var(--gray-200)",
                      background:
                        filterStatus === f ? "var(--blue-50)" : "white",
                      color:
                        filterStatus === f
                          ? "var(--blue-700)"
                          : "var(--gray-600)",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "all 0.15s",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--gray-50)" }}>
                  {[
                    "Référence",
                    "Client",
                    "Service",
                    "Date",
                    "Statut",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--gray-500)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid var(--gray-200)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const st =
                    STATUS_COLORS[d.statut] || STATUS_COLORS["En attente"];
                  return (
                    <tr
                      key={d.reference}
                      style={{
                        borderBottom: "1px solid var(--gray-100)",
                        background: i % 2 === 0 ? "white" : "var(--gray-50)",
                        transition: "background 0.15s",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--blue-700)",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {d.reference}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: 14,
                          color: "var(--gray-800)",
                        }}
                      >
                        {d.nom}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: 13,
                          color: "var(--gray-600)",
                        }}
                      >
                        {d.service}
                      </td>
                      <td
                        style={{
                          padding: "14px 20px",
                          fontSize: 13,
                          color: "var(--gray-500)",
                        }}
                      >
                        {d.dateCreation}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: st.bg,
                            color: st.color,
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            fontFamily: "var(--font-heading)",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: st.dot,
                            }}
                          />
                          {d.statut}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <select
                          value={d.statut}
                          onChange={(e) =>
                            updateStatut(d.reference, e.target.value)
                          }
                          style={{
                            fontSize: 12,
                            padding: "5px 10px",
                            border: "1.5px solid var(--gray-200)",
                            borderRadius: 6,
                            background: "white",
                            cursor: "pointer",
                            outline: "none",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          <option>En attente</option>
                          <option>En cours de traitement</option>
                          <option>Terminé</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "var(--gray-500)",
                fontSize: 14,
              }}
            >
              Aucun dossier trouvé pour ce filtre.
            </div>
          )}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .charts-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
