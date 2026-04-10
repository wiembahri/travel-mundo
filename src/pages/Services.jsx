import { FiExternalLink, FiClock, FiCheck } from "react-icons/fi";

const SERVICES = [
  {
    title: "Schengen Visa",
    description:
      "Support for Schengen visa applications, including information review, document preparation, and step-by-step guidance throughout the process.",
    docs: [
      "Valid passport",
      "Application form",
      "Recent passport photo",
      "Supporting travel documents",
      "Financial and administrative documents",
    ],
    delay: "Depends on consular processing",
    fees: "Varies by application",
    link: "https://france-visas.gouv.fr",
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
  },
  {
    title: "U.S. Visa",
    description:
      "Assistance with U.S. visa applications depending on the purpose of travel, including tourism, business, transit, or study.",
    docs: [
      "Valid passport",
      "Personal information",
      "Travel purpose details",
      "Supporting documents",
      "Additional documents depending on profile",
    ],
    delay: "Depends on availability and processing time",
    fees: "Varies by application",
    link: "https://travel.state.gov",
    color: "var(--blue-700)",
    bg: "var(--blue-50)",
  },
  {
    title: "Passport",
    description:
      "Assistance with passport-related applications, including new applications, renewals, certain corrections, and preparation before official submission.",
    docs: [
      "Identity document",
      "Previous passport if renewing",
      "Passport photo",
      "Required administrative documents",
      "Information needed for processing",
    ],
    delay: "Depends on the official procedure",
    fees: "Varies by service",
    link: "https://mypassportcenter.com/",
    color: "var(--blue-800)",
    bg: "var(--blue-50)",
  },
  {
    title: "ETA / ESTA",
    description:
      "Guided support for electronic travel authorizations, including form completion, information review, and submission assistance based on traveler eligibility.",
    docs: [
      "Valid biometric passport",
      "Personal information",
      "Travel purpose",
      "Required contact details",
      "Travel information",
    ],
    delay: "Usually processed quickly",
    fees: "Varies by destination",
    link: "https://esta.cbp.dhs.gov/",
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
  },
];

export default function Services() {
  return (
    <div
      style={{
        padding: "60px 0 88px",
        background: "var(--gray-50)",
        minHeight: "80vh",
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="badge">Our Services</span>
          <h1 className="section-title">Our application support services</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Travel Mundo supports clients with Schengen visa, U.S. visa,
            passport, and ETA / ESTA applications through a clear and guided
            process.
          </p>
        </div>

        {/* Services grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {SERVICES.map((service, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--gray-200)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              {/* Top section */}
              <div
                style={{
                  background: service.color,
                  padding: "20px 24px",
                  color: "white",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    fontSize: "1.15rem",
                    fontFamily: "var(--font-heading)",
                    marginBottom: 6,
                  }}
                >
                  {service.title}
                </h3>
                <p style={{ fontSize: 13, opacity: 0.88, lineHeight: 1.5 }}>
                  {service.description}
                </p>
              </div>

              {/* Body */}
              <div style={{ padding: "20px 24px", flexGrow: 1 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--gray-500)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 12,
                  }}
                >
                  Required items
                </p>

                <ul style={{ listStyle: "none", marginBottom: 18 }}>
                  {service.docs.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "4px 0",
                        fontSize: 13,
                        color: "var(--gray-700)",
                      }}
                    >
                      <FiCheck
                        size={13}
                        color={service.color}
                        style={{ marginTop: 2, flexShrink: 0 }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div style={{ display: "flex", gap: 10 }}>
                  <div
                    style={{
                      flex: 1,
                      background: service.bg,
                      borderRadius: 8,
                      padding: "8px 12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        color: "var(--gray-500)",
                        marginBottom: 2,
                      }}
                    >
                      <FiClock size={11} /> Processing
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: service.color,
                      }}
                    >
                      {service.delay}
                    </p>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      background: "var(--gray-50)",
                      borderRadius: 8,
                      padding: "8px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--gray-500)",
                        marginBottom: 2,
                      }}
                    >
                      Fees
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--gray-700)",
                      }}
                    >
                      {service.fees}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "0 24px 20px", display: "flex", gap: 10 }}>
                <a
                  href={service.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    background: service.color,
                    fontSize: 13,
                    padding: "10px 16px",
                  }}
                >
                  <FiExternalLink size={14} /> Access service
                </a>
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "var(--gray-500)",
            marginTop: 28,
          }}
        >
          Travel Mundo is a private assistance service and is not affiliated
          with any government authority. Applications are completed through the
          relevant official offices or platforms.
        </p>
      </div>
    </div>
  );
}
