import { FiTarget, FiEye, FiAward, FiUsers } from "react-icons/fi";

const VALUES = [
  {
    icon: <FiTarget size={22} />,
    title: "Our mission",
    desc: "To simplify visa, passport, ETA, and ESTA application processes through clear guidance, structured support, and easier access to the right application steps.",
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
  },
  {
    icon: <FiEye size={22} />,
    title: "Our vision",
    desc: "To provide a reliable and user-friendly application support experience for travelers who need clear guidance throughout their administrative journey.",
    color: "var(--blue-700)",
    bg: "var(--blue-50)",
  },
  {
    icon: <FiAward size={22} />,
    title: "Our expertise",
    desc: "We focus on helping clients prepare their applications correctly, review key information, and reduce avoidable mistakes before official submission.",
    color: "var(--blue-600)",
    bg: "var(--blue-50)",
  },
  {
    icon: <FiUsers size={22} />,
    title: "Our support",
    desc: "Our service is built around guidance, clarity, and ongoing assistance, helping applicants understand each step of the process with confidence.",
    color: "var(--blue-700)",
    bg: "var(--blue-50)",
  },
];

export default function About() {
  return (
    <div style={{ background: "var(--gray-50)", minHeight: "80vh" }}>
      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(135deg, var(--blue-900), var(--blue-700))",
          padding: "80px 0",
          textAlign: "center",
          color: "white",
        }}
      >
        <div className="container">
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            About Travel Mundo
          </span>

          <h1
            style={{
              color: "white",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              marginBottom: 16,
              marginTop: 8,
            }}
          >
            Trusted support for visa
            <br />
            and passport applications
          </h1>

          <p
            style={{
              color: "var(--blue-200)",
              fontSize: "1.1rem",
              maxWidth: 700,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Travel Mundo is a private assistance service that helps clients with
            visa, passport, ETA, and ESTA application processes through guided
            steps, information review, and structured support.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding: "70px 0 30px" }}>
        <div className="container" style={{ maxWidth: 950 }}>
          <div
            style={{
              background: "white",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2
              style={{
                fontSize: "1.4rem",
                marginBottom: 14,
                fontFamily: "var(--font-heading)",
              }}
            >
              What we do
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--gray-700)",
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              Travel Mundo supports clients with Schengen Visa, U.S. Visa,
              Passport, and ETA / ESTA applications by making the process easier
              to understand and follow.
            </p>
            <p
              style={{
                fontSize: 15,
                color: "var(--gray-700)",
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              Our role is to help applicants complete the required information,
              prepare the necessary documents, review key details, and
              understand the next steps before official submission through the
              relevant offices or platforms.
            </p>
            <p
              style={{
                fontSize: 15,
                color: "var(--gray-700)",
                lineHeight: 1.8,
              }}
            >
              We aim to provide a smoother and more reassuring experience for
              applicants by reducing confusion, improving clarity, and offering
              practical support throughout the process.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "50px 0 80px" }}>
        <div className="container">
          <div className="section-header">
            <span className="badge">Why Travel Mundo</span>
            <h2 className="section-title">What defines our approach</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Our service is built around clarity, preparation, and support at
              every stage of the application journey.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 24,
            }}
          >
            {VALUES.map((item, i) => (
              <div key={i} className="card">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
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
                    fontSize: "1rem",
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
                    lineHeight: 1.65,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container" style={{ maxWidth: 950 }}>
          <div
            style={{
              background: "var(--blue-50)",
              border: "1px solid var(--blue-200)",
              borderRadius: "var(--radius-md)",
              padding: "20px 24px",
              color: "var(--blue-800)",
              fontSize: 14,
              lineHeight: 1.75,
            }}
          >
            <strong>Important notice:</strong> Travel Mundo is a private
            assistance service and is not affiliated with any government
            authority. Applications are completed through the relevant official
            offices or platforms.
          </div>
        </div>
      </section>
    </div>
  );
}
