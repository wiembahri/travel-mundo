import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiFileText,
  FiGlobe,
  FiInfo,
  FiRefreshCw,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import { useAIContext } from "../context/AIContext";
import { NATIONALITIES } from "../data/nationalities";
import {
  DESTINATIONS,
  PASSPORT_STATUS_OPTIONS,
  SERVICE_DETAILS,
  getRecommendedService,
} from "../data/serviceRouting";
import { analyzeTravelProfile } from "../services/aiAnalysis";

const initialForm = {
  destination: "",
  purpose: "",
  nationality: "",
  duration: "",
  passportStatus: "",
};

function FieldShell({ label, icon, children }) {
  return (
    <div className="orientation-field">
      <label className="orientation-label">
        <span>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Orientation() {
  const { t } = useLanguage();
  const { setAssistantContext, resetAssistantContext } = useAIContext();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const isValid =
    form.destination &&
    form.purpose &&
    form.nationality &&
    form.duration &&
    form.passportStatus;

  const recommendedService = useMemo(() => {
    if (!isValid) return null;
    return getRecommendedService(form);
  }, [form, isValid]);

  const service = recommendedService
    ? SERVICE_DETAILS[recommendedService]
    : null;

  const analysis = useMemo(() => {
    if (!submitted || !recommendedService) return null;

    return analyzeTravelProfile({
      nationality: form.nationality,
      destination: form.destination,
      purpose: form.purpose,
      duration: form.duration,
      passportStatus: form.passportStatus,
      recommendedService,
    });
  }, [form, recommendedService, submitted]);

  const reviewState = useMemo(() => {
    if (!submitted || !recommendedService) return undefined;

    return {
      nationality: form.nationality,
      destination: form.destination,
      purpose: form.purpose,
      duration: form.duration,
      passportStatus: form.passportStatus,
      recommendedService,
      source: "orientation",
    };
  }, [form, recommendedService, submitted]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid || !recommendedService || !service) return;
    setSubmitted(true);
  };

  const reset = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  const ServiceIcon = service?.Icon || FiCompass;

  useEffect(() => {
    setAssistantContext({
      currentPage: "orientation",
      recommendedService,
      destination: form.destination,
      journeyStep: submitted ? "Service recommendation" : "Orientation",
      readinessScore: analysis?.preparationPercentage ?? null,
      riskLevel: analysis?.riskLevel || "",
      checklistProgress: null,
      activeService: recommendedService,
      warnings: analysis?.detectedIssues?.slice(0, 2) || [],
      missingDocuments: analysis?.missingDocuments || [],
    });
  }, [
    analysis,
    form.destination,
    recommendedService,
    setAssistantContext,
    submitted,
  ]);

  useEffect(() => () => resetAssistantContext(), [resetAssistantContext]);

  return (
    <main className="orientation-page">
      <PageHero
        eyebrow={t("orientation.eyebrow")}
        icon={<FiShield size={14} />}
        title={t("orientation.heroTitle")}
        description={t("orientation.heroText")}
      >
        <div className="orientation-hero-card" aria-hidden="true">
          <FiCompass size={34} />
          <strong>{t("orientation.panelTitle")}</strong>
          <span>{t("orientation.panelText")}</span>
        </div>
      </PageHero>

      <section className="tm-section tm-section-soft">
        <div className="container orientation-layout">
          <aside className="orientation-sidebar">
            <div className="orientation-sidebar-stack">
              <form className="orientation-card" onSubmit={handleSubmit}>
                <div className="orientation-card-head">
                  <div>
                    <p className="orientation-kicker">{t("orientation.profile")}</p>
                    <h2>{t("orientation.formTitle")}</h2>
                  </div>
                  <button
                    type="button"
                    className="orientation-reset"
                    onClick={reset}
                  >
                    <FiRefreshCw size={14} />
                    {t("orientation.reset")}
                  </button>
                </div>

                <div className="orientation-grid">
                  <FieldShell label={t("orientation.destination")} icon={<FiGlobe size={14} />}>
                    <select
                      className="input-field"
                      value={form.destination}
                      onChange={(e) => setField("destination", e.target.value)}
                      required
                    >
                      <option value="">{t("orientation.selectDestination")}</option>
                      {DESTINATIONS.map((destination) => (
                        <option key={destination} value={destination}>
                          {destination}
                        </option>
                      ))}
                    </select>
                  </FieldShell>

                  <FieldShell label={t("orientation.purpose")} icon={<FiFileText size={14} />}>
                    <select
                      className="input-field"
                      value={form.purpose}
                      onChange={(e) => setField("purpose", e.target.value)}
                      required
                    >
                      <option value="">{t("orientation.selectPurpose")}</option>
                      <option value="Tourism">Tourism</option>
                      <option value="Business">Business</option>
                      <option value="Study">Study</option>
                      <option value="Transit">Transit</option>
                      <option value="Passport service">Passport service</option>
                    </select>
                  </FieldShell>

                  <FieldShell label={t("orientation.nationality")} icon={<FiUser size={14} />}>
                    <select
                      className="input-field"
                      value={form.nationality}
                      onChange={(e) => setField("nationality", e.target.value)}
                      required
                    >
                      <option value="">{t("orientation.selectNationality")}</option>
                      {NATIONALITIES.map((nationality) => (
                        <option key={nationality} value={nationality}>
                          {nationality}
                        </option>
                      ))}
                    </select>
                  </FieldShell>

                  <FieldShell label={t("orientation.duration")} icon={<FiClock size={14} />}>
                    <input
                      className="input-field"
                      type="number"
                      min="1"
                      placeholder={t("orientation.durationPlaceholder")}
                      value={form.duration}
                      onChange={(e) => setField("duration", e.target.value)}
                      required
                    />
                  </FieldShell>
                </div>

                <FieldShell
                  label={t("orientation.passportStatus")}
                  icon={<FiFileText size={14} />}
                >
                  <div className="orientation-options">
                    {PASSPORT_STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`orientation-option ${
                          form.passportStatus === status ? "selected" : ""
                        }`}
                        onClick={() => setField("passportStatus", status)}
                      >
                        {form.passportStatus === status && (
                          <FiCheckCircle size={15} />
                        )}
                        {status}
                      </button>
                    ))}
                  </div>
                </FieldShell>

                <button
                  type="submit"
                  className="btn-primary orientation-submit"
                  disabled={!isValid}
                >
                  {t("orientation.getRecommendation")} <FiArrowRight size={16} />
                </button>
              </form>

              {submitted && service && analysis ? (
                <div className="orientation-summary-card">
                  <div className="orientation-summary-head">
                    <div>
                      <p className="orientation-kicker">{t("orientation.preparationSummary")}</p>
                      <h3>{recommendedService}</h3>
                    </div>
                    <div className="orientation-summary-score">
                      <strong>{analysis.preparationPercentage}%</strong>
                      <span>ready</span>
                    </div>
                  </div>

                  <div className="orientation-summary-grid">
                    <div>
                      <span>{t("orientation.estimatedReadiness")}</span>
                      <strong>{analysis.readinessStatus}</strong>
                    </div>
                    <div>
                      <span>{t("orientation.nextBestAction")}</span>
                      <strong>{analysis.nextBestAction}</strong>
                    </div>
                  </div>

                  <div className="orientation-action-grid">
                    <Link
                      to="/visa-scoring"
                      state={reviewState}
                      className="btn-primary orientation-link"
                    >
                      Continue to Review <FiArrowRight size={16} />
                    </Link>
                    <a
                      className="btn-outline orientation-link"
                      href={service.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("orientation.goToWebsite")}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="orientation-summary-card orientation-summary-card--empty">
                  <p className="orientation-kicker">{t("orientation.preparationSummary")}</p>
                  <h3>Recommendation preview</h3>
                  <p className="orientation-result-text">
                    Complete the short orientation to unlock the recommended service, readiness estimate, and next action.
                  </p>
                </div>
              )}
            </div>
          </aside>

          <div className="orientation-main">
            {submitted && service && analysis ? (
              <>
                <section className="orientation-service-overview">
                  <div className="orientation-service-overview__head">
                    <div className="orientation-result-icon">
                      <ServiceIcon size={24} />
                    </div>
                    <div>
                      <p className="orientation-kicker">{t("orientation.recommendedService")}</p>
                      <h2>{recommendedService}</h2>
                    </div>
                  </div>

                  <p className="orientation-result-text">{service.explanation}</p>

                  <div className="orientation-insight-grid">
                    <div className="orientation-insight-card">
                      <span>{t("orientation.preparationTime")}</span>
                      <strong>{service.time}</strong>
                    </div>
                    <div className="orientation-insight-card">
                      <span>{t("orientation.estimatedReadiness")}</span>
                      <strong>{analysis.preparationPercentage}% preparation estimate</strong>
                    </div>
                    <div className="orientation-insight-card orientation-insight-card--wide">
                      <span>{t("orientation.nextBestAction")}</span>
                      <strong>{analysis.nextBestAction}</strong>
                    </div>
                  </div>

                  <div className="orientation-review-cta">
                    <div>
                      <p className="orientation-kicker">Review readiness</p>
                      <strong>Move into the full readiness review</strong>
                      <span>
                        Review keeps your orientation data, adds the full checklist,
                        readiness dashboard, score, and preparation PDF report.
                      </span>
                    </div>
                    <div className="orientation-review-actions">
                      <Link to="/visa-scoring" state={reviewState} className="btn-primary">
                        Continue to Review <FiArrowRight size={16} />
                      </Link>
                      <Link to="/smart-diagnosis" className="btn-outline">
                        Run Smart Diagnosis
                      </Link>
                    </div>
                  </div>
                </section>

                <div className="orientation-notice">
                  <FiInfo size={18} />
                  <div>
                    <strong>{t("orientation.noticeTitle")}</strong>
                    <p>{t("orientation.notice")}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="orientation-empty-panel">
                <div className="orientation-result-icon">
                  <FiCompass size={24} />
                </div>
                <h2>{t("orientation.emptyTitle")}</h2>
                <p>{t("orientation.emptyText")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .orientation-page {
          min-height: 100vh;
          background: var(--tm-bg);
        }

        .orientation-hero {
          padding: clamp(70px, 8vw, 104px) 0;
          background:
            linear-gradient(135deg, var(--tm-navy-dark), var(--tm-navy));
          color: white;
          overflow: hidden;
        }

        .orientation-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.42fr);
          gap: 36px;
          align-items: center;
        }

        .orientation-hero h1 {
          max-width: 820px;
          margin: 18px 0;
          color: white;
          font-size: clamp(2.35rem, 5vw, 4.35rem);
          line-height: 1;
          letter-spacing: 0;
        }

        .orientation-hero p {
          max-width: 720px;
          color: rgba(255,255,255,0.8);
          font-size: 1.05rem;
          line-height: 1.78;
        }

        .orientation-hero-card {
          min-height: 250px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 18px;
          background: rgba(255,255,255,0.1);
          padding: 28px;
          box-shadow: 0 20px 50px rgba(2,6,23,0.2);
        }

        .orientation-hero-card svg {
          color: var(--blue-100);
        }

        .orientation-hero-card strong {
          display: block;
          margin: 74px 0 8px;
          color: white;
          font-family: var(--font-heading);
          font-size: 1.5rem;
          line-height: 1.15;
        }

        .orientation-hero-card span {
          color: rgba(255,255,255,0.72);
          font-weight: 700;
        }

        .orientation-layout {
          display: grid;
          grid-template-columns: minmax(320px, 0.78fr) minmax(0, 1.22fr);
          gap: 28px;
          align-items: start;
        }

        .orientation-card,
        .orientation-summary-card,
        .orientation-service-overview,
        .orientation-empty-panel,
        .orientation-notice {
          border: 1px solid rgba(189, 210, 238, 0.72);
          background: var(--tm-surface);
          border-radius: 18px;
          box-shadow: 0 18px 46px rgba(15, 23, 42, 0.07);
        }

        .orientation-sidebar {
          min-width: 0;
        }

        .orientation-sidebar-stack {
          position: sticky;
          top: 92px;
          display: grid;
          gap: 18px;
          max-height: calc(100vh - 108px);
          overflow: auto;
          padding-right: 4px;
        }

        .orientation-main {
          min-width: 0;
          display: grid;
          gap: 20px;
          align-content: start;
        }

        .orientation-card,
        .orientation-summary-card,
        .orientation-service-overview,
        .orientation-empty-panel {
          padding: 24px;
        }

        .orientation-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(226,232,240,0.9);
        }

        .orientation-card-head h2,
        .orientation-service-overview h2,
        .orientation-empty-panel h2,
        .orientation-summary-card h3 {
          margin: 0;
          color: var(--blue-900);
          font-family: var(--font-heading);
          font-size: 1.45rem;
        }

        .orientation-kicker {
          margin: 0 0 7px;
          color: var(--blue-700);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .orientation-reset {
          border: 1px solid var(--blue-200);
          background: var(--blue-50);
          color: var(--blue-700);
          border-radius: 999px;
          min-height: 38px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-weight: 800;
          cursor: pointer;
        }

        .orientation-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 18px;
        }

        .orientation-field {
          display: grid;
          gap: 9px;
        }

        .orientation-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--blue-900);
          font-size: 14px;
          font-weight: 800;
        }

        .orientation-label span {
          display: inline-grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: var(--blue-50);
          color: var(--blue-700);
        }

        .orientation-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .orientation-option {
          min-height: 42px;
          border: 1.5px solid rgba(203,213,225,0.9);
          background: white;
          color: var(--gray-700);
          border-radius: 999px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .orientation-option.selected {
          background: var(--tm-soft);
          border-color: var(--tm-navy);
          color: var(--tm-navy);
          box-shadow: 0 10px 24px rgba(11,47,107,0.1);
        }

        .orientation-submit {
          width: 100%;
          justify-content: center;
          margin-top: 24px;
        }

        .orientation-summary-card {
          display: grid;
          gap: 18px;
        }

        .orientation-result-icon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          background: var(--tm-navy);
          color: white;
          display: grid;
          place-items: center;
          margin-bottom: 18px;
          box-shadow: 0 14px 28px rgba(37,99,235,0.22);
        }

        .orientation-summary-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .orientation-summary-score {
          min-width: 92px;
          border-radius: 20px;
          background: var(--tm-navy);
          color: white;
          padding: 14px;
          text-align: center;
          box-shadow: 0 16px 36px rgba(37,99,235,0.18);
        }

        .orientation-summary-score strong {
          display: block;
          font-family: var(--font-heading);
          font-size: 1.5rem;
          line-height: 1;
        }

        .orientation-summary-score span {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
        }

        .orientation-summary-grid {
          display: grid;
          gap: 12px;
        }

        .orientation-summary-grid div,
        .orientation-insight-card {
          border-radius: 18px;
          background: rgba(238,244,251,0.82);
          border: 1px solid rgba(189,210,238,0.7);
          padding: 14px;
          display: grid;
          gap: 6px;
        }

        .orientation-summary-grid span,
        .orientation-insight-card span {
          color: var(--gray-500);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .orientation-summary-grid strong,
        .orientation-insight-card strong {
          color: var(--blue-900);
          font-family: var(--font-heading);
          font-size: 1rem;
          line-height: 1.45;
        }

        .orientation-summary-card--empty {
          min-height: 180px;
          align-content: center;
        }

        .orientation-action-grid {
          display: grid;
          gap: 10px;
        }

        .orientation-service-overview {
          display: grid;
          gap: 20px;
        }

        .orientation-service-overview__head {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .orientation-insight-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .orientation-insight-card--wide {
          grid-column: 1 / -1;
        }

        .orientation-result-text,
        .orientation-empty-panel p {
          color: var(--gray-600);
          line-height: 1.75;
          font-size: 14px;
          margin: 0;
        }

        .orientation-link {
          width: 100%;
          justify-content: center;
        }

        .orientation-review-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border: 1px solid rgba(189, 210, 238, 0.78);
          border-radius: 22px;
          background: var(--tm-soft);
          padding: 18px;
        }

        .orientation-review-cta strong {
          display: block;
          color: var(--blue-900);
          font-family: var(--font-heading);
          font-size: 1.08rem;
          margin-bottom: 6px;
        }

        .orientation-review-cta span {
          color: var(--gray-600);
          font-size: 14px;
          line-height: 1.65;
        }

        .orientation-review-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .orientation-empty-panel {
          min-height: 420px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 14px;
        }

        .orientation-notice {
          padding: 20px 22px;
          display: flex;
          gap: 12px;
          color: var(--blue-900);
        }

        .orientation-notice > svg {
          color: var(--blue-700);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .orientation-notice p {
          margin: 6px 0 0;
          color: var(--gray-700);
          font-size: 14px;
          line-height: 1.65;
        }

        @media (max-width: 980px) {
          .orientation-hero-grid,
          .orientation-layout {
            grid-template-columns: 1fr;
          }

          .orientation-sidebar-stack {
            position: static;
            max-height: none;
            overflow: visible;
            padding-right: 0;
          }

          .orientation-review-cta {
            flex-direction: column;
            align-items: flex-start;
          }

          .orientation-review-actions {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .orientation-card,
          .orientation-summary-card,
          .orientation-service-overview,
          .orientation-empty-panel {
            padding: 22px;
            border-radius: 22px;
          }

          .orientation-grid,
          .orientation-insight-grid {
            grid-template-columns: 1fr;
          }

          .orientation-card-head,
          .orientation-summary-head {
            flex-direction: column;
          }

          .orientation-review-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .orientation-review-actions .btn-primary,
          .orientation-review-actions .btn-outline {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
