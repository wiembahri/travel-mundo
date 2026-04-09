import { FiTarget, FiEye, FiAward, FiUsers } from "react-icons/fi";

const VALEURS = [
  {
    icon: <FiTarget size={22} />,
    titre: "Notre mission",
    desc: "Simplifier et automatiser les démarches administratives liées aux visas et passeports .",
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
  },
  {
    icon: <FiEye size={22} />,
    titre: "Notre vision",
    desc: "Devenir la référence en Tunisie pour les services administratifs intelligents, accessibles et transparents.",
    color: "#7C3AED",
    bg: "#FDF4FF",
  },
  {
    icon: <FiAward size={22} />,
    titre: "Notre expertise",
    desc: "Plus de 3 ans d'expérience dans les procédures visa et passeport, avec une connaissance approfondie des exigences consulaires.",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: <FiUsers size={22} />,
    titre: "Notre équipe",
    desc: "Une équipe de 20 experts agréés, formés sur les procédures de plus de 120 pays, disponibles pour vous accompagner.",
    color: "#059669",
    bg: "#ECFDF5",
  },
];

export default function About() {
  return (
    <div style={{ background: "var(--gray-50)", minHeight: "80vh" }}>
      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(135deg, var(--blue-900), var(--blue-700))",
          padding: "80px 0",
          textAlign: "center",
          color: "white",
        }}
      >
        <div className="container">
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            À propos de nous
          </span>
          <h1
            style={{
              color: "white",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              marginBottom: 16,
              marginTop: 8,
            }}
          >
            Travel Mundo, votre partenaire
            <br />
            de confiance depuis 2022
          </h1>
          <p
            style={{
              color: "var(--blue-200)",
              fontSize: "1.1rem",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Agence privée spécialisée dans les services administratifs liés aux
            visas et aux passeports.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="section-header">
            <span className="badge">Nos valeurs</span>
            <h2 className="section-title">Ce qui nous définit</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 24,
            }}
          >
            {VALEURS.map((v, i) => (
              <div key={i} className="card">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: v.bg,
                    color: v.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    marginBottom: 10,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {v.titre}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--gray-600)",
                    lineHeight: 1.65,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
