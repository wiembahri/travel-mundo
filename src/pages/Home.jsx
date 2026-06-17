import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCompass,
  FiCreditCard,
  FiFileText,
  FiGlobe,
  FiMapPin,
  FiNavigation,
  FiShield,
} from "react-icons/fi";

const SERVICES = [
  {
    icon: <FiCreditCard size={22} />,
    label: "United States",
    title: "U.S. Visa",
    desc: "Structured preparation for travelers who need a visa path, supporting items, and interview readiness.",
  },
  {
    icon: <FiShield size={22} />,
    title: "ESTA",
    label: "United States",
    desc: "Guidance for short tourism, business, or transit travel before opening the dedicated U.S. portal.",
  },
  {
    icon: <FiCompass size={22} />,
    title: "UK ETA",
    label: "United Kingdom",
    desc: "Clear orientation for passport, purpose, and contact details before continuing through the UK ETA path.",
  },
  {
    icon: <FiFileText size={22} />,
    title: "U.S. Passport",
    label: "U.S. citizens",
    desc: "Preparation support for renewal, new passport, correction, and related passport service cases.",
  },
];

const PROCESS = [
  {
    title: "Choose your destination and purpose",
    desc: "Start with the UK or U.S. travel path that matches your trip, passport profile, and travel purpose.",
  },
  {
    title: "Review preparation readiness",
    desc: "Check the main information, documents, and readiness items before you move to the next step.",
  },
  {
    title: "Continue on the dedicated portal",
    desc: "Open the right external portal once your Travel Mundo orientation and preparation review are clear.",
  },
];

const SERVICE_BADGES = ["U.S. Visa", "ESTA", "UK ETA", "U.S. Passport"];

const TOOL_LINKS = [
  {
    to: "/smart-diagnosis",
    eyebrow: "Traveler information",
    title: "Smart Diagnosis",
    text: "Analyze traveler information, identity consistency, passport status, travel history, and local photo compatibility.",
    cta: "Open diagnosis",
  },
  {
    to: "/travel-flow",
    eyebrow: "Preparation flow",
    title: "Travel Journey",
    text: "Visualize the preparation journey from orientation to readiness review, instructions, report generation, and dedicated portal handoff.",
    cta: "Explore journey",
  },
  {
    to: "/visa-scoring",
    eyebrow: "Readiness report",
    title: "Readiness Review",
    text: "Review preparation items, risk level, readiness score, recommendations, and generate a structured PDF report.",
    cta: "Review readiness",
  },
];

export default function Home() {
  return (
    <main className="tm-home">
      <PageHero
        variant="primary"
        eyebrow="Travel Mundo preparation hub"
        icon={<FiShield size={14} />}
        title="Prepare your U.S. and UK travel services with confidence"
        description={
          <>
            <p>
              Travel Mundo centralizes guidance for U.S. Visa, ESTA, UK ETA,
              and U.S. Passport services, helping travelers choose the right
              path, review preparation items, and continue on dedicated portals.
            </p>

            <div className="tm-hero-actions">
              <Link to="/orientation" className="tm-btn tm-btn-primary">
                Start Orientation <FiArrowRight />
              </Link>
              <Link to="/services" className="tm-btn tm-btn-secondary">
                View Services <FiArrowRight />
              </Link>
            </div>

            <div className="tm-trust-row">
              {SERVICE_BADGES.map((item) => (
                <span key={item}>
                  <FiCheckCircle size={15} />
                  {item}
                </span>
              ))}
            </div>
          </>
        }
      >
        <div className="tm-travel-visual" aria-hidden="true">
          <div className="tm-orbit-ring" />
          <div className="tm-visual-card tm-hub-card">
            <div className="tm-passport-topline">
              <span>Travel Mundo</span>
              <strong>UK / US</strong>
            </div>
            <div className="tm-passport-mark tm-hub-mark">
              <FiGlobe size={34} />
            </div>
            <strong>Travel Preparation Hub</strong>
            <small>Guidance, readiness, instructions, portal handoff</small>
          </div>

          <div className="tm-visual-card tm-flight-card">
            <div>
              <span>Route</span>
              <strong>UK</strong>
            </div>
            <FiNavigation size={20} />
            <div>
              <span>Route</span>
              <strong>US</strong>
            </div>
          </div>

          <div className="tm-visual-card tm-checklist-card">
            {["Profile review", "Preparation items", "Dedicated portal"].map((item) => (
              <div key={item}>
                <FiCheckCircle size={15} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="tm-map-pin">
            <FiMapPin size={22} />
          </div>
        </div>
      </PageHero>

      <section className="tm-section tm-section-soft">
        <div className="container">
          <div className="tm-section-head">
            <span className="tm-eyebrow">Services overview</span>
            <h2>Four preparation paths for UK and U.S. travel.</h2>
            <p>
              Each service keeps the focus on orientation, preparation items,
              readiness review, and the next dedicated portal step.
            </p>
          </div>

          <div className="tm-service-showcase">
            {SERVICES.map((service) => (
              <Link to="/services" className="tm-premium-card" key={service.title}>
                <div className="tm-card-icon">{service.icon}</div>
                <span className="tm-card-label">{service.label}</span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <span>
                  View guidance <FiArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="tm-section tm-confidence-section tm-smart-tools-section">
        <div className="container">
          <div className="tm-section-head">
            <span className="tm-eyebrow">Smart preparation tools</span>
            <h2>Smart preparation tools</h2>
            <p>
              Use advanced preparation tools to review traveler information,
              understand the journey, and generate a readiness report before
              continuing on the dedicated portal.
            </p>
          </div>

          <div className="tm-tools-grid">
            {TOOL_LINKS.map((tool, index) => (
              <Link to={tool.to} className="tm-tool-card" key={tool.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small className="tm-tool-card__eyebrow">{tool.eyebrow}</small>
                <h3>{tool.title}</h3>
                <p>{tool.text}</p>
                <strong className="tm-tool-card__cta">
                  {tool.cta} <FiArrowRight size={14} />
                </strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="tm-section">
        <div className="container tm-split-section">
          <div className="tm-section-head tm-section-head-left">
            <span className="tm-eyebrow">How Travel Mundo helps</span>
            <h2>A clear preparation sequence before portal handoff.</h2>
            <p>
              Travel Mundo keeps the traveler journey organized without
              presenting itself as a government service platform.
            </p>
            <Link to="/orientation" className="tm-btn tm-btn-primary">
              Start Orientation <FiArrowRight />
            </Link>
          </div>

          <div className="tm-process-list">
            {PROCESS.map((step, index) => (
              <div className="tm-process-item" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tm-final-cta">
        <div className="container">
          <div className="tm-final-cta-inner">
            <span className="tm-eyebrow">Ready to begin</span>
            <h2>Start with orientation, then continue on the right portal.</h2>
            <p>
              Choose a service path, review readiness, and move forward with a
              clearer understanding of the next preparation step.
            </p>
            <div className="tm-hero-actions">
              <Link to="/services" className="tm-btn tm-btn-light">
                View Services <FiArrowRight />
              </Link>
              <Link to="/contact" className="tm-btn tm-btn-ghost-light">
                Contact Us <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
