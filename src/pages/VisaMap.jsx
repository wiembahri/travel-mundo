import { useState } from "react";
import { FiExternalLink, FiInfo, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Annotation,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const SCHENGEN_COUNTRIES = [
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Belgium",
  "Netherlands",
  "Portugal",
  "Switzerland",
  "Austria",
  "Poland",
  "Greece",
  "Czech Republic",
  "Denmark",
  "Finland",
  "Hungary",
  "Iceland",
  "Luxembourg",
  "Malta",
  "Norway",
  "Slovakia",
  "Slovenia",
  "Sweden",
  "Estonia",
  "Latvia",
  "Lithuania",
  "Croatia",
];

const COUNTRY_DETAILS = {
  "United States of America": {
    supported: true,
    flag: "🇺🇸",
    title: "United States",
    service: "U.S. Visa / ESTA",
    type: "ESTA or U.S. Visa depending on eligibility",
    procedure: [
      "Choose the correct application type",
      "Complete the online application form",
      "Review your information before submission",
    ],
    documents: [
      "Valid passport",
      "Personal information",
      "Travel details",
      "Supporting documents if required",
    ],
    ctaLabel: "Start application",
    ctaType: "external",
    ctaLink: "https://usimmigrationassistance.com/",
  },
};

function getCountryInfo(name) {
  if (COUNTRY_DETAILS[name]) return COUNTRY_DETAILS[name];

  if (SCHENGEN_COUNTRIES.includes(name)) {
    return {
      supported: true,
      flag: "🇪🇺",
      title: name,
      service: "Schengen Visa",
      type: "Visa required",
      procedure: [
        "Prepare the required documents",
        "Complete the visa application form",
        "Follow the official submission process",
      ],
      documents: [
        "Valid passport",
        "Passport photo",
        "Travel insurance",
        "Accommodation details",
        "Financial proof",
      ],
      ctaLabel: "Start application",
      ctaType: "internal",
      ctaLink: "/services",
    };
  }

  return {
    supported: false,
    title: name,
    service: "Not covered",
    message: "This destination is currently not covered by our services.",
  };
}

export default function VisaMap() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [position, setPosition] = useState({ coordinates: [10, 20], zoom: 1 });

  const info = selectedCountry ? getCountryInfo(selectedCountry) : null;

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.4 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.4 }));
  };

  const handleMoveEnd = (pos) => {
    setPosition(pos);
  };

  return (
    <div
      style={{
        padding: "60px 0 88px",
        background: "var(--gray-50)",
        minHeight: "80vh",
      }}
    >
      <div className="container">
        <div className="section-header">
          <span className="badge">Interactive Map</span>
          <h1 className="section-title">Visa & Travel Services Map</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Click on a destination to view the service type, main procedure,
            required documents, and the next application step.
          </p>
        </div>

        <div
          className="map-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 0.9fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "white",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              padding: "18px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Zoom buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <button
                onClick={handleZoomOut}
                className="btn-ghost"
                style={{ padding: "8px 12px" }}
              >
                <FiZoomOut size={14} />
              </button>
              <button
                onClick={handleZoomIn}
                className="btn-ghost"
                style={{ padding: "8px 12px" }}
              >
                <FiZoomIn size={14} />
              </button>
            </div>

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 120 }}
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={handleMoveEnd}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName = geo.properties.name;
                      const isUSA = countryName === "United States of America";
                      const isSchengen =
                        SCHENGEN_COUNTRIES.includes(countryName);
                      const isSupported = isUSA || isSchengen;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => setSelectedCountry(countryName)}
                          style={{
                            default: {
                              fill: isSupported ? "#39679F" : "#D1D5DB",
                              stroke: "#FFFFFF",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            hover: {
                              fill: isSupported ? "#233B6E" : "#9CA3AF",
                              stroke: "#FFFFFF",
                              strokeWidth: 0.5,
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: isSupported ? "#1B2F58" : "#9CA3AF",
                              stroke: "#FFFFFF",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>

                {/* USA label */}
                <Marker coordinates={[-98, 39]}>
                  <g>
                    <circle r={4} fill="#1B2F58" />
                    <text
                      textAnchor="middle"
                      y={-10}
                      style={{
                        fontFamily: "var(--font-heading)",
                        fill: "#1B2F58",
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      USA
                    </text>
                  </g>
                </Marker>

                {/* Schengen label */}
                <Annotation
                  subject={[10, 52]}
                  dx={30}
                  dy={-20}
                  connectorProps={{
                    stroke: "#233B6E",
                    strokeWidth: 1,
                    strokeLinecap: "round",
                  }}
                >
                  <text
                    x={4}
                    fontSize={11}
                    alignmentBaseline="middle"
                    fill="#1B2F58"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                    }}
                  >
                    Schengen Area
                  </text>
                </Annotation>
              </ZoomableGroup>
            </ComposableMap>

            <div
              style={{
                display: "flex",
                gap: 18,
                marginTop: 14,
                flexWrap: "wrap",
                fontSize: 13,
                color: "var(--gray-600)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    background: "#39679F",
                    borderRadius: 3,
                    display: "inline-block",
                  }}
                />
                Supported destinations
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    background: "#D1D5DB",
                    borderRadius: 3,
                    display: "inline-block",
                  }}
                />
                Not covered
              </div>
            </div>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              minHeight: 420,
            }}
          >
            {info ? (
              <>
                <div
                  style={{
                    background: info.supported
                      ? "linear-gradient(135deg, var(--blue-800), var(--blue-600))"
                      : "var(--gray-400)",
                    color: "white",
                    padding: "22px 24px",
                  }}
                >
                  <h3 style={{ color: "white", marginBottom: 6 }}>
                    {info.title}
                  </h3>
                  <p style={{ fontSize: 13, opacity: 0.9 }}>{info.service}</p>
                </div>

                <div style={{ padding: 24 }}>
                  {info.supported ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          marginBottom: 16,
                          color: "var(--gray-700)",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        <FiInfo
                          size={15}
                          style={{ marginTop: 3, flexShrink: 0 }}
                          color="var(--blue-700)"
                        />
                        <span>
                          <strong>Type:</strong> {info.type}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--gray-500)",
                          marginBottom: 10,
                        }}
                      >
                        Procedure
                      </p>
                      <ul style={{ listStyle: "none", marginBottom: 18 }}>
                        {info.procedure.map((step, i) => (
                          <li
                            key={i}
                            style={{
                              padding: "4px 0",
                              fontSize: 13,
                              color: "var(--gray-700)",
                              lineHeight: 1.6,
                            }}
                          >
                            {i + 1}. {step}
                          </li>
                        ))}
                      </ul>

                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--gray-500)",
                          marginBottom: 10,
                        }}
                      >
                        Main documents
                      </p>
                      <ul style={{ listStyle: "none", marginBottom: 22 }}>
                        {info.documents.map((doc, i) => (
                          <li
                            key={i}
                            style={{
                              padding: "4px 0",
                              fontSize: 13,
                              color: "var(--gray-700)",
                              lineHeight: 1.6,
                            }}
                          >
                            • {doc}
                          </li>
                        ))}
                      </ul>

                      {info.ctaType === "external" ? (
                        <a
                          href={info.ctaLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            display: "inline-flex",
                          }}
                        >
                          <FiExternalLink size={14} /> {info.ctaLabel}
                        </a>
                      ) : (
                        <Link
                          to={info.ctaLink}
                          className="btn-primary"
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            display: "inline-flex",
                          }}
                        >
                          {info.ctaLabel}
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--gray-700)",
                          lineHeight: 1.7,
                          marginBottom: 20,
                        }}
                      >
                        {info.message}
                      </p>

                      <Link
                        to="/contact"
                        className="btn-outline"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          display: "inline-flex",
                        }}
                      >
                        Contact us
                      </Link>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div style={{ padding: 24 }}>
                <h3
                  style={{
                    marginBottom: 10,
                    fontFamily: "var(--font-heading)",
                    color: "var(--gray-800)",
                  }}
                >
                  Select a country
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--gray-600)",
                    lineHeight: 1.7,
                  }}
                >
                  Click on a country on the map to view the visa procedure,
                  required documents, and the next step for the application.
                </p>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .map-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
