import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiClipboard,
  FiCompass,
  FiFileText,
  FiGlobe,
  FiLayers,
  FiMapPin,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { SERVICE_DETAILS } from "../data/serviceRouting";
import { useAIContext } from "../context/AIContext";

const DESTINATION_NODES = [
  {
    destination: "United States",
    eyebrow: "3 support routes",
    description:
      "Explore the short-stay, visa, and passport guidance paths available for U.S. travel.",
    services: ["ESTA", "U.S. Visa", "U.S. Passport"],
  },
  {
    destination: "United Kingdom",
    eyebrow: "1 support route",
    description:
      "Route directly to UK ETA support with a focused preparation experience.",
    services: ["UK ETA"],
  },
];

const COMPARATOR_ROWS = [
  {
    service: "ESTA",
    bestFor: "Short U.S. tourism, business, or transit stays",
    preparationFocus: "Passport, contact details, travel purpose",
    typicalRoute: "United States short stay",
    siteLabel: "U.S. service portal",
    href: SERVICE_DETAILS.ESTA.url,
  },
  {
    service: "U.S. Visa",
    bestFor: "Study, long stays, or non-ESTA cases",
    preparationFocus:
      "DS-160, interview, financial and supporting evidence",
    typicalRoute: "United States visa path",
    siteLabel: "U.S. service portal",
    href: SERVICE_DETAILS["U.S. Visa"].url,
  },
  {
    service: "U.S. Passport",
    bestFor:
      "U.S. citizens needing passport preparation, renewal, replacement, or correction",
    preparationFocus:
      "Identity, citizenship proof, passport photo, correct form",
    typicalRoute: "U.S. passport support",
    siteLabel: "Passport service portal",
    href: SERVICE_DETAILS["U.S. Passport"].url,
  },
  {
    service: "UK ETA",
    bestFor: "UK travel authorization support",
    preparationFocus:
      "Passport, face photo, contact details, suitability questions",
    typicalRoute: "United Kingdom travel",
    siteLabel: "UK ETA service portal",
    href: SERVICE_DETAILS["UK ETA"].url,
  },
];

const JOURNEY_STEPS = [
  {
    title: "Orientation",
    description:
      "Start with destination, purpose, nationality, and passport context.",
    status: "Start point",
    tone: "complete",
    Icon: FiCompass,
  },
  {
    title: "Service recommendation",
    description:
      "Travel Mundo routes the traveler to ESTA, U.S. Visa, U.S. Passport, or UK ETA.",
    status: "Smart routing",
    tone: "active",
    Icon: FiMapPin,
  },
  {
    title: "Checklist preparation",
    description:
      "Gather the required preparation items and information before continuing.",
    status: "Preparation",
    tone: "support",
    Icon: FiClipboard,
  },
  {
    title: "Readiness review",
    description:
      "Review profile quality, document coverage, and readiness gaps.",
    status: "Review layer",
    tone: "support",
    Icon: FiCheckCircle,
  },
  {
    title: "Guidance analysis",
    description:
      "Use profile signals to surface strengths and recommended next actions.",
    status: "Guidance engine",
    tone: "active",
    Icon: FiActivity,
  },
  {
    title: "PDF report",
    description:
      "Generate a portable summary with observations and practical guidance.",
    status: "Deliverable",
    tone: "complete",
    Icon: FiFileText,
  },
  {
    title: "Dedicated service portal",
    description:
      "Continue on the dedicated portal once the file is ready to move forward.",
    status: "Final handoff",
    tone: "focus",
    Icon: FiGlobe,
  },
];

function getServiceIcon(service) {
  if (service === "ESTA") return FiGlobe;
  if (service === "U.S. Visa") return FiBriefcase;
  if (service === "U.S. Passport") return FiFileText;
  return FiCompass;
}

function getToneClass(tone) {
  if (tone === "complete") return "is-complete";
  if (tone === "active") return "is-active";
  if (tone === "focus") return "is-focus";
  return "is-support";
}

export default function TravelFlow() {
  const { setAssistantContext, resetAssistantContext } = useAIContext();
  const [selectedDestination, setSelectedDestination] = useState("United States");
  const [activeStep, setActiveStep] = useState(1);

  const selectedNode =
    DESTINATION_NODES.find((node) => node.destination === selectedDestination) ||
    DESTINATION_NODES[0];
  const activeJourneyStep = JOURNEY_STEPS[activeStep] || JOURNEY_STEPS[0];
  const ActiveJourneyIcon = activeJourneyStep.Icon;
  const selectedServices = selectedNode.services;

  useEffect(() => {
    setAssistantContext({
      currentPage: "travelFlow",
      recommendedService: selectedServices[0] || "",
      destination: selectedDestination,
      journeyStep: activeJourneyStep.title,
      readinessScore: null,
      riskLevel: "",
      checklistProgress: null,
      activeService: selectedServices[0] || "",
      warnings: [],
      missingDocuments: [],
    });
  }, [
    activeJourneyStep.title,
    selectedDestination,
    selectedServices,
    setAssistantContext,
  ]);

  useEffect(() => () => resetAssistantContext(), [resetAssistantContext]);

  return (
    <main
      className={`travel-flow-page ${
        selectedDestination === "United States"
          ? "travel-flow-page--us"
          : "travel-flow-page--uk"
      }`}
    >
      <PageHero
        eyebrow="Travel Journey"
        icon={<FiShield size={14} />}
        title="Understand the Travel Mundo preparation journey"
        description={
          <>
            <p>
              Visualize how travelers move from orientation to readiness review,
              instructions, report generation, and dedicated portal handoff.
            </p>

            <div className="travel-flow-hero-stats">
              <div className="travel-flow-hero-stat">
                <strong>2</strong>
                <span>Destinations</span>
              </div>
              <div className="travel-flow-hero-stat">
                <strong>4</strong>
                <span>Service paths</span>
              </div>
              <div className="travel-flow-hero-stat">
                <strong>7</strong>
                <span>Journey steps</span>
              </div>
            </div>
          </>
        }
      >
        <div className="travel-flow-hero-card" aria-hidden="true">
          <div className="travel-flow-hero-card-top">
            <div className="travel-flow-icon-shell">
              <FiLayers size={24} />
            </div>
            <span>Module 2</span>
          </div>

          <strong>Visual guidance for focused UK and U.S. support</strong>
          <p>
            One interactive page to understand where the traveler starts,
            which service path opens next, and how the experience advances.
          </p>

          <div className="travel-flow-hero-ribbon">
            <FiBarChart2 size={16} />
            Interactive preparation flow
          </div>
        </div>
      </PageHero>

      <section className="tm-section tm-section-soft">
        <div className="container travel-flow-stack">
          <section className="travel-flow-panel">
            <div className="travel-flow-section-head">
              <div>
                <span className="travel-flow-section-kicker">
                  Smart Travel Route Map
                </span>
                <h2>Route the traveler to the right destination flow</h2>
              </div>
              <p>
                Select a destination card to reveal the services Travel Mundo
                supports for that route.
              </p>
            </div>

            <div className="travel-flow-map-grid">
              <article className="travel-flow-profile-card">
                <div className="travel-flow-profile-head">
                  <div className="travel-flow-icon-shell">
                    <FiUser size={24} />
                  </div>
                  <div>
                    <span className="travel-flow-section-kicker">
                      Traveler Profile
                    </span>
                    <h3>Start from one guided profile</h3>
                  </div>
                </div>

                <p>
                  Travel Mundo centralizes the traveler context first, then
                  routes the user toward the relevant United States or United
                  Kingdom support path.
                </p>

                <div className="travel-flow-profile-pills">
                  <span>Orientation data</span>
                  <span>Destination logic</span>
                  <span>Service routing</span>
                </div>
              </article>

              <div className="travel-flow-destination-stack">
                {DESTINATION_NODES.map((node) => {
                  const isSelected = node.destination === selectedDestination;

                  return (
                    <button
                      key={node.destination}
                      type="button"
                      className={`travel-flow-destination-card ${
                        isSelected ? "is-selected" : ""
                      }`}
                      onClick={() => setSelectedDestination(node.destination)}
                      aria-pressed={isSelected}
                    >
                      <div className="travel-flow-destination-head">
                        <div className="travel-flow-icon-shell">
                          {node.destination === "United States" ? (
                            <FiGlobe size={22} />
                          ) : (
                            <FiMapPin size={22} />
                          )}
                        </div>
                        <div>
                          <span className="travel-flow-destination-kicker">
                            {node.eyebrow}
                          </span>
                          <strong>{node.destination}</strong>
                        </div>
                      </div>
                      <p>{node.description}</p>
                      <div className="travel-flow-destination-tags">
                        {node.services.map((service) => (
                          <span key={service}>{service}</span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="travel-flow-service-focus">
              <div className="travel-flow-service-focus-head">
                <div>
                  <span className="travel-flow-section-kicker">
                    Selected destination
                  </span>
                  <h3>{selectedNode.destination}</h3>
                </div>
                <span className="travel-flow-service-count">
                  {selectedServices.length} available service
                  {selectedServices.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="travel-flow-service-grid">
                {selectedServices.map((service) => {
                  const detail = SERVICE_DETAILS[service];
                  const Icon = getServiceIcon(service);

                  return (
                    <article className="travel-flow-service-card" key={service}>
                      <div className="travel-flow-service-card-head">
                        <div className="travel-flow-icon-shell">
                          <Icon size={20} />
                        </div>
                        <div>
                          <strong>{service}</strong>
                          <span>{detail.time}</span>
                        </div>
                      </div>

                      <p>{detail.explanation}</p>

                      <a href={detail.url} target="_blank" rel="noreferrer">
                        Open dedicated portal <FiArrowRight size={14} />
                      </a>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="travel-flow-panel">
            <div className="travel-flow-section-head">
              <div>
                <span className="travel-flow-section-kicker">
                  Smart Service Comparator
                </span>
                <h2>Compare the supported service paths at a glance</h2>
              </div>
              <p>
                The current destination selection softly highlights the most
                relevant services inside the comparator.
              </p>
            </div>

            <div className="travel-flow-comparator-wrap">
              <table className="travel-flow-comparator">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Best for</th>
                    <th>Preparation focus</th>
                    <th>Typical route</th>
                    <th>Dedicated site</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARATOR_ROWS.map((row) => {
                    const isHighlighted = selectedServices.includes(row.service);

                    return (
                      <tr
                        key={row.service}
                        className={isHighlighted ? "is-highlighted" : ""}
                      >
                        <td data-label="Service">
                          <span className="travel-flow-table-service">
                            {row.service}
                          </span>
                        </td>
                        <td data-label="Best for">{row.bestFor}</td>
                        <td data-label="Preparation focus">
                          {row.preparationFocus}
                        </td>
                        <td data-label="Typical route">{row.typicalRoute}</td>
                        <td data-label="Dedicated site">
                          <a href={row.href} target="_blank" rel="noreferrer">
                            {row.siteLabel} <FiArrowRight size={14} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="travel-flow-panel">
            <div className="travel-flow-section-head">
              <div>
                <span className="travel-flow-section-kicker">
                  Interactive Journey Timeline
                </span>
                <h2>Follow the Travel Mundo experience step by step</h2>
              </div>
              <p>
                Select a milestone to focus its role in the overall journey.
              </p>
            </div>

            <div className="travel-flow-timeline">
              <div className="travel-flow-timeline-track" aria-hidden="true" />

              <div className="travel-flow-timeline-grid">
                {JOURNEY_STEPS.map((step, index) => {
                  const isActive = index === activeStep;
                  const Icon = step.Icon;

                  return (
                    <button
                      key={step.title}
                      type="button"
                      className={`travel-flow-step-card ${
                        isActive ? "is-active" : ""
                      }`}
                      onClick={() => setActiveStep(index)}
                      aria-pressed={isActive}
                    >
                      <div className="travel-flow-step-top">
                        <div className="travel-flow-step-icon">
                          <Icon size={18} />
                        </div>
                        <span
                          className={`travel-flow-status-pill ${getToneClass(
                            step.tone,
                          )}`}
                        >
                          {step.status}
                        </span>
                      </div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="travel-flow-step-detail">
                <div className="travel-flow-step-detail-icon">
                  <ActiveJourneyIcon size={24} />
                </div>
                <div>
                  <span className="travel-flow-section-kicker">
                    Active milestone
                  </span>
                  <h3>{activeJourneyStep.title}</h3>
                  <p>{activeJourneyStep.description}</p>
                </div>
                <span
                  className={`travel-flow-status-pill ${getToneClass(
                    activeJourneyStep.tone,
                  )}`}
                >
                  {activeJourneyStep.status}
                </span>
              </div>
            </div>
          </section>

          <section className="travel-flow-cta">
            <div>
              <span className="travel-flow-section-kicker">Next actions</span>
              <h2>Move from the flow overview into the guided tools</h2>
              <p>
                Start orientation, review readiness, or explore the
                instructions center depending on where the traveler is today.
              </p>
            </div>

            <div className="travel-flow-cta-actions">
              <Link to="/orientation" className="btn-primary">
                Start Orientation <FiArrowRight size={16} />
              </Link>
              <Link to="/visa-scoring" className="btn-outline">
                Review Readiness
              </Link>
              <Link to="/instructions" className="btn-outline">
                View Instructions
              </Link>
            </div>
          </section>
        </div>
      </section>

      <style>{`
        .travel-flow-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 0%, rgba(96, 165, 250, 0.12), transparent 26%),
            linear-gradient(180deg, #f8fbff 0%, #eff5fb 100%);
        }

        .travel-flow-hero {
          padding: clamp(72px, 8vw, 108px) 0;
          color: white;
          background:
            radial-gradient(circle at 82% 18%, rgba(125, 211, 252, 0.24), transparent 24%),
            radial-gradient(circle at 18% 12%, rgba(59, 130, 246, 0.22), transparent 34%),
            linear-gradient(135deg, #052b67 0%, #0f3f91 45%, #1d64d8 100%);
          overflow: hidden;
        }

        .travel-flow-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.72fr);
          gap: 32px;
          align-items: center;
        }

        .travel-flow-hero h1 {
          margin: 18px 0 16px;
          max-width: 760px;
          color: white;
          font-size: clamp(2.4rem, 5vw, 4.45rem);
          line-height: 0.98;
          letter-spacing: -0.03em;
        }

        .travel-flow-hero p {
          max-width: 700px;
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.05rem;
          line-height: 1.8;
        }

        .travel-flow-hero-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          max-width: 580px;
          margin-top: 30px;
        }

        .travel-flow-hero-stat,
        .travel-flow-panel,
        .travel-flow-cta {
          border: 1px solid rgba(189, 210, 238, 0.72);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(246, 250, 255, 0.94));
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(18px);
        }

        .travel-flow-hero-stat {
          border-radius: 22px;
          padding: 18px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.08));
          border-color: rgba(255, 255, 255, 0.16);
          box-shadow: none;
        }

        .travel-flow-hero-stat strong {
          display: block;
          color: white;
          font-family: var(--font-heading);
          font-size: 1.8rem;
          line-height: 1;
        }

        .travel-flow-hero-stat span {
          display: block;
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.83rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .travel-flow-hero-card {
          min-height: 310px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 30px;
          padding: 28px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.08));
          box-shadow: 0 30px 74px rgba(2, 8, 23, 0.22);
        }

        .travel-flow-hero-card-top,
        .travel-flow-profile-head,
        .travel-flow-destination-head,
        .travel-flow-service-card-head,
        .travel-flow-step-top,
        .travel-flow-service-focus-head,
        .travel-flow-section-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .travel-flow-hero-card-top span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.86);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .travel-flow-icon-shell,
        .travel-flow-step-icon,
        .travel-flow-step-detail-icon {
          width: 50px;
          height: 50px;
          border-radius: 18px;
          display: inline-grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.16), rgba(14, 165, 233, 0.14));
          color: var(--blue-700);
          box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.18);
          flex-shrink: 0;
        }

        .travel-flow-hero-card .travel-flow-icon-shell {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
        }

        .travel-flow-hero-card strong {
          display: block;
          margin: 26px 0 10px;
          color: white;
          font-family: var(--font-heading);
          font-size: 1.65rem;
          line-height: 1.12;
        }

        .travel-flow-hero-card p {
          color: rgba(255, 255, 255, 0.74);
          font-size: 0.98rem;
          line-height: 1.8;
        }

        .travel-flow-hero-ribbon {
          margin-top: 24px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.92);
          font-size: 0.86rem;
          font-weight: 700;
        }

        .travel-flow-stack {
          display: grid;
          gap: 28px;
        }

        .travel-flow-panel,
        .travel-flow-cta {
          border-radius: 28px;
          padding: 28px;
        }

        .travel-flow-section-head {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.82);
        }

        .travel-flow-section-head h2,
        .travel-flow-service-focus h3,
        .travel-flow-profile-card h3,
        .travel-flow-step-detail h3,
        .travel-flow-cta h2 {
          margin: 0;
          color: var(--blue-950);
          font-family: var(--font-heading);
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          line-height: 1.1;
        }

        .travel-flow-section-head p,
        .travel-flow-profile-card p,
        .travel-flow-destination-card p,
        .travel-flow-service-card p,
        .travel-flow-step-card p,
        .travel-flow-step-detail p,
        .travel-flow-cta p {
          margin: 0;
          color: var(--gray-600);
          line-height: 1.75;
        }

        .travel-flow-section-head p {
          max-width: 340px;
          font-size: 0.95rem;
        }

        .travel-flow-section-kicker,
        .travel-flow-destination-kicker {
          display: inline-block;
          margin-bottom: 8px;
          color: var(--blue-700);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .travel-flow-map-grid {
          display: grid;
          grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.18fr);
          gap: 34px;
          align-items: start;
        }

        .travel-flow-profile-card,
        .travel-flow-service-focus,
        .travel-flow-step-detail {
          border-radius: 24px;
          border: 1px solid rgba(189, 210, 238, 0.75);
          background: linear-gradient(180deg, rgba(248, 251, 255, 0.98), rgba(239, 246, 255, 0.95));
          padding: 24px;
        }

        .travel-flow-profile-pills,
        .travel-flow-destination-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .travel-flow-profile-pills span,
        .travel-flow-destination-tags span,
        .travel-flow-service-count {
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(219, 234, 254, 0.78);
          color: var(--blue-800);
          font-size: 0.82rem;
          font-weight: 700;
        }

        .travel-flow-destination-stack {
          display: grid;
          gap: 18px;
          min-width: 0;
        }

        .travel-flow-destination-card {
          position: relative;
          border: 1px solid rgba(203, 213, 225, 0.88);
          border-radius: 24px;
          background: white;
          padding: 22px;
          text-align: left;
          cursor: pointer;
          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease,
            background 0.22s ease;
        }

        .travel-flow-destination-card:hover,
        .travel-flow-destination-card.is-selected {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 20px 42px rgba(37, 99, 235, 0.1);
          background: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(241, 248, 255, 0.96));
        }

        .travel-flow-destination-card.is-selected::before {
          content: "";
          position: absolute;
          top: 50%;
          left: -156px;
          width: 136px;
          height: 3px;
          transform: translateY(-50%);
          background: linear-gradient(90deg, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.95), rgba(125, 211, 252, 0));
          background-size: 220% 100%;
          animation: travelFlowBeam 1.8s linear infinite;
        }

        .travel-flow-destination-card.is-selected::after {
          content: "";
          position: absolute;
          top: calc(50% - 6px);
          left: -24px;
          width: 12px;
          height: 12px;
          border-top: 3px solid rgba(59, 130, 246, 0.95);
          border-right: 3px solid rgba(59, 130, 246, 0.95);
          transform: rotate(45deg);
        }

        .travel-flow-destination-head strong,
        .travel-flow-service-card strong,
        .travel-flow-step-card strong {
          color: var(--blue-950);
          font-family: var(--font-heading);
          font-size: 1.12rem;
          line-height: 1.2;
        }

        .travel-flow-service-focus {
          margin-top: 24px;
        }

        .travel-flow-service-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 22px;
        }

        .travel-flow-service-card {
          border-radius: 22px;
          border: 1px solid rgba(203, 213, 225, 0.82);
          background: rgba(255, 255, 255, 0.86);
          padding: 18px;
          display: grid;
          gap: 16px;
        }

        .travel-flow-service-card-head span {
          display: block;
          margin-top: 6px;
          color: var(--gray-500);
          font-size: 0.8rem;
          line-height: 1.55;
        }

        .travel-flow-service-card a,
        .travel-flow-comparator a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--blue-700);
          font-weight: 800;
        }

        .travel-flow-comparator-wrap {
          overflow-x: auto;
        }

        .travel-flow-comparator {
          width: 100%;
          border-collapse: collapse;
          min-width: 980px;
        }

        .travel-flow-comparator th,
        .travel-flow-comparator td {
          padding: 18px 16px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.82);
          vertical-align: top;
          text-align: left;
        }

        .travel-flow-comparator th {
          color: var(--blue-900);
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .travel-flow-comparator td {
          color: var(--gray-700);
          line-height: 1.7;
          background: rgba(255, 255, 255, 0.4);
        }

        .travel-flow-comparator tr.is-highlighted td {
          background: linear-gradient(90deg, rgba(219, 234, 254, 0.56), rgba(240, 249, 255, 0.92));
        }

        .travel-flow-table-service {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(219, 234, 254, 0.78);
          color: var(--blue-900);
          font-size: 0.88rem;
          font-weight: 800;
        }

        .travel-flow-timeline {
          position: relative;
          display: grid;
          gap: 24px;
        }

        .travel-flow-timeline-track {
          position: absolute;
          top: 32px;
          left: 18px;
          right: 18px;
          height: 2px;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.26), rgba(14, 165, 233, 0.16));
        }

        .travel-flow-timeline-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 14px;
        }

        .travel-flow-step-card {
          position: relative;
          z-index: 1;
          border-radius: 22px;
          border: 1px solid rgba(203, 213, 225, 0.84);
          background: white;
          padding: 18px;
          text-align: left;
          cursor: pointer;
          display: grid;
          gap: 14px;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .travel-flow-step-card:hover,
        .travel-flow-step-card.is-active {
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 18px 36px rgba(37, 99, 235, 0.12);
        }

        .travel-flow-step-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
        }

        .travel-flow-status-pill {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 8px 11px;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .travel-flow-status-pill.is-complete {
          background: rgba(220, 252, 231, 0.94);
          color: #166534;
        }

        .travel-flow-status-pill.is-active {
          background: rgba(219, 234, 254, 0.96);
          color: var(--blue-800);
        }

        .travel-flow-status-pill.is-support {
          background: rgba(241, 245, 249, 0.96);
          color: var(--gray-700);
        }

        .travel-flow-status-pill.is-focus {
          background: rgba(254, 243, 199, 0.94);
          color: #92400e;
        }

        .travel-flow-step-detail {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 18px;
          align-items: center;
        }

        .travel-flow-cta {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: center;
          background:
            radial-gradient(circle at 100% 0%, rgba(125, 211, 252, 0.2), transparent 36%),
            linear-gradient(180deg, rgba(246, 250, 255, 0.98), rgba(235, 244, 255, 0.96));
        }

        .travel-flow-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: flex-end;
        }

        @keyframes travelFlowBeam {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: -20% 50%;
          }
        }

        @media (max-width: 1180px) {
          .travel-flow-service-grid,
          .travel-flow-timeline-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .travel-flow-timeline-track {
            display: none;
          }
        }

        @media (max-width: 980px) {
          .travel-flow-hero-grid,
          .travel-flow-map-grid,
          .travel-flow-cta,
          .travel-flow-step-detail {
            grid-template-columns: 1fr;
          }

          .travel-flow-cta-actions {
            justify-content: flex-start;
          }

          .travel-flow-destination-card.is-selected::before {
            top: -42px;
            left: 34px;
            width: 3px;
            height: 32px;
            transform: none;
            background: linear-gradient(180deg, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.95), rgba(125, 211, 252, 0));
            background-size: 100% 220%;
          }

          .travel-flow-destination-card.is-selected::after {
            top: -16px;
            left: 29px;
            border-top: 3px solid rgba(59, 130, 246, 0.95);
            border-right: 3px solid rgba(59, 130, 246, 0.95);
          }
        }

        @media (max-width: 720px) {
          .travel-flow-hero-stats,
          .travel-flow-service-grid,
          .travel-flow-timeline-grid {
            grid-template-columns: 1fr;
          }

          .travel-flow-panel,
          .travel-flow-cta,
          .travel-flow-profile-card,
          .travel-flow-service-focus,
          .travel-flow-step-detail,
          .travel-flow-destination-card {
            border-radius: 22px;
            padding: 22px;
          }

          .travel-flow-section-head,
          .travel-flow-service-focus-head,
          .travel-flow-hero-card-top,
          .travel-flow-step-top {
            flex-direction: column;
          }

          .travel-flow-comparator {
            min-width: 0;
          }

          .travel-flow-comparator thead {
            display: none;
          }

          .travel-flow-comparator,
          .travel-flow-comparator tbody,
          .travel-flow-comparator tr,
          .travel-flow-comparator td {
            display: block;
            width: 100%;
          }

          .travel-flow-comparator tr {
            border: 1px solid rgba(203, 213, 225, 0.82);
            border-radius: 22px;
            overflow: hidden;
            margin-bottom: 16px;
            background: white;
          }

          .travel-flow-comparator td {
            position: relative;
            padding: 16px 18px 16px 140px;
          }

          .travel-flow-comparator td::before {
            content: attr(data-label);
            position: absolute;
            left: 18px;
            top: 16px;
            color: var(--blue-900);
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
        }

        body.dark .travel-flow-page {
          background:
            radial-gradient(circle at 12% 0%, rgba(56, 189, 248, 0.08), transparent 28%),
            linear-gradient(180deg, #08111f 0%, #0d1728 100%);
        }

        body.dark .travel-flow-panel,
        body.dark .travel-flow-cta,
        body.dark .travel-flow-profile-card,
        body.dark .travel-flow-service-focus,
        body.dark .travel-flow-step-detail,
        body.dark .travel-flow-destination-card,
        body.dark .travel-flow-step-card,
        body.dark .travel-flow-service-card,
        body.dark .travel-flow-comparator td,
        body.dark .travel-flow-comparator tr {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.88));
          border-color: rgba(51, 65, 85, 0.9);
          box-shadow: 0 22px 48px rgba(2, 6, 23, 0.24);
        }

        body.dark .travel-flow-section-head,
        body.dark .travel-flow-profile-card,
        body.dark .travel-flow-service-focus,
        body.dark .travel-flow-step-detail {
          border-color: rgba(51, 65, 85, 0.9);
        }

        body.dark .travel-flow-section-head h2,
        body.dark .travel-flow-service-focus h3,
        body.dark .travel-flow-profile-card h3,
        body.dark .travel-flow-destination-head strong,
        body.dark .travel-flow-service-card strong,
        body.dark .travel-flow-step-card strong,
        body.dark .travel-flow-step-detail h3,
        body.dark .travel-flow-cta h2,
        body.dark .travel-flow-table-service {
          color: #eff6ff;
        }

        body.dark .travel-flow-section-head p,
        body.dark .travel-flow-profile-card p,
        body.dark .travel-flow-destination-card p,
        body.dark .travel-flow-service-card p,
        body.dark .travel-flow-step-card p,
        body.dark .travel-flow-step-detail p,
        body.dark .travel-flow-cta p,
        body.dark .travel-flow-service-card-head span,
        body.dark .travel-flow-comparator td {
          color: #cbd5e1;
        }

        body.dark .travel-flow-icon-shell,
        body.dark .travel-flow-step-icon,
        body.dark .travel-flow-step-detail-icon {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.28), rgba(14, 165, 233, 0.22));
          color: #dbeafe;
          box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.24);
        }

        body.dark .travel-flow-profile-pills span,
        body.dark .travel-flow-destination-tags span,
        body.dark .travel-flow-service-count,
        body.dark .travel-flow-table-service {
          background: rgba(30, 41, 59, 0.96);
          color: #bfdbfe;
        }

        body.dark .travel-flow-comparator th {
          color: #bfdbfe;
        }

        body.dark .travel-flow-comparator tr.is-highlighted td {
          background: linear-gradient(90deg, rgba(30, 41, 59, 0.94), rgba(17, 24, 39, 0.94));
        }
      `}</style>
    </main>
  );
}
