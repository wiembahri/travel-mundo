import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiBriefcase,
  FiCompass,
  FiFileText,
  FiGlobe,
  FiMessageCircle,
  FiMinimize2,
  FiPlayCircle,
  FiSend,
  FiX,
} from "react-icons/fi";
import { useAIContext } from "../context/AIContext";
import { useLanguage } from "../context/LanguageContext";
import {
  getAssistantFallbackReply,
  getContextualReply,
  getContextualSuggestions,
  getQuickActionServices,
  inferCurrentPage,
} from "../services/aiAssistant";

const FAQS = [
  {
    words: [
      "passport",
      "renew",
      "renewal",
      "new passport",
      "passport application",
      "passeport",
      "pasaporte",
    ],
    replyKey: "chatbot.passport",
  },
  {
    words: [
      "usa",
      "u.s.",
      "united states",
      "us visa",
      "american visa",
      "esta",
      "etats-unis",
      "estados unidos",
    ],
    replyKey: "chatbot.us",
  },
  {
    words: [
      "eta",
      "uk eta",
      "travel authorization",
      "electronic authorization",
      "royaume-uni",
      "reino unido",
    ],
    replyKey: "chatbot.eta",
  },
  {
    words: [
      "track",
      "tracking",
      "application status",
      "status",
      "reference",
      "suivi",
      "seguimiento",
    ],
    replyKey: "chatbot.tracking",
  },
  {
    words: [
      "processing time",
      "delay",
      "how long",
      "time",
      "wait",
      "delai",
      "temps",
      "tiempo",
    ],
    replyKey: "chatbot.time",
  },
  {
    words: ["fees", "cost", "price", "payment", "frais", "prix", "tarifa", "costo"],
    replyKey: "chatbot.fees",
  },
  {
    words: ["contact", "support", "help", "email", "phone", "aide", "ayuda", "telefono"],
    replyKey: "chatbot.contact",
  },
  {
    words: [
      "services",
      "what do you offer",
      "what services",
      "application help",
      "servicios",
    ],
    replyKey: "chatbot.services",
  },
];

const QUICK_ACTION_LABELS = {
  ESTA: "ESTA",
  "U.S. Visa": "U.S. Visa",
  "UK ETA": "UK ETA",
  "U.S. Passport": "Passport",
};
const INITIAL_ASSISTANT_MESSAGE =
  "Hello, I can help you choose a service path, review preparation items, or understand your next step.";

function getTimeStamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getQuickActionIcon(service) {
  if (service === "ESTA") return <FiGlobe size={13} />;
  if (service === "U.S. Visa") return <FiBriefcase size={13} />;
  if (service === "UK ETA") return <FiCompass size={13} />;
  return <FiFileText size={13} />;
}

function getFallbackReply(message, t) {
  const msg = message.toLowerCase().trim();

  for (const faq of FAQS) {
    if (faq.words.some((word) => msg.includes(word))) {
      return t(faq.replyKey);
    }
  }

  return getAssistantFallbackReply();
}

function createBotMessage(text, kind = "reply") {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    from: "bot",
    text,
    time: getTimeStamp(),
    kind,
  };
}

function createUserMessage(text) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    from: "user",
    text,
    time: getTimeStamp(),
    kind: "user",
  };
}

export default function Chatbot() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const { assistantContext } = useAIContext();
  const bottomRef = useRef(null);
  const demoTimersRef = useRef([]);
  const replyTimersRef = useRef([]);

  const inferredPage = inferCurrentPage(pathname);
  const mergedContext = useMemo(
    () => ({
      ...assistantContext,
      currentPage: assistantContext.currentPage || inferredPage,
    }),
    [assistantContext, inferredPage],
  );

  const contextualData = useMemo(
    () => getContextualSuggestions(mergedContext),
    [mergedContext],
  );

  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [input, setInput] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [messages, setMessages] = useState(() => [
    createBotMessage(INITIAL_ASSISTANT_MESSAGE, "greeting"),
  ]);

  const quickQuestions = contextualData.suggestions;
  const quickActions = getQuickActionServices();
  const primaryWarning = contextualData.warnings[0] || "";
  const assistantTitle = "Travel Assistant";
  const assistantSubtitle = "Guided support";
  const assistantPlaceholder = "Ask about services, preparation, or next steps...";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) setUnread(0);
  }, [open]);

  useEffect(() => {
    return () => {
      replyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      replyTimersRef.current = [];
      demoTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      demoTimersRef.current = [];
    };
  }, []);

  const pushBotReply = (reply, kind = "reply", delay = 280) => {
    const appendReply = () => {
      setMessages((prev) => [...prev, createBotMessage(reply, kind)]);
      setTyping(false);
      if (!open) setUnread((count) => count + 1);
    };

    if (delay <= 0) {
      appendReply();
      return;
    }

    setTyping(true);
    const timer = window.setTimeout(() => {
      appendReply();
      replyTimersRef.current = replyTimersRef.current.filter((item) => item !== timer);
    }, delay);
    replyTimersRef.current.push(timer);
  };

  const sendMessage = (value, options = {}) => {
    const message = (value || input).trim();
    if (!message) return;

    setInput("");
    setMessages((prev) => [...prev, createUserMessage(message)]);

    const fallbackReply = getFallbackReply(message, t);
    const reply =
      getContextualReply(message, mergedContext, fallbackReply) || fallbackReply;

    pushBotReply(reply, options.kind, options.delay);
  };

  const handleQuickAction = (service) => {
    sendMessage(QUICK_ACTION_LABELS[service] || service, {
      kind: "quickAction",
      delay: 220,
    });
  };

  const toggleDemoMode = () => {
    const nextState = !demoMode;
    setDemoMode(nextState);
    setOpen(true);

    demoTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    demoTimersRef.current = [];

    if (!nextState) {
      setMessages((prev) => [
        ...prev,
        createBotMessage(
          "Demo guidance paused. Contextual guidance remains active.",
          "demo",
        ),
      ]);
      return;
    }

    const demoSteps = [
      "Demo guidance is active. Here is the guided Travel Mundo experience.",
      "Orientation: the traveler enters destination, purpose, nationality, and passport status.",
      "Recommendation: Travel Mundo routes the profile to ESTA, U.S. Visa, U.S. Passport, or UK ETA.",
      "Review: the readiness layer evaluates checklist progress, missing items, and overall risk.",
      "PDF: the preparation report summarizes strengths, warnings, and the next best action before the dedicated portal.",
    ];

    demoSteps.forEach((text, index) => {
      const timer = window.setTimeout(() => {
        setMessages((prev) => [...prev, createBotMessage(text, "demo")]);
      }, index * 900 + 200);
      demoTimersRef.current.push(timer);
    });
  };

  return (
    <>
      <motion.div
        className="tm-ai-launcher-wrap"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {!open && (
          <>
            <motion.div
              className="tm-ai-launcher-label"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.08 }}
            >
              <div className="tm-ai-launcher-badge">TM</div>
              <div className="tm-ai-launcher-copy">
                <strong>{assistantTitle}</strong>
                <span>{assistantSubtitle}</span>
              </div>
              <span className="tm-ai-launcher-status">
                <span className="tm-ai-live-dot-inline" />
                Online
              </span>
            </motion.div>

            <motion.button
              type="button"
              className="tm-ai-launcher"
              onClick={() => setOpen(true)}
              aria-label="Open Travel Assistant"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              animate={{ y: [0, -4, 0] }}
              transition={{
                y: {
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <span className="tm-ai-live-dot" />
              <FiMessageCircle size={22} />
              {unread > 0 && <span className="tm-ai-unread">{unread}</span>}
            </motion.button>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="tm-ai-widget"
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="tm-ai-widget-head">
              <div className="tm-ai-widget-head-main">
                <div className="tm-ai-widget-icon">TM</div>

                <div className="tm-ai-widget-heading">
                  <strong>{assistantTitle}</strong>
                  <span>{assistantSubtitle}</span>
                </div>
              </div>

              <div className="tm-ai-head-right">
                <span className="tm-ai-online-pill">
                  <span className="tm-ai-live-pill-dot" />
                  Online
                </span>
                <button
                  type="button"
                  className="tm-ai-head-icon-button"
                  onClick={() => setOpen(false)}
                  aria-label="Minimize chatbot"
                >
                  <FiMinimize2 size={15} />
                </button>
                <button
                  type="button"
                  className="tm-ai-head-icon-button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chatbot"
                >
                  <FiX size={15} />
                </button>
              </div>
            </div>

            <div className="tm-ai-mini-insight">
              <div className="tm-ai-mini-insight-head">
                <span>
                  <FiActivity size={13} />
                  Current guidance
                </span>
              </div>

              <p className="tm-ai-guidance-primary">{contextualData.insightLine}</p>

              <div className="tm-ai-mini-insight-meta">
                <p className="tm-ai-next-step-inline">
                  <span>Next step</span>
                  <strong>
                    <FiArrowRight size={13} />
                    {contextualData.nextStep}
                  </strong>
                </p>

                {primaryWarning && (
                  <span className="tm-ai-warning-inline">
                    <FiAlertTriangle size={13} />
                    {primaryWarning}
                  </span>
                )}
              </div>
            </div>

            <div className="tm-ai-messages" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`tm-ai-message-row ${
                    message.from === "user" ? "is-user" : ""
                  }`}
                >
                  <div className={`tm-ai-message ${message.from === "user" ? "is-user" : ""}`}>
                    {message.text}
                  </div>
                  <span className="tm-ai-message-time">{message.time}</span>
                </div>
              ))}

              {typing && (
                <div className="tm-ai-message-row">
                  <div className="tm-ai-message tm-ai-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="tm-ai-toolbar">
              <div className="tm-ai-toolbar-section">
                <div className="tm-ai-toolbar-label">Suggestions</div>
                <div className="tm-ai-actions-grid">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      className="tm-ai-action-chip"
                      onClick={() => sendMessage(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tm-ai-toolbar-section">
                <div className="tm-ai-toolbar-label">Services</div>
                <div className="tm-ai-services-grid">
                  {quickActions.map((service) => (
                    <button
                      key={service}
                      type="button"
                      className="tm-ai-service-chip"
                      onClick={() => handleQuickAction(service)}
                    >
                      {getQuickActionIcon(service)}
                      {QUICK_ACTION_LABELS[service] || service}
                    </button>
                  ))}

                  <button
                    type="button"
                    className={`tm-ai-demo-button ${demoMode ? "is-active" : ""}`}
                    onClick={toggleDemoMode}
                    title="Orientation -> Recommendation -> Review -> PDF"
                  >
                    <FiPlayCircle size={13} />
                    Demo guide
                  </button>
                </div>
              </div>
            </div>

            <div className="tm-ai-input-row">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                placeholder={assistantPlaceholder}
              />
              <button type="button" onClick={() => sendMessage()} aria-label="Send message">
                <FiSend size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .tm-ai-launcher-wrap {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tm-ai-launcher-label {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          min-width: 198px;
          border-radius: 18px;
          border: 1px solid rgba(191, 219, 254, 0.86);
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
          backdrop-filter: blur(16px);
        }

        .tm-ai-launcher-copy {
          display: grid;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }

        .tm-ai-launcher-label strong,
        .tm-ai-widget-heading strong {
          display: block;
          color: var(--blue-950);
          font-family: var(--font-heading);
          font-size: 0.96rem;
          line-height: 1.15;
        }

        .tm-ai-launcher-copy span,
        .tm-ai-widget-heading span {
          color: var(--gray-500);
          font-size: 0.78rem;
          font-weight: 700;
          line-height: 1.4;
        }

        .tm-ai-launcher-badge,
        .tm-ai-widget-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: linear-gradient(135deg, #0b2f6b, #1e4f9a);
          color: white;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .tm-ai-launcher-badge,
        .tm-ai-widget-icon {
          width: 38px;
          height: 38px;
        }

        .tm-ai-launcher-status,
        .tm-ai-online-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 10px;
          border-radius: 999px;
          white-space: nowrap;
          font-size: 0.73rem;
          font-weight: 800;
        }

        .tm-ai-launcher-status {
          background: rgba(240, 253, 244, 0.96);
          color: #166534;
        }

        .tm-ai-launcher {
          position: relative;
          width: 58px;
          height: 58px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg, #0b2f6b, #1d4ed8);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.28) inset,
            0 18px 38px rgba(37, 99, 235, 0.34),
            0 0 28px rgba(56, 189, 248, 0.28);
        }

        .tm-ai-live-dot,
        .tm-ai-live-pill-dot,
        .tm-ai-live-dot-inline {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6);
          animation: tmAiPulse 1.8s infinite;
        }

        .tm-ai-live-dot {
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .tm-ai-unread {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid white;
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .tm-ai-widget {
          position: fixed;
          right: 24px;
          bottom: 96px;
          z-index: 1999;
          width: min(420px, calc(100vw - 24px));
          height: min(600px, calc(100vh - 104px));
          max-height: min(600px, calc(100vh - 104px));
          display: grid;
          grid-template-rows: auto auto minmax(180px, 1fr) auto auto;
          gap: 0;
          border-radius: 26px;
          border: 1px solid rgba(189, 210, 238, 0.76);
          background: rgba(255, 255, 255, 0.94);
          box-shadow:
            0 26px 66px rgba(15, 23, 42, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.62) inset;
          backdrop-filter: blur(22px);
          overflow: hidden;
        }

        .tm-ai-widget-head,
        .tm-ai-mini-insight,
        .tm-ai-toolbar,
        .tm-ai-input-row {
          padding-left: 16px;
          padding-right: 16px;
        }

        .tm-ai-widget-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 16px;
          padding-bottom: 16px;
          background:
            radial-gradient(circle at top right, rgba(125, 211, 252, 0.14), transparent 28%),
            linear-gradient(135deg, rgba(11, 47, 107, 0.99), rgba(19, 68, 146, 0.97));
        }

        .tm-ai-widget-head-main {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .tm-ai-widget-heading {
          display: grid;
          gap: 3px;
          min-width: 0;
        }

        .tm-ai-widget-heading strong {
          color: white;
          font-size: 1rem;
        }

        .tm-ai-widget-heading span {
          color: rgba(255, 255, 255, 0.8);
        }

        .tm-ai-head-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .tm-ai-online-pill {
          background: rgba(255, 255, 255, 0.14);
          color: white;
        }

        .tm-ai-head-icon-button {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.14);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.14);
          cursor: pointer;
          transition: background 0.18s ease, transform 0.18s ease;
        }

        .tm-ai-head-icon-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .tm-ai-mini-insight,
        .tm-ai-message {
          white-space: pre-wrap;
        }

        .tm-ai-mini-insight {
          display: grid;
          gap: 12px;
          padding-top: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.84);
          background: linear-gradient(180deg, rgba(248, 251, 255, 0.96), rgba(242, 247, 255, 0.97));
        }

        .tm-ai-mini-insight-head {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .tm-ai-mini-insight-head > span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--blue-900);
          font-size: 0.77rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .tm-ai-guidance-primary {
          margin: 0;
          color: var(--blue-950);
          font-size: 0.94rem;
          line-height: 1.6;
          font-weight: 700;
        }

        .tm-ai-mini-insight-meta {
          display: grid;
          gap: 10px;
        }

        .tm-ai-next-step-inline {
          margin: 0;
          display: grid;
          gap: 5px;
        }

        .tm-ai-next-step-inline span {
          color: var(--gray-600);
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .tm-ai-next-step-inline strong {
          display: inline-flex;
          align-items: flex-start;
          gap: 7px;
          color: var(--gray-800);
          font-size: 0.88rem;
          line-height: 1.55;
          font-weight: 700;
        }

        .tm-ai-warning-inline {
          display: inline-flex;
          align-items: flex-start;
          gap: 7px;
          padding: 10px 12px;
          border-radius: 14px;
          background: #fff7ed;
          border: 1px solid #fdba74;
          color: #c2410c;
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .tm-ai-toolbar {
          display: grid;
          gap: 12px;
          padding-top: 14px;
          padding-bottom: 14px;
          border-top: 1px solid rgba(226, 232, 240, 0.84);
          background: rgba(255, 255, 255, 0.92);
        }

        .tm-ai-toolbar-section {
          display: grid;
          gap: 9px;
        }

        .tm-ai-toolbar-label {
          color: var(--gray-500);
          font-size: 0.73rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .tm-ai-actions-grid,
        .tm-ai-services-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .tm-ai-action-chip,
        .tm-ai-service-chip,
        .tm-ai-demo-button {
          border: 1px solid rgba(191, 219, 254, 0.85);
          border-radius: 16px;
          background: rgba(239, 246, 255, 0.94);
          color: var(--blue-700);
          cursor: pointer;
          font-weight: 800;
          text-align: left;
          white-space: normal;
          min-width: 0;
          transition:
            transform 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease;
        }

        .tm-ai-action-chip:hover,
        .tm-ai-service-chip:hover,
        .tm-ai-demo-button:hover {
          transform: translateY(-1px);
          background: rgba(219, 234, 254, 0.96);
          border-color: rgba(96, 165, 250, 0.92);
        }

        .tm-ai-action-chip,
        .tm-ai-service-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 12px;
          font-size: 0.84rem;
          line-height: 1.45;
        }

        .tm-ai-service-chip {
          background: rgba(248, 250, 252, 0.98);
          color: var(--blue-900);
        }

        .tm-ai-demo-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
          padding: 11px 12px;
          font-size: 0.8rem;
          color: var(--gray-700);
          background: rgba(248, 250, 252, 0.98);
        }

        .tm-ai-demo-button.is-active {
          background: linear-gradient(135deg, var(--blue-700), var(--blue-500));
          color: white;
          border-color: transparent;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.18);
        }

        .tm-ai-messages {
          min-height: 180px;
          max-height: 100%;
          overflow-y: auto;
          padding: 14px 16px;
          background: linear-gradient(180deg, rgba(250, 252, 255, 0.96), rgba(244, 247, 252, 0.92));
          border-top: 1px solid rgba(226, 232, 240, 0.78);
          border-bottom: 1px solid rgba(226, 232, 240, 0.78);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tm-ai-message-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .tm-ai-message-row.is-user {
          align-items: flex-end;
        }

        .tm-ai-message {
          max-width: 92%;
          margin: 0;
          padding: 13px 15px;
          border-radius: 18px 18px 18px 8px;
          background: #ffffff;
          border: 1px solid #d8e0ec;
          color: #0f172a;
          font-size: 14px;
          line-height: 1.55;
          overflow-wrap: anywhere;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.05);
        }

        .tm-ai-message.is-user {
          border-radius: 18px 18px 8px 18px;
          background: #0b2f6b;
          border-color: #0b2f6b;
          color: white;
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.16);
        }

        .tm-ai-message-time {
          margin-top: 5px;
          padding-left: 4px;
          color: var(--gray-400);
          font-size: 0.68rem;
          font-weight: 700;
        }

        .tm-ai-typing {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .tm-ai-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--blue-400);
          animation: tmAiBounce 1s infinite ease-in-out;
        }

        .tm-ai-typing span:nth-child(2) {
          animation-delay: 0.14s;
        }

        .tm-ai-typing span:nth-child(3) {
          animation-delay: 0.28s;
        }

        .tm-ai-input-row {
          padding-top: 14px;
          padding-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.96);
          border-top: 1px solid rgba(226, 232, 240, 0.82);
        }

        .tm-ai-input-row input {
          flex: 1;
          min-width: 0;
          min-height: 48px;
          border-radius: 16px;
          border: 1.5px solid rgba(203, 213, 225, 0.92);
          background: rgba(248, 250, 252, 0.92);
          color: var(--gray-800);
          padding: 0 15px;
          font-size: 0.9rem;
          outline: none;
          transition: 0.2s ease;
        }

        .tm-ai-input-row input:focus {
          border-color: rgba(59, 130, 246, 0.55);
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
        }

        .tm-ai-input-row button {
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #0b2f6b, #1d4ed8);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 14px 26px rgba(37, 99, 235, 0.18);
        }

        @keyframes tmAiPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.55);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(52, 211, 153, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
          }
        }

        @keyframes tmAiBounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
        }

        @media (max-width: 640px) {
          .tm-ai-launcher-wrap {
            right: 16px;
            bottom: 16px;
          }

          .tm-ai-launcher-label {
            min-width: 0;
            max-width: calc(100vw - 110px);
          }

          .tm-ai-widget {
            right: 12px;
            left: 12px;
            bottom: 88px;
            width: calc(100vw - 24px);
            height: min(600px, calc(100vh - 108px));
            max-height: min(600px, calc(100vh - 108px));
            border-radius: 24px;
          }

          .tm-ai-widget-head,
          .tm-ai-mini-insight-head {
            flex-direction: column;
            align-items: flex-start;
          }

          .tm-ai-head-right {
            width: 100%;
            justify-content: space-between;
          }

          .tm-ai-message {
            max-width: 100%;
          }
        }

        @media (max-width: 420px) {
          .tm-ai-actions-grid,
          .tm-ai-services-grid {
            grid-template-columns: 1fr;
          }

          .tm-ai-launcher-label {
            display: none;
          }
        }

        body.dark .tm-ai-launcher-label,
        body.dark .tm-ai-widget,
        body.dark .tm-ai-mini-insight,
        body.dark .tm-ai-toolbar,
        body.dark .tm-ai-input-row {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.92));
          border-color: rgba(51, 65, 85, 0.92);
        }

        body.dark .tm-ai-messages,
        body.dark .tm-ai-message {
          border-color: rgba(51, 65, 85, 0.92);
        }

        body.dark .tm-ai-messages {
          background: linear-gradient(180deg, rgba(10, 15, 26, 0.96), rgba(15, 23, 42, 0.94));
        }

        body.dark .tm-ai-widget {
          box-shadow:
            0 34px 84px rgba(2, 6, 23, 0.42),
            0 0 0 1px rgba(51, 65, 85, 0.56) inset;
        }

        body.dark .tm-ai-mini-insight,
        body.dark .tm-ai-toolbar,
        body.dark .tm-ai-input-row {
          border-color: rgba(51, 65, 85, 0.86);
        }

        body.dark .tm-ai-launcher-label strong,
        body.dark .tm-ai-mini-insight-head > span,
        body.dark .tm-ai-service-chip,
        body.dark .tm-ai-action-chip,
        body.dark .tm-ai-widget-heading strong,
        body.dark .tm-ai-guidance-primary,
        body.dark .tm-ai-next-step-inline strong {
          color: #e2e8f0;
        }

        body.dark .tm-ai-message {
          background: rgba(15, 23, 42, 0.96);
          color: #e2e8f0;
        }

        body.dark .tm-ai-launcher-copy span,
        body.dark .tm-ai-widget-heading span,
        body.dark .tm-ai-next-step-inline span,
        body.dark .tm-ai-message-time,
        body.dark .tm-ai-input-row input,
        body.dark .tm-ai-toolbar-label {
          color: #94a3b8;
        }

        body.dark .tm-ai-action-chip,
        body.dark .tm-ai-service-chip,
        body.dark .tm-ai-demo-button {
          background: rgba(30, 41, 59, 0.96);
          border-color: rgba(51, 65, 85, 0.92);
          color: #bfdbfe;
        }

        body.dark .tm-ai-launcher-status {
          background: rgba(20, 83, 45, 0.35);
          color: #bbf7d0;
        }

        body.dark .tm-ai-warning-inline {
          background: rgba(124, 45, 18, 0.28);
          border-color: rgba(251, 191, 36, 0.36);
          color: #fdba74;
        }

        body.dark .tm-ai-message.is-user,
        body.dark .tm-ai-demo-button.is-active,
        body.dark .tm-ai-input-row button {
          color: white;
        }

        body.dark .tm-ai-input-row input {
          background: rgba(15, 23, 42, 0.9);
          border-color: rgba(51, 65, 85, 0.92);
        }
      `}</style>
    </>
  );
}
