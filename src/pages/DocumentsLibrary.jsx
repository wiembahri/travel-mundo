import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import {
  FiAlertCircle,
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiCompass,
  FiFileText,
  FiGlobe,
  FiSearch,
} from "react-icons/fi";
import { DOCUMENTS_LIBRARY } from "../data/documentsLibrary";
import { useAIContext } from "../context/AIContext";

const ALL_SERVICES = "All";

const SERVICE_LABELS = {
  "U.S. Passport": "Passport",
  "U.S. Visa": "Visa",
  ESTA: "ESTA",
  "UK ETA": "ETA",
};

const INSTRUCTION_TITLES = {
  "U.S. Visa": "Visa Instructions",
  ESTA: "ESTA Instructions",
  "UK ETA": "ETA Instructions",
  "U.S. Passport": "Passport Instructions",
};

const SERVICE_FILTERS = [
  ALL_SERVICES,
  ...DOCUMENTS_LIBRARY.map((service) => service.service),
];

function getServiceIcon(service) {
  if (service === "U.S. Passport") return <FiFileText size={22} />;
  if (service === "U.S. Visa") return <FiBriefcase size={22} />;
  if (service === "ESTA") return <FiGlobe size={22} />;
  return <FiCompass size={22} />;
}

function getBadgeClass(badge) {
  if (badge === "Required") return "required";
  if (badge === "Common mistake") return "mistake";
  return "recommended";
}

function LibrarySection({ title, icon, items, showBadges = false }) {
  return (
    <div className="documents-section">
      <h3>
        {icon}
        {title}
      </h3>
      <ul>
        {items.map((item) => {
          const label = typeof item === "string" ? item : item.label;
          const badge = typeof item === "string" ? null : item.badge;

          return (
            <li key={`${title}-${label}`}>
              <span>{label}</span>
              {showBadges && badge && (
                <em className={`documents-badge ${getBadgeClass(badge)}`}>
                  {badge}
                </em>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function DocumentsLibrary() {
  const { setAssistantContext, resetAssistantContext } = useAIContext();
  const [activeService, setActiveService] = useState(ALL_SERVICES);
  const [query, setQuery] = useState("");

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return DOCUMENTS_LIBRARY.filter((service) => {
      const matchesService =
        activeService === ALL_SERVICES || service.service === activeService;

      if (!matchesService) return false;
      if (!normalizedQuery) return true;

      const searchable = [
        service.service,
        service.shortName,
        service.destination,
        service.description,
        ...(service.preparationSteps || []),
        ...service.documents.map((item) => item.label),
        ...service.information.map((item) => item.label),
        ...service.mistakes.map((item) => item.label),
        ...service.tips.map((item) => item.label),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [activeService, query]);

  useEffect(() => {
    const focusService =
      activeService !== ALL_SERVICES ? activeService : filteredServices[0]?.service || "";
    const focusDestination =
      activeService !== ALL_SERVICES
        ? DOCUMENTS_LIBRARY.find((service) => service.service === activeService)
            ?.destination || ""
        : filteredServices[0]?.destination || "";

    setAssistantContext({
      currentPage: "instructions",
      recommendedService: focusService,
      destination: focusDestination,
      journeyStep: "Instructions review",
      readinessScore: null,
      riskLevel: "",
      checklistProgress: null,
      activeService: activeService === ALL_SERVICES ? "" : activeService,
      warnings:
        activeService === ALL_SERVICES
          ? ["Choose a service filter to focus the instruction guidance."]
          : [],
      missingDocuments: [],
    });
  }, [activeService, filteredServices, setAssistantContext]);

  useEffect(() => () => resetAssistantContext(), [resetAssistantContext]);

  return (
    <main className="documents-page">
      <PageHero
        eyebrow="Instructions"
        icon={<FiFileText size={14} />}
        title="Instructions"
        description="Review preparation steps, required preparation items, and useful links for Visa, ESTA, UK ETA, and Passport guidance."
      />

      <section className="tm-section tm-section-soft">
        <div className="container documents-layout">
          <div className="documents-controls">
            <div className="documents-search">
              <FiSearch size={17} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a service, instruction, or step"
                aria-label="Search instructions"
              />
            </div>

            <div className="documents-filter" aria-label="Filter by service">
              {SERVICE_FILTERS.map((service) => (
                <button
                  key={service}
                  type="button"
                  className={activeService === service ? "active" : ""}
                  onClick={() => setActiveService(service)}
                >
                  {service === ALL_SERVICES
                    ? ALL_SERVICES
                    : SERVICE_LABELS[service] || service}
                </button>
              ))}
            </div>
          </div>

          {filteredServices.length ? (
            <div className="documents-grid">
              {filteredServices.map((service) => (
                <article className="documents-card" key={service.service}>
                  <div className="documents-card-head">
                    <div className="documents-service-icon">
                      {getServiceIcon(service.service)}
                    </div>
                    <div>
                      <p>{service.destination}</p>
                      <h2>
                        {INSTRUCTION_TITLES[service.service] ||
                          `${service.shortName || service.service} Instructions`}
                      </h2>
                    </div>
                  </div>

                  <p className="documents-card-description">
                    {service.description}
                  </p>

                  <div className="documents-card-body">
                    <LibrarySection
                      title="Preparation steps"
                      icon={<FiCompass size={15} />}
                      items={service.preparationSteps || []}
                    />
                    <LibrarySection
                      title="Required preparation items"
                      icon={<FiCheckCircle size={15} />}
                      items={service.documents}
                      showBadges
                    />
                    <LibrarySection
                      title="Information to verify"
                      icon={<FiFileText size={15} />}
                      items={service.information}
                      showBadges
                    />
                    <LibrarySection
                      title="Review points"
                      icon={<FiAlertCircle size={15} />}
                      items={service.mistakes}
                      showBadges
                    />
                  </div>

                  <div className="documents-actions">
                    <Link className="documents-link secondary" to="/suivi">
                      Track reference <FiArrowRight size={15} />
                    </Link>
                    <a
                      className="documents-link"
                      href={service.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open dedicated portal <FiArrowRight size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="documents-empty">
              <div className="documents-service-icon">
                <FiSearch size={20} />
              </div>
              <h2>No instructions found</h2>
              <p>Try another service or a broader search term.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
