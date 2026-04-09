import { useState } from "react";
import {
  FiUser,
  FiDollarSign,
  FiFolder,
  FiAward,
  FiAlertCircle,
  FiCheckCircle,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import { calculerScoreVisa } from "../services/scoring";

const NATIONALITES = [
  "Tunisie",
  "Maroc",
  "Algérie",
  "France",
  "Belgique",
  "Canada",
  "Sénégal",
  "Côte d'Ivoire",
];
const DESTINATIONS = [
  "France (Schengen)",
  "États-Unis",
  "Canada",
  "Royaume-Uni",
  "Australie",
  "Allemagne (Schengen)",
  "Italie (Schengen)",
];
const TYPES_VISA = ["Tourisme", "Affaires", "Études", "Famille", "Transit"];
const EMPLOIS = [
  "CDI",
  "CDD",
  "Indépendant",
  "Étudiant",
  "Retraité",
  "Sans emploi",
];
const DOCS_LISTE = [
  "Passeport valide +6 mois",
  "Relevé bancaire 3 mois",
  "Justificatif d'emploi / contrat",
  "Assurance voyage",
  "Réservation hôtel / hébergement",
  "Billet aller-retour",
  "Certificat de travail ou inscription",
  "Invitation officielle",
];

const FORM_INITIAL = {
  nationalite: "",
  destination: "",
  typeVisa: "",
  revenu: "",
  voyages: "",
  emploi: "",
  docs: [],
};

function StepIndicator({ step }) {
  const steps = [
    { num: 1, label: "Profil", icon: <FiUser size={14} /> },
    { num: 2, label: "Finances", icon: <FiDollarSign size={14} /> },
    { num: 3, label: "Documents", icon: <FiFolder size={14} /> },
    { num: 4, label: "Résultat", icon: <FiAward size={14} /> },
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 0,
        marginBottom: 40,
        flexWrap: "wrap",
      }}
    >
      {steps.map((s, i) => (
        <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background:
                  step > s.num
                    ? "var(--blue-600)"
                    : step === s.num
                      ? "var(--blue-600)"
                      : "var(--gray-200)",
                color: step >= s.num ? "white" : "var(--gray-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
                border:
                  step === s.num
                    ? "3px solid var(--blue-200)"
                    : "3px solid transparent",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {step > s.num ? <FiCheckCircle size={16} /> : s.num}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: step >= s.num ? "var(--blue-700)" : "var(--gray-400)",
              }}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 60,
                height: 2,
                margin: "0 4px",
                marginTop: -18,
                background:
                  step > s.num ? "var(--blue-400)" : "var(--gray-200)",
                transition: "background 0.3s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function VisaScoring() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(FORM_INITIAL);
  const [resultat, setResultat] = useState(null);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const toggleDoc = (d) =>
    setField(
      "docs",
      form.docs.includes(d)
        ? form.docs.filter((x) => x !== d)
        : [...form.docs, d],
    );

  const analyser = () => {
    const r = calculerScoreVisa(form);
    setResultat(r);
    setStep(4);
  };

  const recommencer = () => {
    setForm(FORM_INITIAL);
    setResultat(null);
    setStep(1);
  };

  const step1Valid = form.nationalite && form.destination && form.typeVisa;
  const step2Valid = form.revenu && form.emploi && form.voyages !== "";

  return (
    <div
      style={{
        padding: "60px 0 88px",
        minHeight: "80vh",
        background: "var(--gray-50)",
      }}
    >
      <div className="container">
        <div className="section-header">
          <span className="badge">Intelligence Artificielle</span>
          <h1 className="section-title">Scoring Visa Readiness</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Analysez votre profil en 3 étapes et recevez un score personnalisé
            avec des recommandations concrètes.
          </p>
        </div>

        <StepIndicator step={step} />

        <div
          style={{
            maxWidth: 580,
            margin: "0 auto",
            background: "white",
            borderRadius: "var(--radius-lg)",
            padding: "40px 40px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--gray-200)",
          }}
        >
          {/* ── Étape 1 : Profil ── */}
          {step === 1 && (
            <div>
              <h3
                style={{
                  marginBottom: 28,
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--blue-700)",
                }}
              >
                <FiUser /> Votre profil de voyage
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {[
                  {
                    label: "Votre nationalité",
                    key: "nationalite",
                    options: NATIONALITES,
                    placeholder: "Sélectionner votre nationalité",
                  },
                  {
                    label: "Destination souhaitée",
                    key: "destination",
                    options: DESTINATIONS,
                    placeholder: "Sélectionner la destination",
                  },
                  {
                    label: "Type de visa",
                    key: "typeVisa",
                    options: TYPES_VISA,
                    placeholder: "Sélectionner le type de visa",
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="label">{field.label}</label>
                    <select
                      value={form[field.key]}
                      onChange={(e) => setField(field.key, e.target.value)}
                      className="input-field"
                      style={{ cursor: "pointer" }}
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  className="btn-primary"
                  disabled={!step1Valid}
                  onClick={() => setStep(2)}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: 4,
                  }}
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* ── Étape 2 : Finances ── */}
          {step === 2 && (
            <div>
              <h3
                style={{
                  marginBottom: 28,
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--blue-700)",
                }}
              >
                <FiDollarSign /> Situation financière & professionnelle
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 22 }}
              >
                <div>
                  <label className="label">
                    Revenu mensuel net (USD ou équivalent)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="ex: 2 500"
                    value={form.revenu}
                    onChange={(e) => setField("revenu", e.target.value)}
                    className="input-field"
                  />
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--gray-500)",
                      marginTop: 5,
                    }}
                  >
                    Indiquez votre revenu mensuel net en USD ou équivalent
                  </p>
                </div>

                <div>
                  <label className="label">Situation professionnelle</label>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginTop: 4,
                    }}
                  >
                    {EMPLOIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setField("emploi", e)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 8,
                          fontSize: 13,
                          border:
                            form.emploi === e
                              ? "2px solid var(--blue-600)"
                              : "1.5px solid var(--gray-200)",
                          background:
                            form.emploi === e ? "var(--blue-50)" : "white",
                          color:
                            form.emploi === e
                              ? "var(--blue-700)"
                              : "var(--gray-700)",
                          cursor: "pointer",
                          fontWeight: 500,
                          transition: "all 0.15s",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">
                    Nombre de voyages à l'étranger (5 dernières années)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="ex: 3"
                    value={form.voyages}
                    onChange={(e) => setField("voyages", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="btn-ghost"
                    onClick={() => setStep(1)}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    ← Retour
                  </button>
                  <button
                    className="btn-primary"
                    disabled={!step2Valid}
                    onClick={() => setStep(3)}
                    style={{ flex: 2, justifyContent: "center" }}
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Étape 3 : Documents ── */}
          {step === 3 && (
            <div>
              <h3
                style={{
                  marginBottom: 8,
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--blue-700)",
                }}
              >
                <FiFolder /> Documents disponibles
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--gray-600)",
                  marginBottom: 22,
                }}
              >
                Cochez les documents que vous possédez actuellement :
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 28,
                }}
              >
                {DOCS_LISTE.map((d) => (
                  <label
                    key={d}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "11px 14px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: form.docs.includes(d)
                        ? "1.5px solid var(--blue-400)"
                        : "1.5px solid var(--gray-200)",
                      background: form.docs.includes(d)
                        ? "var(--blue-50)"
                        : "white",
                      transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.docs.includes(d)}
                      onChange={() => toggleDoc(d)}
                      style={{ accentColor: "var(--blue-600)", marginTop: 2 }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--gray-700)",
                        lineHeight: 1.4,
                      }}
                    >
                      {d}
                    </span>
                  </label>
                ))}
              </div>

              <div
                style={{
                  background: "var(--blue-50)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: 13,
                  color: "var(--blue-800)",
                  marginBottom: 24,
                }}
              >
                <strong>{form.docs.length}</strong> document(s) sélectionné(s)
                sur {DOCS_LISTE.length}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn-ghost"
                  onClick={() => setStep(2)}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  ← Retour
                </button>
                <button
                  className="btn-primary"
                  onClick={analyser}
                  style={{ flex: 2, justifyContent: "center" }}
                >
                  <FiAward size={15} /> Analyser mon dossier
                </button>
              </div>
            </div>
          )}

          {/* ── Étape 4 : Résultat ── */}
          {step === 4 && resultat && (
            <div>
              <h3
                style={{
                  textAlign: "center",
                  marginBottom: 28,
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                }}
              >
                Votre Visa Readiness Score
              </h3>

              {/* Gauge circulaire */}
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  border: `12px solid ${resultat.couleur}`,
                  margin: "0 auto 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                  boxShadow: `0 0 32px ${resultat.couleur}28`,
                  transition: "all 0.5s ease",
                }}
              >
                <span
                  style={{
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: resultat.couleur,
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1,
                  }}
                >
                  {resultat.score}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--gray-500)",
                    marginTop: 2,
                  }}
                >
                  / 100
                </span>
              </div>

              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <span
                  style={{
                    display: "inline-block",
                    background: resultat.couleur + "18",
                    color: resultat.couleur,
                    padding: "6px 20px",
                    borderRadius: 20,
                    fontWeight: 800,
                    fontSize: 15,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {resultat.niveau}
                </span>
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    color: "var(--gray-700)",
                    maxWidth: 360,
                    margin: "10px auto 0",
                  }}
                >
                  {resultat.conseil}
                </p>
              </div>

              {/* Points forts */}
              {resultat.pointsForts.length > 0 && (
                <div
                  style={{
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    borderRadius: 12,
                    padding: "16px 20px",
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#166534",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 14,
                    }}
                  >
                    <FiCheckCircle /> Points forts
                  </p>
                  {resultat.pointsForts.map((p, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: 13,
                        color: "#15803D",
                        paddingLeft: 16,
                        borderLeft: "3px solid #4ADE80",
                        marginBottom: 8,
                        lineHeight: 1.55,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* Points à améliorer */}
              {resultat.recommandations.length > 0 && (
                <div
                  style={{
                    background: "#FFF7ED",
                    border: "1px solid #FED7AA",
                    borderRadius: 12,
                    padding: "16px 20px",
                    marginBottom: 24,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#92400E",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 14,
                    }}
                  >
                    <FiAlertCircle /> Points à renforcer
                  </p>
                  {resultat.recommandations.map((r, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: 13,
                        color: "#78350F",
                        paddingLeft: 16,
                        borderLeft: "3px solid #FB923C",
                        marginBottom: 8,
                        lineHeight: 1.55,
                      }}
                    >
                      {r}
                    </p>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn-ghost"
                  onClick={recommencer}
                  style={{ flex: 1, justifyContent: "center", fontSize: 13 }}
                >
                  <FiRefreshCw size={14} /> Recommencer
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 2, justifyContent: "center" }}
                  onClick={() =>
                    alert("Fonctionnalité PDF disponible avec le backend.")
                  }
                >
                  <FiDownload size={14} /> Télécharger le rapport
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
