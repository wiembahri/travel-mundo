import { useState } from "react";
import { FiSearch, FiExternalLink, FiInfo } from "react-icons/fi";

// Données visa par pays
const PAYS_DATA = {
  France: {
    drapeau: "🇫🇷",
    region: "Europe",
    typeVisa: "Visa Schengen requis",
    couleur: "#2563EB",
    conditions:
      "Court séjour jusqu'à 90 jours sur 180 jours dans l'espace Schengen.",
    documents: [
      "Passeport valide 6 mois",
      "Formulaire de demande Schengen",
      "Assurance voyage 30 000 €",
      "Relevés bancaires 3 mois",
      "Réservation hôtel",
      "Billet aller-retour",
    ],
    delai: "15 jours ouvrables",
    frais: "80 €",
    lien: "https://usimmigrationassistance.com/apply/?gadid=773046734052&gad_campaignid=23001904453",
  },
  "États-Unis": {
    drapeau: "🇺🇸",
    region: "Amérique du Nord",
    typeVisa: "Visa B1/B2 requis",
    couleur: "#DC2626",
    conditions:
      "Entretien obligatoire à l'ambassade. Visa valable 10 ans, séjour max 6 mois.",
    documents: [
      "Passeport biométrique",
      "Formulaire DS-160",
      "Photo récente",
      "Confirmation RDV ambassade",
      "Preuve financière",
      "Preuves de liens avec le pays",
    ],
    delai: "30 à 60 jours",
    frais: "185 USD",
    lien: "https://usimmigrationassistance.com/apply/?gadid=773046734052&gad_campaignid=23001904453",
  },
  Canada: {
    drapeau: "🇨🇦",
    region: "Amérique du Nord",
    typeVisa: "Visa visiteur requis (AVE)",
    couleur: "#D97706",
    conditions:
      "Autorisation de voyage électronique ou visa visiteur selon le cas.",
    documents: [
      "Passeport valide",
      "Formulaire IMM 5257",
      "Preuve de fonds",
      "Biométrie",
      "Lettre d'invitation (si applicable)",
    ],
    delai: "28 jours ouvrables",
    frais: "100 CAD",
    lien: "https://usimmigrationassistance.com/apply/?gadid=773046734052&gad_campaignid=23001904453",
  },
  "Royaume-Uni": {
    drapeau: "🇬🇧",
    region: "Europe",
    typeVisa: "Standard Visitor Visa requis",
    couleur: "#0891B2",
    conditions:
      "Post-Brexit : visa obligatoire pour les ressortissants tunisiens.",
    documents: [
      "Passeport biométrique",
      "Formulaire Gov.uk",
      "Relevé bancaire 3 mois",
      "Biométrie UK Visa Center",
      "Hébergement confirmé",
    ],
    delai: "15 à 20 jours",
    frais: "115 GBP",
    lien: "https://usimmigrationassistance.com/apply/?gadid=773046734052&gad_campaignid=23001904453",
  },
  Allemagne: {
    drapeau: "🇩🇪",
    region: "Europe",
    typeVisa: "Visa Schengen requis",
    couleur: "#2563EB",
    conditions:
      "Identique au visa Schengen France, via le consulat allemand si destination principale.",
    documents: [
      "Passeport valide 6 mois",
      "Formulaire Schengen",
      "Assurance voyage",
      "Relevés bancaires",
      "Justificatif d'emploi",
    ],
    delai: "15 jours ouvrables",
    frais: "80 €",
    lien: "https://usimmigrationassistance.com/apply/?gadid=773046734052&gad_campaignid=23001904453",
  },
  Australie: {
    drapeau: "🇦🇺",
    region: "Océanie",
    typeVisa: "Visitor Visa requis",
    couleur: "#059669",
    conditions:
      "Visa électronique via ImmiAccount. Séjour max 3 mois par visite.",
    documents: [
      "Passeport valide",
      "Formulaire ImmiAccount",
      "Preuve financière",
      "Réservation",
      "Assurance santé",
    ],
    delai: "20 à 30 jours",
    frais: "145 AUD",
    lien: "https://usimmigrationassistance.com/apply/?gadid=773046734052&gad_campaignid=23001904453",
  },
  Turquie: {
    drapeau: "🇹🇷",
    region: "Moyen-Orient / Europe",
    typeVisa: "e-Visa requis",
    couleur: "#DC2626",
    conditions: "e-Visa disponible en ligne. Simple et rapide.",
    documents: [
      "Passeport valide 6 mois",
      "Adresse email valide",
      "Carte bancaire pour paiement",
    ],
    delai: "1 à 3 jours",
    frais: "50 USD",
    lien: "https://usimmigrationassistance.com/apply/?gadid=773046734052&gad_campaignid=23001904453",
  },
  Tunisie: {
    drapeau: "🇹🇳",
    region: "Afrique du Nord",
    typeVisa: "Aucun visa requis",
    couleur: "#059669",
    conditions: "Vous êtes déjà en Tunisie ! Vous pouvez y résider librement.",
    documents: [],
    delai: "N/A",
    frais: "Gratuit",
    lien: "",
  },
  Maroc: {
    drapeau: "🇲🇦",
    region: "Afrique du Nord",
    typeVisa: "Aucun visa requis",
    couleur: "#059669",
    conditions:
      "Les ressortissants tunisiens peuvent entrer au Maroc sans visa pour un séjour de 90 jours.",
    documents: ["Passeport valide"],
    delai: "Immédiat",
    frais: "Gratuit",
    lien: "",
  },
  Espagne: {
    drapeau: "🇪🇸",
    region: "Europe",
    typeVisa: "Visa Schengen requis",
    couleur: "#2563EB",
    conditions:
      "Visa Schengen via le consulat espagnol si l'Espagne est votre destination principale.",
    documents: [
      "Passeport valide 6 mois",
      "Formulaire Schengen",
      "Assurance voyage 30 000 €",
      "Relevés bancaires",
      "Réservation hôtel / hébergement",
    ],
    delai: "15 jours ouvrables",
    frais: "80 €",
    lien: "https://usimmigrationassistance.com/apply/?gadid=773046734052&gad_campaignid=23001904453",
  },
};

const REGIONS = [
  "Tous",
  "Europe",
  "Amérique du Nord",
  "Océanie",
  "Afrique du Nord",
  "Moyen-Orient / Europe",
];

export default function VisaMap() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const pays = Object.entries(PAYS_DATA);

  const filtered = pays.filter(([nom, data]) => {
    const matchSearch = nom.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === "Tous" || data.region === region;
    return matchSearch && matchRegion;
  });

  const info = selected ? PAYS_DATA[selected] : null;

  return (
    <div
      style={{
        padding: "60px 0 88px",
        background: "var(--gray-50)",
        minHeight: "80vh",
      }}
    >
      <div className="container">
        <div className="section-header">
          <span className="badge">Carte interactive</span>
          <h1 className="section-title">Carte des visas</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Sélectionnez votre destination pour connaître les conditions
            d'entrée, les documents requis et accéder au portail officiel.
          </p>
        </div>

        {/* Filtres */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--gray-200)",
            borderRadius: "var(--radius-md)",
            padding: "20px 24px",
            marginBottom: 32,
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Recherche */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <FiSearch
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--gray-400)",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher un pays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 38 }}
            />
          </div>

          {/* Filtre région */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  border:
                    region === r
                      ? "1.5px solid var(--blue-600)"
                      : "1.5px solid var(--gray-200)",
                  background: region === r ? "var(--blue-600)" : "white",
                  color: region === r ? "white" : "var(--gray-600)",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.15s",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: selected ? "1fr 380px" : "1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ── Grille pays ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 14,
            }}
          >
            {filtered.map(([nom, data]) => (
              <button
                key={nom}
                onClick={() => setSelected(nom === selected ? null : nom)}
                style={{
                  background: "white",
                  border:
                    selected === nom
                      ? `2px solid ${data.couleur}`
                      : "1.5px solid var(--gray-200)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 14px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s",
                  boxShadow:
                    selected === nom
                      ? `0 4px 16px ${data.couleur}22`
                      : "var(--shadow-sm)",
                  transform: selected === nom ? "translateY(-2px)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (selected !== nom) {
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selected !== nom) {
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    e.currentTarget.style.transform = "none";
                  }
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>
                  {data.drapeau}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--gray-800)",
                    fontFamily: "var(--font-heading)",
                    marginBottom: 6,
                  }}
                >
                  {nom}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    background: data.couleur + "14",
                    color: data.couleur,
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  {data.typeVisa.split(" ").slice(0, 2).join(" ")}
                </span>
              </button>
            ))}

            {filtered.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: 48,
                  color: "var(--gray-500)",
                  fontSize: 15,
                }}
              >
                Aucun pays trouvé pour "{search}"
              </div>
            )}
          </div>

          {/* ── Panneau détail ── */}
          {selected && info && (
            <div
              style={{
                background: "white",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-lg)",
                position: "sticky",
                top: 80,
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: info.couleur,
                  padding: "24px 24px",
                  color: "white",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 10 }}>
                  {info.drapeau}
                </div>
                <h3
                  style={{
                    color: "white",
                    fontSize: "1.3rem",
                    marginBottom: 4,
                  }}
                >
                  {selected}
                </h3>
                <p style={{ fontSize: 13, opacity: 0.85 }}>{info.region}</p>
                <div
                  style={{
                    display: "inline-block",
                    marginTop: 10,
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 14px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {info.typeVisa}
                </div>
              </div>

              {/* Corps */}
              <div style={{ padding: "20px 24px" }}>
                {/* Conditions */}
                <div
                  style={{
                    background: "var(--gray-50)",
                    borderRadius: 10,
                    padding: "12px 16px",
                    marginBottom: 18,
                    display: "flex",
                    gap: 10,
                    fontSize: 13,
                  }}
                >
                  <FiInfo
                    size={15}
                    color="var(--blue-500)"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <p style={{ color: "var(--gray-700)", lineHeight: 1.55 }}>
                    {info.conditions}
                  </p>
                </div>

                {/* Documents */}
                {info.documents.length > 0 && (
                  <>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--gray-500)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 10,
                      }}
                    >
                      Documents requis
                    </p>
                    <ul style={{ listStyle: "none", marginBottom: 18 }}>
                      {info.documents.map((d, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "4px 0",
                            fontSize: 13,
                            color: "var(--gray-700)",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: info.couleur,
                              flexShrink: 0,
                            }}
                          />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Délai & frais */}
                <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                  <div
                    style={{
                      flex: 1,
                      background: info.couleur + "10",
                      borderRadius: 10,
                      padding: "10px 14px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--gray-500)",
                        marginBottom: 3,
                      }}
                    >
                      Délai moyen
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: info.couleur,
                      }}
                    >
                      {info.delai}
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: "var(--gray-50)",
                      borderRadius: 10,
                      padding: "10px 14px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--gray-500)",
                        marginBottom: 3,
                      }}
                    >
                      Frais consulaires
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--gray-800)",
                      }}
                    >
                      {info.frais}
                    </p>
                  </div>
                </div>

                {/* Boutons */}
                <div style={{ display: "flex", gap: 10 }}>
                  {info.lien && (
                    <a
                      href={info.lien}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        background: info.couleur,
                        fontSize: 13,
                        padding: "10px",
                      }}
                    >
                      <FiExternalLink size={13} /> Portail officiel
                    </a>
                  )}
                  <button
                    className="btn-ghost"
                    onClick={() => (window.location.href = "/visa-scoring")}
                    style={{ flex: 1, justifyContent: "center", fontSize: 13 }}
                  >
                    Analyser mon dossier
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
