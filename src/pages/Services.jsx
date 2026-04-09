import { FiExternalLink, FiClock, FiCheck } from "react-icons/fi";

const SERVICES = [
  {
    titre: "Visa Schengen",
    description:
      "Court séjour jusqu'à 90 jours dans les 27 pays de l'espace Schengen.",
    docs: [
      "Passeport valide 6 mois minimum",
      "Formulaire de demande Schengen",
      "Photos biométriques récentes",
      "Justificatif d'hébergement",
      "Assurance voyage (30 000 €)",
      "Relevés bancaires 3 derniers mois",
    ],
    delai: "15 jours ouvrables",
    frais: "80 €",
    lien: "https://france-visas.gouv.fr",
    couleur: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    titre: "Passeport biométrique",
    description: "Demande ou renouvellement de passeport biométrique tunisien.",
    docs: [
      "Acte de naissance original",
      "CIN en cours de validité",
      "Ancien passeport (renouvellement)",
      "2 photos d'identité récentes",
      "Formulaire officiel rempli",
    ],
    delai: "10 jours ouvrables",
    frais: "Variable selon urgence",
    lien: "https://mypassportcenter.com/",
    couleur: "#7C3AED",
    bg: "#FDF4FF",
  },
  {
    titre: "Visa USA (B1/B2)",
    description: "Visa non-immigrant pour affaires ou tourisme aux États-Unis.",
    docs: [
      "Formulaire DS-160 complété",
      "Confirmation de RDV ambassade",
      "Preuve de situation financière",
      "Preuves de liens avec le pays",
      "Passeport biométrique valide",
    ],
    delai: "30 à 60 jours",
    frais: "185 USD",
    lien: "https://usimmigrationassistance.com/apply/?gadid=773046734052&gad_campaignid=23001904453",
    couleur: "#DC2626",
    bg: "#FEF2F2",
  },
  {
    titre: "Visa Canada",
    description: "Visa visiteur ou autorisation d'étude pour le Canada.",
    docs: [
      "Formulaire IMM 5257",
      "Preuve de fonds suffisants",
      "Invitation (si applicable)",
      "Biométrie au centre VFS",
      "Passeport valide",
    ],
    delai: "28 jours ouvrables",
    frais: "100 CAD",
    lien: "https://www.canada.ca/fr/immigration",
    couleur: "#D97706",
    bg: "#FFFBEB",
  },
  {
    titre: "Visa Royaume-Uni",
    description: "Standard Visitor Visa pour le Royaume-Uni post-Brexit.",
    docs: [
      "Passeport biométrique",
      "Formulaire en ligne Gov.uk",
      "Relevé bancaire 3 mois",
      "Lettre d'invitation ou réservation",
      "Biométrie UK Visa Center",
    ],
    delai: "15 à 20 jours",
    frais: "115 GBP",
    lien: "https://www.gov.uk/apply-uk-visa",
    couleur: "#0891B2",
    bg: "#ECFEFF",
  },
  {
    titre: "Visa Australie",
    description: "eVisitor ou Visitor Visa pour l'Australie via ImmiAccount.",
    docs: [
      "Passeport valide 6 mois",
      "Formulaire en ligne ImmiAccount",
      "Preuve de séjour",
      "Capacité financière",
      "Assurance santé",
    ],
    delai: "20 à 30 jours",
    frais: "145 AUD",
    lien: "https://immi.homeaffairs.gov.au",
    couleur: "#059669",
    bg: "#ECFDF5",
  },
];

export default function Services() {
  return (
    <div
      style={{
        padding: "60px 0 88px",
        background: "var(--gray-50)",
        minHeight: "80vh",
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="badge">Services Travel Mundo</span>
          <h1 className="section-title">Nos services visa & passeport</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Accédez directement aux portails officiels depuis notre plateforme.
            Nous vous guidons sur les documents requis pour chaque destination.
          </p>
        </div>

        {/* Bannière information */}
        <div
          style={{
            background: "var(--blue-50)",
            border: "1px solid var(--blue-200)",
            borderRadius: "var(--radius-md)",
            padding: "16px 24px",
            marginBottom: 40,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            fontSize: 14,
            color: "var(--blue-800)",
          }}
        >
          <span style={{ fontSize: 18 }}>ℹ️</span>
          <span>
            <strong>Architecture non-intrusive :</strong> Travel Mundo ne
            modifie aucun portail officiel. Les boutons "Accéder au portail"
            vous redirigent vers les sites gouvernementaux officiels.
          </span>
        </div>

        {/* Grille services */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {SERVICES.map((s, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--gray-200)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              {/* Bandeau couleur */}
              <div
                style={{
                  background: s.couleur,
                  padding: "20px 24px",
                  color: "white",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    fontSize: "1.15rem",
                    fontFamily: "var(--font-heading)",
                    marginBottom: 6,
                  }}
                >
                  {s.titre}
                </h3>
                <p style={{ fontSize: 13, opacity: 0.88, lineHeight: 1.5 }}>
                  {s.description}
                </p>
              </div>

              {/* Corps */}
              <div style={{ padding: "20px 24px", flexGrow: 1 }}>
                {/* Documents */}
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--gray-500)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 12,
                  }}
                >
                  Documents requis
                </p>
                <ul style={{ listStyle: "none", marginBottom: 18 }}>
                  {s.docs.map((d, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "4px 0",
                        fontSize: 13,
                        color: "var(--gray-700)",
                      }}
                    >
                      <FiCheck
                        size={13}
                        color={s.couleur}
                        style={{ marginTop: 2, flexShrink: 0 }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Infos rapides */}
                <div style={{ display: "flex", gap: 10 }}>
                  <div
                    style={{
                      flex: 1,
                      background: s.bg,
                      borderRadius: 8,
                      padding: "8px 12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        color: "var(--gray-500)",
                        marginBottom: 2,
                      }}
                    >
                      <FiClock size={11} /> Délai
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: s.couleur,
                      }}
                    >
                      {s.delai}
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: "var(--gray-50)",
                      borderRadius: 8,
                      padding: "8px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--gray-500)",
                        marginBottom: 2,
                      }}
                    >
                      Frais consulaires
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--gray-700)",
                      }}
                    >
                      {s.frais}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "0 24px 20px", display: "flex", gap: 10 }}>
                <a
                  href={s.lien}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    background: s.couleur,
                    fontSize: 13,
                    padding: "10px 16px",
                  }}
                >
                  <FiExternalLink size={14} /> Portail officiel
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
