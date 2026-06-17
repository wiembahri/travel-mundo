import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import {
  FiSearch,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiInfo,
  FiArrowRight,
} from "react-icons/fi";
import { FAKE_DOSSIERS } from "../services/dossiers";
import StatusTracker from "../components/StatusTracker";
import { useLanguage } from "../context/LanguageContext";

const STATUS_STYLES = {
  Completed: {
    bg: "#ECFDF3",
    color: "#027A48",
    border: "#ABEFC6",
    icon: <FiCheckCircle size={16} />,
    label: "Preparation ready",
  },
  "In Progress": {
    bg: "#EFF8FF",
    color: "#175CD3",
    border: "#B2DDFF",
    icon: <FiClock size={16} />,
    label: "Preparation review",
  },
  Pending: {
    bg: "#FFF7ED",
    color: "#C2410C",
    border: "#FED7AA",
    icon: <FiInfo size={16} />,
    label: "Pending update",
  },
  Incomplete: {
    bg: "#FEF3F2",
    color: "#B42318",
    border: "#FECDCA",
    icon: <FiAlertCircle size={16} />,
    label: "Needs support items",
  },
  Rejected: {
    bg: "#FEF3F2",
    color: "#B42318",
    border: "#FECDCA",
    icon: <FiAlertCircle size={16} />,
    label: "Needs review",
  },
};

const DEMO_REFERENCES = [
  { reference: "TM-2024-001", service: "ESTA", status: "Preparation review" },
  { reference: "TM-2024-002", service: "Passport", status: "Preparation ready" },
  { reference: "TM-2024-003", service: "Visa", status: "Pending update" },
  { reference: "TM-2024-004", service: "ETA", status: "Needs support items" },
  { reference: "TM-2024-005", service: "Visa", status: "Needs review" },
];

export default function TrackRequest() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [application, setApplication] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async (forcedQuery) => {
    const finalQuery = (forcedQuery ?? query).toUpperCase().trim();
    if (!finalQuery) return;

    setLoading(true);
    setNotFound(false);
    setApplication(null);

    await new Promise((r) => setTimeout(r, 700));

    const data = FAKE_DOSSIERS[finalQuery];

    if (data) {
      setApplication(data);
      setQuery(finalQuery);
    } else {
      setNotFound(true);
      setQuery(finalQuery);
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

  const readiness = useMemo(() => {
    if (!application) return 0;

    let extra = 0;

    if (application.status === "Completed") extra = 15;
    if (application.status === "In Progress") extra = 8;
    if (application.status === "Pending") extra = 4;

    return Math.min(progress + extra, 100);
  }, [application, progress]);

  const readinessMeta = useMemo(() => {
    if (readiness >= 85) {
      return {
        label: "Almost Ready",
        color: "#027A48",
        bg: "#ECFDF3",
        border: "#ABEFC6",
      };
    }
    if (readiness >= 50) {
      return {
        label: "On Track",
        color: "#B54708",
        bg: "#FFFAEB",
        border: "#FEDF89",
      };
    }
    return {
      label: "Needs Attention",
      color: "#B42318",
      bg: "#FEF3F2",
      border: "#FECDCA",
    };
  }, [readiness]);

  const smartSuggestions = useMemo(() => {
    if (!application) return [];

    const suggestions = [];

    if (application.status === "Pending") {
      suggestions.push({
        icon: "⏳",
        title: "Waiting for preparation update",
        text: "Your Travel Mundo reference is waiting for the next preparation update.",
      });
    }

    if (application.status === "In Progress") {
      suggestions.push({
        icon: "🚀",
        title: "Preparation review is ongoing",
        text: "Your preparation path is being reviewed. You can monitor the next ready step below.",
      });
    }

    if (application.status === "Completed") {
      suggestions.push({
        icon: "✅",
        title: "Preparation path ready",
        text: "Your preparation path has reached the ready stage. You can continue with the next action.",
      });
    }

    if (application.status === "Incomplete") {
      suggestions.push({
        icon: "!",
        title: "Correction required",
        text: "Your preparation needs a correction or an additional support item before it can move forward.",
      });
    }

    if (application.status === "Rejected") {
      suggestions.push({
        icon: "!",
        title: "Review needed",
        text: "Your preparation path needs review. Check the latest update before taking the next step.",
      });
    }

    if (progress < 50) {
      suggestions.push({
        icon: "📌",
        title: "Follow missing steps",
        text: "Your preparation path is still in the first half of the process. Keep checking upcoming milestones.",
      });
    }

    if (progress >= 50 && progress < 100) {
      suggestions.push({
        icon: "🧭",
        title: "Stay updated",
        text: "You are progressing well. Review your status regularly to catch the next update quickly.",
      });
    }

    if (progress === 100) {
      suggestions.push({
        icon: "🎉",
        title: "Preparation path ready",
        text: "All tracked steps are ready. You can now proceed confidently to the next phase.",
      });
    }

    return suggestions.slice(0, 3);
  }, [application, progress]);

  const smartNotification = useMemo(() => {
    if (!application) return null;

    if (application.status === "Pending") {
      return {
        bg: "#FFF7ED",
        border: "#FED7AA",
        color: "#C2410C",
        text: "Your Travel Mundo reference is currently pending. Please keep it for preparation updates.",
      };
    }

    if (application.status === "In Progress") {
      return {
        bg: "#EFF8FF",
        border: "#B2DDFF",
        color: "#175CD3",
        text: "Good news - your preparation review is active right now.",
      };
    }

    if (application.status === "Completed") {
      return {
        bg: "#ECFDF3",
        border: "#ABEFC6",
        color: "#027A48",
        text: "Your preparation path is ready for the next action.",
      };
    }

    if (application.status === "Incomplete") {
      return {
        bg: "#FEF3F2",
        border: "#FECDCA",
        color: "#B42318",
        text: "Your preparation is missing information. Review the support items before continuing.",
      };
    }

    if (application.status === "Rejected") {
      return {
        bg: "#FEF3F2",
        border: "#FECDCA",
        color: "#B42318",
        text: "Your preparation path needs review. Check the latest update before taking the next step.",
      };
    }

    return null;
  }, [application]);

  return (
    <main
      className="tm-track-page"
      style={{
        minHeight: "100vh",
        background: "var(--tm-bg)",
      }}
    >
      <PageHero
        variant="compact"
        align="center"
        eyebrow={t("track.eyebrow")}
        icon={<FiSearch size={14} />}
        title={t("track.title")}
        description={t("track.text")}
      />

      <section style={{ padding: "42px 0 88px" }}>
        <div className="container" style={{ maxWidth: 840 }}>
          {/* SEARCH CARD */}
          <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(226,232,240,0.9)",
            borderRadius: 24,
            padding: 20,
            boxShadow: "0 20px 45px rgba(15,23,42,0.08)",
            marginBottom: 26,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 260,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#FFFFFF",
                border: "1.5px solid #D0D5DD",
                borderRadius: 16,
                padding: "0 16px",
                boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
              }}
            >
              <FiSearch size={18} color="#667085" />
              <input
                type="text"
                placeholder={t("track.placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  padding: "16px 0",
                  fontSize: 15,
                  color: "#101828",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>

            <button
              className="btn-primary"
              onClick={() => search()}
              disabled={loading || !query.trim()}
              style={{
                minWidth: 160,
                borderRadius: 16,
                padding: "0 24px",
                fontSize: 14,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 10px 25px rgba(37,99,235,0.22)",
                transform: "translateY(0)",
                transition: "all 0.25s ease",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.35)",
                      borderTopColor: "#FFFFFF",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  {t("track.searching")}
                </>
              ) : (
                <>
                  <FiSearch size={15} />
                  {t("track.search")}
                </>
              )}
            </button>
          </div>
        </div>

        {/* NOT FOUND */}
        {notFound && (
          <div
            style={{
              background: "#FEF3F2",
              border: "1px solid #FECDCA",
              borderRadius: 20,
              padding: "18px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              color: "#B42318",
              marginBottom: 24,
              boxShadow: "0 10px 30px rgba(16,24,40,0.04)",
            }}
          >
            <FiAlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p
                style={{
                  fontWeight: 800,
                  marginBottom: 4,
                  fontFamily: "var(--font-heading)",
                }}
              >
                {t("track.notFoundTitle")}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6 }}>
                {t("track.notFoundText")} <strong>"{query}"</strong>
              </p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {application && statusStyle && (
          <>
            {/* TOP SUMMARY GRID */}
            <div
              className="track-summary-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr",
                gap: 18,
                marginBottom: 18,
              }}
            >
              {/* MAIN CARD */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, var(--blue-900), var(--blue-700))",
                  color: "white",
                  borderRadius: 24,
                  padding: "26px 26px 22px",
                  boxShadow: "0 20px 45px rgba(30,64,175,0.25)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        opacity: 0.8,
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: 0,
                      }}
                    >
                      Reference {application.reference}
                    </p>

                    <h2
                      style={{
                        color: "white",
                        fontSize: "1.5rem",
                        marginBottom: 6,
                        lineHeight: 1.2,
                      }}
                    >
                      {application.name}
                    </h2>

                    <p style={{ opacity: 0.9, fontSize: 14 }}>
                      Service path: {application.service}
                    </p>
                    <p
                      style={{
                        opacity: 0.7,
                        fontSize: 12,
                        marginTop: 6,
                      }}
                    >
                      Reference created on {application.createdAt}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}`,
                      padding: "8px 16px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    {statusStyle.icon}
                    {statusStyle.label}
                  </div>
                </div>

                <div style={{ marginTop: 22 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      opacity: 0.85,
                      marginBottom: 9,
                    }}
                  >
                    <span>{t("track.progress")}</span>
                    <span>
                      {doneSteps}/{totalSteps} steps
                    </span>
                  </div>

                  <div
                    style={{
                      height: 10,
                      background: "rgba(255,255,255,0.18)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progress}%`,
                        background:
                          "linear-gradient(90deg, #FFFFFF 0%, #BFDBFE 100%)",
                        borderRadius: 999,
                        transition: "width 0.7s ease",
                        boxShadow: "0 0 18px rgba(255,255,255,0.45)",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      opacity: 0.95,
                    }}
                  >
                    {progress}% ready -{" "}
                    {progress === 100
                      ? "all preparation stages are ready"
                      : progress >= 70
                        ? "you are close to readiness"
                        : progress >= 40
                          ? "your preparation is progressing well"
                          : "your preparation is still in the early stages"}
                  </div>
                </div>
              </div>

              {/* READINESS CARD */}
              <div
                style={{
                  background: "white",
                  border: "1px solid #E4E7EC",
                  borderRadius: 24,
                  padding: "24px 22px",
                  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 24,
                    marginBottom: 16,
                    background: "rgba(37,99,235,0.08)",
                  }}
                >
                  ✈️
                </div>

                <p
                  style={{
                    fontSize: 13,
                    color: "#667085",
                    fontWeight: 700,
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 0,
                  }}
                >
                  {t("track.readiness")}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "#101828",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {readiness}%
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: "#667085",
                      marginBottom: 4,
                    }}
                  >
                    ready
                  </span>
                </div>

                <div
                  style={{
                    display: "inline-block",
                    background: readinessMeta.bg,
                    color: readinessMeta.color,
                    border: `1px solid ${readinessMeta.border}`,
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 800,
                    marginBottom: 14,
                  }}
                >
                  {readinessMeta.label}
                </div>

                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "#475467",
                    margin: 0,
                  }}
                >
                  This score is based on your current preparation status and the
                  number of ready steps in the service path.
                </p>
              </div>
            </div>

            {/* SMART NOTIFICATION */}
            {smartNotification && (
              <div
                style={{
                  background: smartNotification.bg,
                  border: `1px solid ${smartNotification.border}`,
                  borderRadius: 18,
                  padding: "16px 18px",
                  color: smartNotification.color,
                  marginBottom: 18,
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: "0 10px 24px rgba(16,24,40,0.04)",
                }}
              >
                {smartNotification.text}
              </div>
            )}

            {/* CONTENT GRID */}
            <div
              className="track-content-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1.15fr 0.85fr",
                gap: 18,
              }}
            >
              {/* STATUS TRACKER */}
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid #EAECF0",
                  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "22px 24px",
                    borderBottom: "1px solid #F2F4F7",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        marginBottom: 4,
                        fontSize: 18,
                        color: "#101828",
                      }}
                    >
                      {t("track.detailedProgress")}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        color: "#667085",
                      }}
                    >
                      {t("track.detailedText")}
                    </p>
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#175CD3",
                      background: "#EFF8FF",
                      border: "1px solid #B2DDFF",
                      padding: "8px 12px",
                      borderRadius: 999,
                    }}
                  >
                    {progress}% ready
                  </div>
                </div>

                <div style={{ padding: "26px 24px 20px" }}>
                  <StatusTracker
                    steps={application.steps}
                    status={application.status}
                  />
                </div>
              </div>

              {/* SMART SUGGESTIONS */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: 24,
                    border: "1px solid #EAECF0",
                    padding: "22px",
                    boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: 8,
                      fontSize: 18,
                      color: "#101828",
                    }}
                  >
                    {t("track.recommendations")}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#667085",
                      lineHeight: 1.6,
                      marginBottom: 18,
                    }}
                  >
                    {t("track.recommendationsText")}
                  </p>

                  <div style={{ display: "grid", gap: 12 }}>
                    {smartSuggestions.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          border: "1px solid #EAECF0",
                          borderRadius: 18,
                          padding: "14px 14px",
                          background: "#FCFCFD",
                          transition: "all 0.25s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 12,
                              background: "#EFF6FF",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 18,
                              flexShrink: 0,
                            }}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <p
                              style={{
                                margin: "0 0 4px",
                                fontWeight: 800,
                                color: "#101828",
                                fontSize: 14,
                              }}
                            >
                              {item.title}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 13,
                                lineHeight: 1.6,
                                color: "#475467",
                              }}
                            >
                              {item.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(14,165,233,0.10))",
                    border: "1px solid rgba(59,130,246,0.16)",
                    borderRadius: 24,
                    padding: 22,
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      letterSpacing: 0,
                      textTransform: "uppercase",
                      color: "#1D4ED8",
                      marginBottom: 10,
                    }}
                  >
                    {t("track.insight")}
                  </p>

                  <h4
                    style={{
                      fontSize: 18,
                      color: "#0F172A",
                      marginBottom: 8,
                    }}
                  >
                    Your preparation has {doneSteps} of {totalSteps} steps ready
                  </h4>

                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "#334155",
                      marginBottom: 0,
                    }}
                  >
                    This gives you a clear picture of where the Travel Mundo
                    reference stands right now and what remains before the
                    preparation path is ready.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* DEMO */}
        <div
          style={{
            marginTop: 28,
            background: "white",
            border: "1px solid #E4E7EC",
            borderRadius: 20,
            padding: "18px 20px",
            boxShadow: "0 14px 32px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#1D4ED8",
                  textTransform: "uppercase",
                  letterSpacing: 0,
                  marginBottom: 6,
                }}
              >
                {t("track.demo")}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#475467",
                }}
              >
                {t("track.demoText")}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {DEMO_REFERENCES.map((item) => (
                <button
                  key={item.reference}
                  onClick={() => search(item.reference)}
                  style={{
                    display: "inline-flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    gap: 8,
                    border: "1px solid #BFDBFE",
                    background: "#EFF6FF",
                    color: "#1D4ED8",
                    fontWeight: 800,
                    fontSize: 13,
                    borderRadius: 999,
                    padding: "10px 14px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {item.reference}
                    <FiArrowRight size={14} />
                  </span>
                  <span
                    style={{
                      color: "#475467",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {item.service} - {item.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* simple spinner animation */}
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 900px) {
            .track-summary-grid,
            .track-content-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 560px) {
            .btn-primary {
              width: 100%;
            }
          }
        `}
      </style>
    </main>
  );
}
