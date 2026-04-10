import { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from "react-icons/fi";

const FAQS = [
  {
    words: ["schengen", "europe", "france", "italy", "spain", "schengen visa"],
    reply:
      "For a Schengen Visa application, you usually need a valid passport, an application form, a recent passport photo, supporting travel documents, and financial or administrative documents depending on your case.",
  },
  {
    words: [
      "passport",
      "renew",
      "renewal",
      "new passport",
      "passport application",
    ],
    reply:
      "For passport-related applications, the required documents may depend on whether it is a new application, renewal, or correction. Travel Mundo helps prepare the information and guides you before official submission.",
  },
  {
    words: ["usa", "u.s.", "united states", "us visa", "american visa"],
    reply:
      "For U.S. travel, the required authorization depends on your travel purpose and eligibility. Some travelers may need a U.S. Visa, while others may qualify for ESTA. We help guide you through the correct application path.",
  },
  {
    words: ["esta", "eta", "travel authorization", "electronic authorization"],
    reply:
      "ETA / ESTA services are for electronic travel authorizations. Travel Mundo helps guide you through the form, reviews the information provided, and supports you through the submission steps based on your eligibility.",
  },
  {
    words: ["track", "tracking", "application status", "status", "reference"],
    reply:
      'To track your application, go to the "Track Application" page and enter your reference number in the format TM-2024-001.',
  },
  {
    words: ["processing time", "delay", "how long", "time", "wait"],
    reply:
      "Processing times depend on the type of service and the official procedure involved. Some ETA / ESTA requests are usually processed quickly, while visa and passport applications may take longer depending on the case.",
  },
  {
    words: ["fees", "cost", "price", "payment"],
    reply:
      "Fees vary depending on the type of service and the application involved. For more details, please contact our support team directly.",
  },
  {
    words: ["contact", "support", "help", "email", "phone"],
    reply:
      "You can contact Travel Mundo for application support by email or phone through the Contact page. Our team is available during working hours to assist you.",
  },
  {
    words: [
      "services",
      "what do you offer",
      "what services",
      "application help",
    ],
    reply:
      "Travel Mundo provides support for Schengen Visa, U.S. Visa, Passport, and ETA / ESTA applications through a guided and simplified process.",
  },
];

const QUICK_QUESTIONS = [
  "What documents are needed for a Schengen Visa?",
  "Do I need ESTA or a U.S. Visa?",
  "How can I track my application?",
  "What services do you offer?",
];

function getBotReply(message) {
  const msg = message.toLowerCase().trim();

  for (const faq of FAQS) {
    if (faq.words.some((word) => msg.includes(word))) {
      return faq.reply;
    }
  }

  return "I could not find an exact answer to your question. Please contact our support team through the Contact page for further assistance.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! I’m Travel Mundo’s virtual assistant 👋\nHow can I help you today?",
      time: new Date().toLocaleTimeString("en-US", {
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

    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [...prev, { from: "user", text: msg, time: now }]);
    setTyping(true);

    setTimeout(
      () => {
        const reply = getBotReply(msg);
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: reply, time: now },
        ]);
        setTyping(false);
        if (!open) setUnread((u) => u + 1);
      },
      1000 + Math.random() * 500,
    );
  };

  return (
    <>
      {/* Floating button */}
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

      {/* Chat window */}
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
                  Travel Mundo Assistant
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 11,
                    marginTop: 1,
                  }}
                >
                  Replies in a few seconds
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
              placeholder="Ask your question..."
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
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
