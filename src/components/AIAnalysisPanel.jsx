import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRightCircle,
  FiClock,
  FiFlag,
  FiLayers,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

const RISK_TONES = {
  Low: { label: "Low risk", tone: "low" },
  Moderate: { label: "Moderate risk", tone: "moderate" },
  High: { label: "High risk", tone: "high" },
};

const itemMotion = {
  hidden: { opacity: 0, y: 16 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
}

function MetricPill({ label, value, accent = "blue", wide = false }) {
  return (
    <div className={`ai-intel-pill ai-intel-pill--${accent} ${wide ? "ai-intel-pill--wide" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InsightCard({ icon, title, items, accent, emptyText, index }) {
  const visibleItems = normalizeItems(items);

  return (
    <motion.article
      className={`ai-intel-card ai-intel-card--${accent}`}
      custom={index}
      initial="hidden"
      animate="visible"
      variants={itemMotion}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div className="ai-intel-card__head">
        <span className="ai-intel-card__icon">{icon}</span>
        <div>
          <p>Readiness guidance</p>
          <strong>{title}</strong>
        </div>
      </div>

      {visibleItems.length ? (
        <ul className="ai-intel-list">
          {visibleItems.map((item) => (
            <li key={`${title}-${item}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="ai-intel-card__empty">{emptyText}</p>
      )}
    </motion.article>
  );
}

function TimelineItem({ item, index }) {
  return (
    <motion.li
      className={`ai-intel-timeline__item ai-intel-timeline__item--${item.status}`}
      custom={index}
      initial="hidden"
      animate="visible"
      variants={itemMotion}
      layout
    >
      <span className="ai-intel-timeline__dot" />
      <div className="ai-intel-timeline__content">
        <strong>{item.title}</strong>
        <p>{item.detail}</p>
      </div>
    </motion.li>
  );
}

export default function AIAnalysisPanel({ analysis }) {
  const data = analysis || {
    riskLevel: "Moderate",
    readinessStatus: "Evaluating",
    recommendedService: "Pending",
    detectedIssues: [],
    missingDocuments: [],
    profileStrength: [],
    strengths: [],
    countryAdvice: [],
    nextBestAction: "",
    recommendations: [],
    timeline: [],
  };
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!analysis) return undefined;

    setIsRefreshing(true);
    const timeoutId = window.setTimeout(() => setIsRefreshing(false), 520);
    return () => window.clearTimeout(timeoutId);
  }, [
    analysis,
    data.readinessStatus,
    data.recommendedService,
    data.riskLevel,
    data.nextBestAction,
  ]);

  const riskTone = RISK_TONES[data.riskLevel] || RISK_TONES.Moderate;
  const strengthItems = useMemo(
    () => normalizeItems([...(data.profileStrength || []), ...(data.strengths || [])]),
    [data.profileStrength, data.strengths],
  );

  const overviewItems = useMemo(
    () => [
      {
        label: "Recommended path",
        value: data.recommendedService || "Pending",
        accent: "blue",
      },
      {
        label: "Readiness level",
        value: data.readinessStatus || "Evaluating",
        accent: "teal",
      },
      {
        label: "Risk level",
        value: riskTone.label,
        accent: riskTone.tone,
      },
      {
        label: "Next best action",
        value:
          data.nextBestAction ||
          "Continue strengthening support items before moving forward on the dedicated portal.",
        accent: "blue",
        wide: true,
      },
    ],
    [data.nextBestAction, data.readinessStatus, data.recommendedService, riskTone.label, riskTone.tone],
  );

  const insightCards = useMemo(
    () => [
      {
        title: "Detected issues",
        items: data.detectedIssues,
        accent: riskTone.tone,
        icon: <FiAlertTriangle size={16} />,
        emptyText: "No major issue is currently highlighted.",
      },
      {
        title: "Missing preparation items",
        items: data.missingDocuments,
        accent: "orange",
        icon: <FiLayers size={16} />,
        emptyText: "No missing preparation item is currently highlighted.",
      },
      {
        title: "Strengths",
        items: strengthItems,
        accent: "green",
        icon: <FiTrendingUp size={16} />,
        emptyText: "Strength signals will appear as the file becomes stronger.",
      },
      {
        title: "Recommendations",
        items: data.recommendations,
        accent: "blue",
        icon: <FiArrowRightCircle size={16} />,
        emptyText: "Recommendations will appear here as the review progresses.",
      },
      {
        title: "Country guidance",
        items: data.countryAdvice,
        accent: "slate",
        icon: <FiFlag size={16} />,
        emptyText: "Country-specific guidance will appear here.",
      },
    ],
    [
      data.countryAdvice,
      data.detectedIssues,
      data.missingDocuments,
      data.recommendations,
      riskTone.tone,
      strengthItems,
    ],
  );

  if (!analysis) return null;

  return (
    <motion.section
      className={`ai-intel ai-analysis-panel ${isRefreshing ? "is-refreshing" : ""}`}
      aria-live="polite"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      layout
    >
      <motion.div
        className="ai-intel-hero"
        layout
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="ai-intel-hero__glow ai-intel-hero__glow--one" />
        <div className="ai-intel-hero__glow ai-intel-hero__glow--two" />

        <div className="ai-intel-hero__header">
          <div>
            <div className="ai-intel-badges">
              <span className="ai-intel-badge">
                <FiZap size={13} />
                Readiness analysis
              </span>
              <span className="ai-intel-badge ai-intel-badge--pulse">
                <FiActivity size={13} />
                Guidance active
              </span>
            </div>

            <h3>Readiness Analysis</h3>
            <p>
              Clear preparation guidance based on profile consistency, support items,
              and detected risks.
            </p>
          </div>

          <div className="ai-intel-hero__status">
            <span className={`ai-intel-status ai-intel-status--${riskTone.tone}`}>
              {riskTone.label}
            </span>
          </div>
        </div>

        <div className="ai-intel-hero__body ai-intel-hero__body--simple">
          <div className="ai-intel-hero__pill-grid ai-intel-hero__pill-grid--analysis">
            {overviewItems.map((item) => (
              <MetricPill
                key={item.label}
                label={item.label}
                value={item.value}
                accent={item.accent}
                wide={item.wide}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <div className="ai-intel-grid ai-insights-grid">
        {insightCards.map((card, index) => (
          <InsightCard
            key={card.title}
            index={index}
            title={card.title}
            items={card.items}
            accent={card.accent}
            icon={card.icon}
            emptyText={card.emptyText}
          />
        ))}
      </div>

      <motion.div
        className="ai-intel-timeline"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        layout
      >
        <div className="ai-intel-timeline__head">
          <div>
            <p>
              <FiClock size={14} />
              Timeline / preparation events
            </p>
            <h4>Preparation events</h4>
          </div>
          <span className="ai-intel-timeline__live">
            <FiActivity size={14} />
            Updated from profile
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.ul className="ai-intel-timeline__list ai-timeline-grid" layout>
            {data.timeline.map((item, index) => (
              <TimelineItem item={item} index={index} key={`${item.title}-${item.detail}`} />
            ))}
          </motion.ul>
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
