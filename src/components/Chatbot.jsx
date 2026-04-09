import { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from "react-icons/fi";

const FAQS = [
  {
    mots: ["schengen", "europe", "visa europe", "france", "italie", "espagne"],
    reponse:
      "Pour un visa Schengen, il vous faut : passeport valide 6 mois, formulaire de demande, photo biométrique, relevés bancaires (3 mois), justificatif d'hébergement et assurance voyage. Le délai moyen est de 15 jours.",
  },
  {
    mots: ["passeport", "renouveler", "renouvellement", "biométrique"],
    reponse:
      "Pour un passeport biométrique, préparez : acte de naissance, CIN en cours de validité, ancien passeport (si renouvellement), 2 photos récentes et le formulaire officiel. Délai : environ 10 jours ouvrables.",
  },
  {
    mots: ["usa", "états-unis", "amérique", "américain"],
    reponse:
      "Le visa USA (B1/B2) nécessite : formulaire DS-160, confirmation de RDV ambassade, preuve financière, preuves de liens avec votre pays d'origine. L'entretien à l'ambassade est obligatoire.",
  },
  {
    mots: ["canada", "canadien"],
    reponse:
      "Pour un visa Canada, il faut : formulaire IMM 5257, preuve de fonds suffisants, biométrie, et une invitation si vous visitez de la famille. Délai moyen : 28 jours ouvrables.",
  },
  {
    mots: ["suivi", "dossier", "état", "statut", "référence"],
    reponse:
      'Pour suivre votre dossier, rendez-vous dans la section "Suivi dossier" du menu et entrez votre numéro de référence (format TM-AAAA-XXX) reçu par email lors de votre dépôt.',
  },
  {
    mots: ["score", "scoring", "analyse", "chances", "prêt", "readiness"],
    reponse:
      'Notre outil Scoring IA analyse votre profil (nationalité, finances, historique voyages, documents) et vous donne un score de 0 à 100 avec des recommandations personnalisées. Accédez-y via "Scoring IA" dans le menu.',
  },
  {
    mots: ["délai", "combien", "temps", "durée", "attente"],
    reponse:
      "Les délais varient selon le visa : Schengen (15 jours), Passeport (10 jours), USA (30-60 jours), Canada (28 jours). Ces délais sont indicatifs et peuvent varier selon la période.",
  },
  {
    mots: ["prix", "tarif", "coût", "frais", "payer"],
    reponse:
      "Les frais dépendent du service. Contactez-nous directement au +216 71 000 000 ou via la page Contact pour obtenir un devis personnalisé selon votre situation.",
  },
  {
    mots: ["rendez-vous", "rdv", "rencontrer", "visiter", "bureau"],
    reponse:
      "Notre bureau est situé Avenue Habib Bourguiba, Tunis. Horaires : Lun-Ven 8h30-17h30. Vous pouvez aussi nous contacter via la page Contact pour prendre rendez-vous.",
  },
];

const QUICK_QUESTIONS = [
  "Documents visa Schengen ?",
  "Comment suivre mon dossier ?",
  "Délai passeport biométrique ?",
  "Comment fonctionne le scoring ?",
];

function getBotReply(message) {
  const msg = message.toLowerCase().trim();
  for (const faq of FAQS) {
    if (faq.mots.some((m) => msg.includes(m))) {
      return faq.reponse;
    }
  }
  return "Je n'ai pas trouvé de réponse précise à votre question. Je vous recommande de nous contacter directement au +216 71 000 000 ou de passer par la page Contact. Nos agents sont disponibles Lun-Ven de 8h30 à 17h30.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bonjour ! Je suis l'assistant virtuel Travel Mundo 👋\nComment puis-je vous aider aujourd'hui ?",
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) setUnread(0);
  }, [open]);

  const sendMessage = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    const now = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((m) => [...m, { from: "user", text: msg, time: now }]);
    setTyping(true);
    setTimeout(
      () => {
        const reply = getBotReply(msg);
        setMessages((m) => [...m, { from: "bot", text: reply, time: now }]);
        setTyping(false);
        if (!open) setUnread((u) => u + 1);
      },
      1000 + Math.random() * 500,
    );
  };

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, var(--blue-700), var(--blue-500))",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,99,235,0.45)",
          zIndex: 2000,
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
        {!open && unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#EF4444",
              color: "white",
              width: 20,
              height: 20,
              borderRadius: "50%",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {/* ── Chat window ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 28,
            width: 360,
            maxHeight: 520,
            background: "white",
            borderRadius: 20,
            boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1999,
            border: "1px solid var(--gray-200)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--blue-800), var(--blue-600))",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiMessageCircle color="white" size={16} />
              </div>
              <div>
                <p
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Assistant Travel Mundo
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 11,
                    marginTop: 1,
                  }}
                >
                  Répond en quelques secondes
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 8,
                padding: 6,
                cursor: "pointer",
                color: "white",
              }}
            >
              <FiMinimize2 size={14} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "var(--gray-50)",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    borderRadius:
                      m.from === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background: m.from === "user" ? "var(--blue-600)" : "white",
                    color: m.from === "user" ? "white" : "var(--gray-800)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    boxShadow: "var(--shadow-sm)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--gray-400)",
                    marginTop: 4,
                    paddingLeft: 4,
                  }}
                >
                  {m.time}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div
                  style={{
                    background: "white",
                    padding: "12px 16px",
                    borderRadius: "16px 16px 16px 4px",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div
                      key={i}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "var(--blue-400)",
                        animation: `bounce 1s infinite ${delay}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div
            style={{
              padding: "8px 12px",
              borderTop: "1px solid var(--gray-100)",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              background: "white",
            }}
          >
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                style={{
                  background: "var(--blue-50)",
                  color: "var(--blue-700)",
                  border: "1px solid var(--blue-200)",
                  borderRadius: 20,
                  padding: "5px 11px",
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--blue-100)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--blue-50)")
                }
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid var(--gray-200)",
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: "white",
            }}
          >
            <input
              type="text"
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                border: "1.5px solid var(--gray-200)",
                borderRadius: 20,
                padding: "9px 16px",
                fontSize: 13,
                outline: "none",
                fontFamily: "var(--font-body)",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--blue-400)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--gray-200)")}
            />
            <button
              onClick={() => sendMessage()}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--blue-600)",
                color: "white",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--blue-700)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--blue-600)")
              }
            >
              <FiSend size={15} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
