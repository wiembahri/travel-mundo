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

const APPLICATIONS_LIST = Object.values(FAKE_DOSSIERS);

const MONTHLY_DATA = [
  { month: "Sep", applications: 28 },
  { month: "Oct", applications: 35 },
  { month: "Nov", applications: 42 },
  { month: "Dec", applications: 38 },
  { month: "Jan", applications: 55 },
  { month: "Feb", applications: 61 },
];

const SERVICES_DATA = [
  { name: "Schengen", value: 45 },
  { name: "Passport", value: 30 },
  { name: "U.S. Visa", value: 15 },
  { name: "ETA / ESTA", value: 10 },
];

const STATUS_COLORS = {
  Pending: { bg: "#FFF7ED", color: "#C2410C", dot: "#F97316" },
  "In Progress": { bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  Completed: { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
};

const STATS_CARDS = [
  {
    label: "Total applications",
    value: "127",
    icon: <FiFileText size={20} />,
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
  },
  {
    label: "Completed",
    value: "89",
    icon: <FiCheckCircle size={20} />,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    label: "In progress",
    value: "31",
    icon: <FiLoader size={20} />,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    label: "Pending",
    value: "7",
    icon: <FiClock size={20} />,
    color: "#D97706",
    bg: "#FFFBEB",
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [filterStatus, setFilterStatus] = useState("All");
  const [applications, setApplications] = useState(APPLICATIONS_LIST);

  const filtered =
    filterStatus === "All"
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  const updateStatus = (ref, newStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.reference === ref ? { ...a, status: newStatus } : a)),
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
            <h1 style={{ fontSize: "1.8rem", marginBottom: 4 }}>Dashboard</h1>
            <p style={{ color: "var(--gray-600)", fontSize: 14 }}>
              Welcome, <strong>{user?.nom}</strong> — overview of application
              activity
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost" onClick={() => {}}>
              <FiRefreshCw size={14} /> Refresh
            </button>
            <button
              className="btn-outline"
              onClick={logout}
              style={{ fontSize: 14, padding: "9px 18px" }}
            >
              <FiLogOut size={14} /> Log out
            </button>
          </div>
        </div>

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 36,
          }}
          className="charts-grid"
        >
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
              Monthly application volume
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="var(--blue-600)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--blue-600)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

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
              Applications by service
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

        <div
          style={{
            background: "white",
            border: "1px solid var(--gray-200)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
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
              Application management
            </h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <FiFilter size={14} color="var(--gray-500)" />
              {["All", "Pending", "In Progress", "Completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 20,
                    border:
                      filterStatus === status
                        ? "1.5px solid var(--blue-600)"
                        : "1px solid var(--gray-200)",
                    background:
                      filterStatus === status ? "var(--blue-50)" : "white",
                    color:
                      filterStatus === status
                        ? "var(--blue-700)"
                        : "var(--gray-600)",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--gray-50)" }}>
                  {[
                    "Reference",
                    "Applicant",
                    "Service",
                    "Status",
                    "Created",
                    "Update",
                  ].map((head) => (
                    <th
                      key={head}
                      style={{
                        textAlign: "left",
                        padding: "14px 18px",
                        fontSize: 12,
                        color: "var(--gray-500)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 700,
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const style = STATUS_COLORS[app.status];
                  return (
                    <tr
                      key={app.reference}
                      style={{ borderTop: "1px solid var(--gray-100)" }}
                    >
                      <td style={{ padding: "16px 18px", fontSize: 13 }}>
                        <strong>{app.reference}</strong>
                      </td>
                      <td style={{ padding: "16px 18px", fontSize: 13 }}>
                        {app.name}
                      </td>
                      <td style={{ padding: "16px 18px", fontSize: 13 }}>
                        {app.service}
                      </td>
                      <td style={{ padding: "16px 18px", fontSize: 13 }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: style.bg,
                            color: style.color,
                            padding: "6px 12px",
                            borderRadius: 20,
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: style.dot,
                              display: "inline-block",
                            }}
                          />
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 18px", fontSize: 13 }}>
                        {app.createdAt}
                      </td>
                      <td style={{ padding: "16px 18px", fontSize: 13 }}>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateStatus(app.reference, e.target.value)
                          }
                          className="input-field"
                          style={{ minWidth: 130 }}
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .charts-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
