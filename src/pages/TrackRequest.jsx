import { useState } from "react";
import { FiSearch, FiAlertCircle } from "react-icons/fi";
import { FAKE_DOSSIERS } from "../services/dossiers";
import StatusTracker from "../components/StatusTracker";

const STATUS_STYLES = {
  Completed: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  "In Progress": {
    bg: "#EFF6FF",
    color: "#1D4ED8",
    border: "#BFDBFE",
  },
  Pending: { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
};

export default function TrackRequest() {
  const [query, setQuery] = useState("");
  const [application, setApplication] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setNotFound(false);
    setApplication(null);

    await new Promise((r) => setTimeout(r, 600));

    const data = FAKE_DOSSIERS[query.toUpperCase().trim()];
    if (data) {
      setApplication(data);
    } else {
      setNotFound(true);
    }

    setLoading(false);
  };

  const statusStyle = application
    ? STATUS_STYLES[application.status] || STATUS_STYLES.Pending
    : null;

  const doneSteps = application
    ? application.steps.filter((s) => s.done).length
    : 0;
  const totalSteps = application ? application.steps.length : 0;
  const progress = application ? Math.round((doneSteps / totalSteps) * 100) : 0;

  return (
    <div
      style={{
        padding: "60px 0 88px",
        minHeight: "80vh",
        background: "var(--gray-50)",
      }}
    >
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="section-header">
          <span className="badge">Real-time tracking</span>
          <h1 className="section-title">Track your application</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Enter the reference number you received by email to check the
            current status of your application.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            background: "white",
            borderRadius: "var(--radius-md)",
            border: "1.5px solid var(--gray-200)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
            marginBottom: 36,
          }}
        >
          <input
            type="text"
            placeholder="Reference number — e.g. TM-2024-001"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 15,
              padding: "14px 20px",
              fontFamily: "var(--font-body)",
              color: "var(--gray-800)",
              background: "transparent",
            }}
          />
          <button
            className="btn-primary"
            onClick={search}
            disabled={loading || !query.trim()}
            style={{ borderRadius: 0, padding: "0 28px", fontSize: 14 }}
          >
            {loading ? (
              "Searching..."
            ) : (
              <>
                <FiSearch size={15} style={{ marginRight: 6 }} />
                Search
              </>
            )}
          </button>
        </div>

        {notFound && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "var(--radius-md)",
              padding: "20px 24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              color: "#991B1B",
              marginBottom: 20,
            }}
          >
            <FiAlertCircle size={20} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p
                style={{
                  fontWeight: 700,
                  marginBottom: 4,
                  fontFamily: "var(--font-heading)",
                }}
              >
                Application not found
              </p>
              <p style={{ fontSize: 14 }}>
                No application was found for reference{" "}
                <strong>"{query}"</strong>. Please check the number you received
                in your confirmation email.
              </p>
            </div>
          </div>
        )}

        {application && statusStyle && (
          <div
            style={{
              background: "white",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--gray-200)",
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, var(--blue-900), var(--blue-700))",
                padding: "28px 32px",
                color: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 14,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      opacity: 0.75,
                      marginBottom: 4,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Reference {application.reference}
                  </p>
                  <h3
                    style={{
                      color: "white",
                      fontSize: "1.3rem",
                      marginBottom: 6,
                    }}
                  >
                    {application.name}
                  </h3>
                  <p style={{ opacity: 0.88, fontSize: 14 }}>
                    {application.service}
                  </p>
                  <p style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>
                    Submitted on {application.createdAt}
                  </p>
                </div>

                <div
                  style={{
                    display: "inline-block",
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                    padding: "7px 18px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {application.status}
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    opacity: 0.75,
                    marginBottom: 8,
                  }}
                >
                  <span>Application progress</span>
                  <span>
                    {doneSteps}/{totalSteps} steps
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "white",
                      borderRadius: 3,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ padding: "32px 32px 24px" }}>
              <h4
                style={{
                  marginBottom: 24,
                  fontFamily: "var(--font-heading)",
                  color: "var(--gray-700)",
                  fontSize: 15,
                }}
              >
                Detailed progress
              </h4>
              <StatusTracker
                steps={application.steps}
                status={application.status}
              />
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 28,
            background: "var(--blue-50)",
            border: "1px solid var(--blue-200)",
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 13,
            color: "var(--blue-900)",
          }}
        >
          <strong>Demo:</strong> Try with{" "}
          {["TM-2024-001", "TM-2024-002", "TM-2024-003"].map((ref, i) => (
            <span key={ref}>
              <button
                onClick={() => setQuery(ref)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--blue-600)",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                {ref}
              </button>
              {i < 2 ? ", " : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
