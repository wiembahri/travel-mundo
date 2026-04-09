// src/components/StatusTracker.jsx
// Composant réutilisable : timeline de suivi d'un dossier

import { FiCheckCircle, FiClock, FiLoader } from "react-icons/fi";

export default function StatusTracker({ steps, statut }) {
  const firstPendingIndex = steps.findIndex((s) => !s.done);

  return (
    <div>
      {steps.map((step, i) => {
        const isActive =
          i === firstPendingIndex && statut === "En cours de traitement";
        return (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            {/* Icône + ligne */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: step.done
                    ? "var(--blue-600)"
                    : isActive
                      ? "var(--blue-100)"
                      : "var(--gray-200)",
                  border: isActive
                    ? "2px solid var(--blue-400)"
                    : "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.3s",
                }}
              >
                {step.done ? (
                  <FiCheckCircle color="white" size={16} />
                ) : isActive ? (
                  <FiLoader color="var(--blue-500)" size={14} />
                ) : (
                  <FiClock color="var(--gray-400)" size={13} />
                )}
              </div>

              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flexGrow: 1,
                    minHeight: 28,
                    background: step.done
                      ? "var(--blue-200)"
                      : "var(--gray-200)",
                    margin: "4px 0",
                    transition: "background 0.3s",
                  }}
                />
              )}
            </div>

            {/* Contenu */}
            <div style={{ paddingBottom: 20, paddingTop: 8, flex: 1 }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: step.done
                    ? "var(--gray-800)"
                    : isActive
                      ? "var(--blue-700)"
                      : "var(--gray-400)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {step.label}
                {isActive && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      background: "var(--blue-100)",
                      color: "var(--blue-700)",
                      padding: "2px 8px",
                      borderRadius: 10,
                      fontWeight: 600,
                    }}
                  >
                    En cours
                  </span>
                )}
              </p>
              {step.date ? (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--gray-500)",
                    marginTop: 3,
                  }}
                >
                  Complété le {step.date}
                </p>
              ) : (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--gray-400)",
                    marginTop: 3,
                    fontStyle: "italic",
                  }}
                >
                  {isActive ? "En traitement..." : "En attente"}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
