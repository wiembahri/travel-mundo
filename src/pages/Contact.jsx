import { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";

const INFOS = [
  {
    icon: <FiMapPin size={20} />,
    titre: "Adresse",
    val: "Avenue Habib Bourguiba, Tunis 1001, Tunisie",
    color: "var(--blue-600)",
  },
  {
    icon: <FiPhone size={20} />,
    titre: "Téléphone",
    val: "+216 71 000 000",
    color: "#059669",
  },
  {
    icon: <FiMail size={20} />,
    titre: "Email",
    val: "contact@travelmundo.tn",
    color: "#7C3AED",
  },
  {
    icon: <FiClock size={20} />,
    titre: "Horaires",
    val: "Lun–Ven : 8h30 – 17h30 | Sam : 9h – 13h",
    color: "#D97706",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

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
          <span className="badge">Contactez-nous</span>
          <h1 className="section-title">Nous sommes là pour vous</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Une question sur votre visa ? Besoin d'accompagnement ? Notre équipe
            répond sous 24h ouvrables.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
            gap: 32,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* ── Infos de contact ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {INFOS.map((info, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  border: "1px solid var(--gray-200)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: info.color + "14",
                    color: info.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {info.icon}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--gray-500)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 4,
                    }}
                  >
                    {info.titre}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--gray-800)",
                      lineHeight: 1.5,
                    }}
                  >
                    {info.val}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Formulaire ── */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              padding: "36px 36px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {sent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#F0FDF4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <FiCheckCircle size={28} color="#16A34A" />
                </div>
                <h3
                  style={{
                    marginBottom: 10,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Message envoyé !
                </h3>
                <p
                  style={{
                    color: "var(--gray-600)",
                    fontSize: 14,
                    marginBottom: 24,
                  }}
                >
                  Merci pour votre message. Notre équipe vous répondra sous 24h
                  ouvrables.
                </p>
                <button
                  className="btn-outline"
                  onClick={() => {
                    setSent(false);
                    setForm({ nom: "", email: "", sujet: "", message: "" });
                  }}
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontFamily: "var(--font-heading)",
                    marginBottom: 4,
                  }}
                >
                  Envoyez-nous un message
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label className="label">Nom complet</label>
                    <input
                      className="input-field"
                      type="text"
                      placeholder="Votre nom"
                      value={form.nom}
                      required
                      onChange={(e) =>
                        setForm({ ...form, nom: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      className="input-field"
                      type="email"
                      placeholder="votre@email.com"
                      value={form.email}
                      required
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Sujet</label>
                  <select
                    className="input-field"
                    value={form.sujet}
                    required
                    onChange={(e) =>
                      setForm({ ...form, sujet: e.target.value })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option>Demande de visa Schengen</option>
                    <option>Renouvellement passeport</option>
                    <option>Visa USA / Canada / UK</option>
                    <option>Suivi de dossier</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="label">Message</label>
                  <textarea
                    className="input-field"
                    placeholder="Décrivez votre demande ou question..."
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    style={{
                      resize: "vertical",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "13px",
                  }}
                >
                  {loading ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <FiSend size={15} /> Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
