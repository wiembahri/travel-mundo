import {
  FiTarget,
  FiEye,
  FiAward,
  FiUsers,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";
import PageHero from "../components/PageHero";
import { useLanguage } from "../context/LanguageContext";

const VALUES = [
  {
    icon: <FiTarget size={22} />,
    title: "Our mission",
    desc: "To simplify U.S. Passport, U.S. Visa, ESTA, and UK ETA orientation through clear guidance, structured support, and easier access to the right service paths.",
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
  },
  {
    icon: <FiEye size={22} />,
    title: "Our vision",
    desc: "To provide a reliable and user-friendly travel preparation experience for travelers who need clear guidance throughout their administrative journey.",
    color: "var(--blue-700)",
    bg: "var(--blue-50)",
  },
  {
    icon: <FiAward size={22} />,
    title: "Our expertise",
    desc: "We focus on helping clients prepare their files correctly, review key information, and reduce avoidable mistakes before the final portal step.",
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
  },
  {
    icon: <FiUsers size={22} />,
    title: "Our support",
    desc: "Our service is built around guidance, clarity, and ongoing assistance, helping travelers understand each preparation step with confidence.",
    color: "var(--blue-700)",
    bg: "var(--blue-50)",
  },
];

const HIGHLIGHTS = [
  "Clear preparation guidance",
  "Structured preparation guidance",
  "Support before portal handoff",
  "More confidence at every step",
];

export default function About() {
  const { t } = useLanguage();

  return (
    <div style={{ background: "var(--gray-50)", minHeight: "100vh" }}>
      <PageHero
        eyebrow={t("about.eyebrow")}
        icon={<FiShield size={14} />}
        title={
          <>
            {t("about.title")} {t("about.titleAccent")}
          </>
        }
        description={
          <>
            <p>{t("about.subtitle")}</p>
            <div className="tm-trust-row">
              {HIGHLIGHTS.map((item) => (
                <span key={item}>
                  <FiCheckCircle size={14} />
                  {item}
                </span>
              ))}
            </div>
          </>
        }
      >
        <div className="page-hero-list-card">
          <span className="page-hero-list-card__label">Why clients choose us</span>
          <strong className="page-hero-list-card__title">
            Clear, guided, and reassuring support
          </strong>
          {[
            "Understand each preparation step more clearly",
            "Reduce confusion before the final portal step",
            "Prepare information and support items with more confidence",
            "Receive structured support throughout the process",
          ].map((item, index) => (
            <div className="page-hero-list-card__item" key={item}>
              <span>{index + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </PageHero>

      {/* INTRO */}
      <section style={{ padding: "78px 0 34px" }}>
        <div className="container" style={{ maxWidth: 1080 }}>
          <div
            className="about-intro-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 28,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                background: "white",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                padding: "34px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginBottom: 16,
                  fontFamily: "var(--font-heading)",
                }}
              >
                {t("about.whatWeDo")}
              </h2>

              <p
                style={{
                  fontSize: 15,
                  color: "var(--gray-700)",
                  lineHeight: 1.85,
                  marginBottom: 16,
                }}
              >
                {t("about.whatWeDoText")}
              </p>

              <p
                style={{
                  fontSize: 15,
                  color: "var(--gray-700)",
                  lineHeight: 1.85,
                  marginBottom: 16,
                }}
              >
                Our role is to help travelers prepare the required information,
                organize the necessary support items, review key details, and
                understand the next steps before continuing through the
                dedicated portal.
              </p>

              <p
                style={{
                  fontSize: 15,
                  color: "var(--gray-700)",
                  lineHeight: 1.85,
                }}
              >
                We aim to provide a smoother and more reassuring preparation
                experience for travelers by reducing confusion, improving
                clarity, and offering practical support throughout the service
                path.
              </p>
            </div>

            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(57,103,159,0.08), rgba(57,103,159,0.03))",
                border: "1px solid rgba(57,103,159,0.12)",
                borderRadius: "var(--radius-lg)",
                padding: "30px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--blue-700)",
                  marginBottom: 10,
                }}
              >
                {t("about.approach")}
              </div>

              <h3
                style={{
                  fontSize: "1.3rem",
                  marginBottom: 18,
                  fontFamily: "var(--font-heading)",
                  color: "var(--gray-900)",
                }}
              >
                {t("about.approachTitle")}
              </h3>

              <div style={{ display: "grid", gap: 14 }}>
                {[
                  "Easy-to-follow guidance for different service paths",
                  "Preparation support before portal handoff",
                  "Clearer understanding of required information",
                  "A smoother client experience from start to finish",
                ].map((point) => (
                  <div
                    key={point}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      color: "var(--gray-700)",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    <FiCheckCircle
                      size={16}
                      color="var(--blue-600)"
                      style={{ marginTop: 3, flexShrink: 0 }}
                    />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: "44px 0 86px" }}>
        <div className="container">
          <div className="section-header">
            <span className="badge">{t("about.why")}</span>
            <h2 className="section-title">{t("about.whatDefines")}</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Our service is built around clarity, preparation, and support at
              every stage of the preparation journey.
            </p>
          </div>

          <div
            className="about-values-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 24,
            }}
          >
            {VALUES.map((item, i) => (
              <div
                key={i}
                className="card"
                style={{
                  height: "100%",
                  borderRadius: "22px",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: item.bg,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  style={{
                    fontSize: "1.02rem",
                    marginBottom: 10,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: 14,
                    color: "var(--gray-600)",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section style={{ padding: "0 0 88px" }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div
            style={{
              background: "linear-gradient(180deg, white, var(--blue-50))",
              border: "1px solid var(--blue-200)",
              borderRadius: "var(--radius-lg)",
              padding: "24px 26px",
              color: "var(--blue-900)",
              fontSize: 14,
              lineHeight: 1.8,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
                fontWeight: 700,
                color: "var(--blue-800)",
              }}
            >
              <FiShield size={16} />
              {t("about.noticeTitle")}
            </div>

            <div>
              {t("about.notice")}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .about-hero-grid,
          .about-intro-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
