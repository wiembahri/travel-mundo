import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiMapPin,
  FiFileText,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiFileText size={22} />,
    title: "Schengen Visa",
    desc: "Guided support for Schengen visa applications, including document preparation and information review.",
    to: "/services",
    bg: "var(--blue-50)",
    color: "var(--blue-600)",
  },
  {
    icon: <FiShield size={22} />,
    title: "U.S. Visa",
    desc: "Application assistance for U.S. visas based on the purpose of travel, including tourism, business, transit, and study.",
    to: "/services",
    bg: "var(--blue-50)",
    color: "var(--blue-700)",
  },
  {
    icon: <FiMapPin size={22} />,
    title: "ETA / ESTA",
    desc: "Support for electronic travel authorizations with guided form completion and review before submission.",
    to: "/services",
    bg: "var(--blue-50)",
    color: "var(--blue-600)",
  },
  {
    icon: <FiUsers size={22} />,
    title: "Passport",
    desc: "Assistance with passport applications, renewals, and preparation before official submission.",
    to: "/services",
    bg: "var(--blue-50)",
    color: "var(--blue-700)",
  },
];

const STATS = [
  {
    value: "5,000+",
    label: "Applications handled",
    icon: <FiFileText size={18} />,
  },
  { value: "120+", label: "Countries covered", icon: <FiMapPin size={18} /> },
  {
    value: "98%",
    label: "Client satisfaction",
    icon: <FiCheckCircle size={18} />,
  },
  { value: "24/7", label: "Support availability", icon: <FiClock size={18} /> },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Choose your service",
    desc: "Select the service that fits your needs: Schengen Visa, U.S. Visa, Passport, or ETA / ESTA.",
  },
  {
    num: "02",
    title: "Complete your application",
    desc: "Fill in the required information through a simple and guided process.",
  },
  {
    num: "03",
    title: "Review and preparation",
    desc: "Your information is checked to help reduce errors and prepare your application correctly.",
  },
  {
    num: "04",
    title: "Submit and track",
    desc: "Receive the next steps for official submission and follow the progress of your request.",
  },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 55%, var(--blue-500) 100%)",
          padding: "96px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "60%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.025)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "var(--blue-100)",
                padding: "6px 16px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-heading)",
                marginBottom: 28,
              }}
            >
              <FiShield size={13} /> Private application assistance
            </span>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.12,
                marginBottom: 22,
                fontFamily: "var(--font-heading)",
              }}
            >
              Visa and passport applications{" "}
              <span
                style={{
                  color: "var(--blue-300)",
                  borderBottom: "3px solid var(--blue-400)",
                  paddingBottom: 2,
                }}
              >
                made simpler
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.15rem",
                color: "rgba(255,255,255,0.82)",
                maxWidth: 620,
                marginBottom: 40,
                lineHeight: 1.75,
              }}
            >
              Travel Mundo supports clients with Schengen Visa, U.S. Visa,
              Passport, and ETA / ESTA applications through guided forms,
              information review, and clear submission steps.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link
                to="/services"
                className="btn-primary"
                style={{
                  background: "white",
                  color: "var(--blue-700)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                  fontSize: 15,
                }}
              >
                Explore services <FiArrowRight />
              </Link>
              <Link
                to="/contact"
                className="btn-outline"
                style={{
                  borderColor: "rgba(255,255,255,0.45)",
                  color: "white",
                }}
              >
                Contact us
              </Link>
            </div>

            <div
              style={{
                marginTop: 44,
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {[
                "Guided application process",
                "Information review before submission",
                "Official submission steps included",
              ].map((text, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <FiCheckCircle size={14} color="var(--blue-300)" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        style={{
          background: "white",
          borderBottom: "1px solid var(--gray-200)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "32px 24px",
                  textAlign: "center",
                  borderRight:
                    i < STATS.length - 1 ? "1px solid var(--gray-200)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                    color: "var(--blue-500)",
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "var(--blue-700)",
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--gray-500)",
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "88px 0", background: "var(--gray-50)" }}>
        <div className="container">
          <div className="section-header">
            <span className="badge">What we offer</span>
            <h2 className="section-title">Application support services</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              We help simplify application processes by guiding users through
              forms, reviewing information, and preparing them for official
              submission.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {FEATURES.map((f, i) => (
              <Link key={i} to={f.to} style={{ display: "block" }}>
                <div className="card" style={{ height: "100%" }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      background: f.bg,
                      color: f.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 18,
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      marginBottom: 10,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--gray-600)",
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
                    {f.desc}
                  </p>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      color: f.color,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Learn more <FiArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "88px 0", background: "white" }}>
        <div className="container">
          <div className="section-header">
            <span className="badge">How it works</span>
            <h2 className="section-title">Your application in 4 steps</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              From choosing the right service to preparing for submission, the
              process is designed to be clear and easy to follow.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 32,
              position: "relative",
            }}
          >
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--blue-700), var(--blue-500))",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: 18,
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    marginBottom: 10,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--gray-600)",
                    lineHeight: 1.65,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "88px 0",
          background:
            "linear-gradient(135deg, var(--blue-900), var(--blue-700))",
          textAlign: "center",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiUsers size={24} color="white" />
            </div>
          </div>

          <h2
            style={{
              color: "white",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              marginBottom: 16,
              fontFamily: "var(--font-heading)",
            }}
          >
            Ready to get started?
          </h2>

          <p
            style={{
              color: "var(--blue-200)",
              fontSize: "1.05rem",
              maxWidth: 560,
              margin: "0 auto 36px",
            }}
          >
            Explore our services and get guided support for your visa, passport,
            ETA, or ESTA application.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/services"
              className="btn-primary"
              style={{
                background: "white",
                color: "var(--blue-700)",
                fontSize: 16,
                padding: "14px 32px",
              }}
            >
              View services <FiArrowRight />
            </Link>
            <Link
              to="/contact"
              className="btn-outline"
              style={{
                borderColor: "rgba(255,255,255,0.4)",
                color: "white",
                fontSize: 16,
              }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
  