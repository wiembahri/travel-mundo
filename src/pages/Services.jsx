import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import PageHero from "../components/PageHero";
import {
  FiArrowRight,
  FiCompass,
  FiFileText,
  FiGlobe,
  FiMap,
  FiNavigation,
  FiShield,
} from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const SERVICES = [
  {
    title: "U.S. Visa",
    icon: FiMap,
    destination: "United States",
    focus: "Travel profile, DS-160 readiness, supporting evidence",
    description:
      "Structured guidance for travelers whose purpose, duration, or profile points to a U.S. visa path.",
    link: "https://usimmigrationassistance.com/apply/?gadid=773046734052",
    color: "var(--tm-navy)",
    bg: "var(--tm-soft)",
    badge: "Visa support",
  },
  {
    title: "ESTA",
    icon: FiGlobe,
    destination: "United States",
    focus: "Visa Waiver eligibility, passport data, travel purpose",
    description:
      "Preparation support for eligible tourism, business, or transit travel to the United States.",
    link: "https://usimmigrationassistance.com/apply/?gadid=773046734052",
    color: "var(--tm-blue)",
    bg: "var(--tm-soft)",
    badge: "Short-stay travel",
  },
  {
    title: "UK ETA",
    icon: FiCompass,
    destination: "United Kingdom",
    focus: "Passport details, visit purpose, photo readiness",
    description:
      "Guided preparation for short UK visits before continuing through the dedicated ETA portal.",
    link: "https://uketasupport.com/",
    color: "var(--tm-navy-dark)",
    bg: "var(--tm-soft)",
    badge: "UK travel",
  },
  {
    title: "U.S. Passport",
    icon: FiFileText,
    destination: "U.S. citizens",
    focus: "Identity, citizenship proof, photo, case type",
    description:
      "Preparation guidance for renewals, new passport requests, corrections, and related cases.",
    link: "https://mypassportcenter.com/",
    color: "var(--tm-red)",
    bg: "var(--tm-soft)",
    badge: "Passport service",
  },
];

export default function Services() {
  const { t } = useLanguage();

  const serviceHighlights = [
    {
      icon: <FiCompass />,
      title: "Guided orientation",
      text: "Start from destination, purpose, nationality, and passport profile.",
    },
    {
      icon: <FiFileText />,
      title: "Preparation focus",
      text: "Review the main items and information to organize before handoff.",
    },
    {
      icon: <FiNavigation />,
      title: "Dedicated portal",
      text: "Continue through the right dedicated portal after preparation.",
    },
  ];

  return (
    <main className="tm-page">
      <PageHero
        eyebrow="Travel Mundo services"
        icon={<FiShield size={14} />}
        title="Choose the right preparation path for U.S. and UK travel."
        description="Compare the supported service paths and continue with guided preparation before opening the dedicated portal."
      >
        <div className="tm-services-panel">
          <div className="tm-services-panel-map" aria-hidden="true">
            <FiGlobe size={34} />
          </div>
          <strong>U.S. Visa - ESTA - UK ETA - U.S. Passport</strong>
          <span>One administrative hub for orientation and preparation.</span>
          <a href="#service-paths">
            View service paths <FiArrowRight size={14} />
          </a>
        </div>
      </PageHero>

      <section className="tm-section tm-section-soft">
        <div className="container">
          <div className="tm-services-highlights">
            {serviceHighlights.map((item) => (
              <div key={item.title}>
                <span>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="tm-section-head" id="service-paths">
            <span className="tm-eyebrow">Service paths</span>
            <h2>Focused service cards for each travel need.</h2>
            <p>
              Each card gives a compact view of the destination, preparation
              focus, and dedicated portal path.
            </p>
          </div>

          <div className="tm-services-grid">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>

          <div className="tm-notice-card">
            <div>
              <FiShield size={18} />
              <strong>{t("services.noticeTitle")}</strong>
            </div>
            <p>{t("services.notice")}</p>
          </div>

          <div className="tm-service-tools-card">
            <div className="tm-service-tools-card__copy">
              <p className="tm-service-tools-kicker">Smart preparation tools</p>
              <h3>Need a deeper preparation check?</h3>
              <p>
                Open Smart Diagnosis for traveler information and photo
                compatibility, or continue to Readiness Review for a score,
                recommendations, and report.
              </p>
            </div>

            <div className="tm-service-tools-actions">
              <Link to="/smart-diagnosis" className="tm-btn tm-btn-primary">
                Smart Diagnosis <FiArrowRight size={14} />
              </Link>
              <Link to="/visa-scoring" className="tm-btn tm-btn-secondary">
                Readiness Review <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
