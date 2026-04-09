import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiMapPin,
  FiFileText,
  FiCpu,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiMapPin size={22} />,
    title: "Carte interactive des visas",
    desc: "Sélectionnez n'importe quel pays sur la carte et obtenez instantanément le type de visa requis, les documents nécessaires et le lien officiel.",
    to: "/visa-map",
    bg: "var(--blue-50)",
    color: "var(--blue-600)",
  },
  {
    icon: <FiCpu size={22} />,
    title: "Scoring IA — Visa Readiness",
    desc: "Analysez votre profil (nationalité, finances, historique) et obtenez un score de 0 à 100 avec des recommandations concrètes pour renforcer votre dossier.",
    to: "/visa-scoring",
    bg: "#F0FDF4",
    color: "#16A34A",
  },
  {
    icon: <FiFileText size={22} />,
    title: "Suivi de dossier en ligne",
    desc: "Suivez l'état de votre demande en temps réel. Chaque changement de statut vous est notifié automatiquement.",
    to: "/suivi",
    bg: "#FFF7ED",
    color: "#EA580C",
  },
  {
    icon: <FiShield size={22} />,
    title: "Services centralisés",
    desc: "Visa Schengen, USA,  et passeport  — tout au même endroit, avec redirection vers les portails officiels.",
    to: "/services",
    bg: "#FDF4FF",
    color: "#9333EA",
  },
];

const STATS = [
  {
    value: "5 000+",
    label: "Dossiers traités",
    icon: <FiFileText size={18} />,
  },
  { value: "120+", label: "Pays couverts", icon: <FiMapPin size={18} /> },
  {
    value: "98%",
    label: "Taux de satisfaction",
    icon: <FiCheckCircle size={18} />,
  },
  { value: "48h", label: "Délai moyen réponse", icon: <FiClock size={18} /> },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Analysez votre profil",
    desc: "Remplissez le formulaire de scoring en 3 étapes. L'IA évalue votre dossier.",
  },
  {
    num: "02",
    title: "Recevez votre rapport",
    desc: "Obtenez un score, les points faibles identifiés et les recommandations précises.",
  },
  {
    num: "03",
    title: "Soumettez votre demande",
    desc: "Accédez au portail officiel correspondant depuis notre plateforme.",
  },
  {
    num: "04",
    title: "Suivez en temps réel",
    desc: "Suivez l'avancement de votre dossier via votre numéro de référence.",
  },
];

export default function Home() {
  return (
    <div>
      {/* ══ HERO ══════════════════════════════════════ */}
      <section
        style={{
          background:
            "linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 55%, var(--blue-500) 100%)",
          padding: "96px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cercles décoratifs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "60%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.025)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 700 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "var(--blue-100)",
                padding: "6px 16px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-heading)",
                marginBottom: 28,
              }}
            >
              <FiShield size={13} /> Agence officielle — Visa & Passeport
            </span>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.12,
                marginBottom: 22,
                fontFamily: "var(--font-heading)",
              }}
            >
              Vos démarches administratives{" "}
              <span
                style={{
                  color: "var(--blue-300)",
                  borderBottom: "3px solid var(--blue-400)",
                  paddingBottom: 2,
                }}
              >
                simplifiées
              </span>{" "}
              avec l'IA
            </h1>

            <p
              style={{
                fontSize: "1.15rem",
                color: "rgba(255,255,255,0.82)",
                maxWidth: 540,
                marginBottom: 40,
                lineHeight: 1.75,
              }}
            >
              Travel Mundo centralise tous vos services visa et passeport avec
              un assistant IA, un scoring de dossier et un suivi en temps réel.
              Aucune modification des portails officiels.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link
                to="/visa-scoring"
                className="btn-primary"
                style={{
                  background: "white",
                  color: "var(--blue-700)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                  fontSize: 15,
                }}
              >
                Analyser mon dossier <FiArrowRight />
              </Link>
              <Link
                to="/services"
                className="btn-outline"
                style={{
                  borderColor: "rgba(255,255,255,0.45)",
                  color: "white",
                }}
              >
                Voir les services
              </Link>
            </div>

            {/* Mini proof */}
            <div
              style={{
                marginTop: 44,
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {[
                "Sans inscription requise",
                "Résultat en 5 minutes",
                "Rapport PDF gratuit",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <FiCheckCircle size={14} color="var(--blue-300)" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════ */}
      <section
        style={{
          background: "white",
          borderBottom: "1px solid var(--gray-200)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "32px 24px",
                  textAlign: "center",
                  borderRight:
                    i < STATS.length - 1 ? "1px solid var(--gray-200)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                    color: "var(--blue-500)",
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "var(--blue-700)",
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--gray-500)",
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════ */}
      <section style={{ padding: "88px 0", background: "var(--gray-50)" }}>
        <div className="container">
          <div className="section-header">
            <span className="badge">Nos fonctionnalités</span>
            <h2 className="section-title">Tout ce dont vous avez besoin</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Une plateforme intelligente qui automatise vos démarches et vous
              guide à chaque étape du processus.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {FEATURES.map((f, i) => (
              <Link key={i} to={f.to} style={{ display: "block" }}>
                <div className="card" style={{ height: "100%" }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      background: f.bg,
                      color: f.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      marginBottom: 10,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--gray-600)",
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
                    {f.desc}
                  </p>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      color: f.color,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    En savoir plus <FiArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════ */}
      <section style={{ padding: "88px 0", background: "white" }}>
        <div className="container">
          <div className="section-header">
            <span className="badge">Comment ça marche</span>
            <h2 className="section-title">Simple en 4 étapes</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              De l'analyse de votre dossier à la décision finale, nous vous
              accompagnons à chaque étape.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 32,
              position: "relative",
            }}
          >
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--blue-700), var(--blue-500))",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: 18,
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    marginBottom: 10,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--gray-600)",
                    lineHeight: 1.65,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════ */}
      <section
        style={{
          padding: "88px 0",
          background:
            "linear-gradient(135deg, var(--blue-900), var(--blue-700))",
          textAlign: "center",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiUsers size={24} color="white" />
            </div>
          </div>
          <h2
            style={{
              color: "white",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              marginBottom: 16,
              fontFamily: "var(--font-heading)",
            }}
          >
            Prêt à simplifier vos démarches ?
          </h2>
          <p
            style={{
              color: "var(--blue-200)",
              marginBottom: 36,
              fontSize: "1.05rem",
              maxWidth: 480,
              margin: "0 auto 36px",
            }}
          >
            Obtenez votre Visa Readiness Report personnalisé en moins de 5
            minutes.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/visa-scoring"
              className="btn-primary"
              style={{
                background: "white",
                color: "var(--blue-700)",
                fontSize: 16,
                padding: "14px 32px",
              }}
            >
              Commencer l'analyse <FiArrowRight />
            </Link>
            <Link
              to="/contact"
              className="btn-outline"
              style={{
                borderColor: "rgba(255,255,255,0.4)",
                color: "white",
                fontSize: 16,
              }}
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
