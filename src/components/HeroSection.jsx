import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiClock,
  FiGlobe,
  FiFileText,
  FiSearch,
  FiSend,
} from "react-icons/fi";

export default function HeroSection() {
  const features = [
    { icon: <FiShield size={15} />, text: "Secure process" },
    { icon: <FiClock size={15} />, text: "Fast guidance" },
    { icon: <FiGlobe size={15} />, text: "UK & US support" },
  ];

  const steps = [
    {
      icon: <FiFileText size={16} />,
      title: "Choose service",
      text: "Select the right preparation path.",
    },
    {
      icon: <FiSearch size={16} />,
      title: "Review items",
      text: "Check preparation details before handoff.",
    },
    {
      icon: <FiSend size={16} />,
      title: "Submit clearly",
      text: "Follow a simple guided process.",
    },
  ];

  return (
    <section className="tm-hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-kicker">
            <FiCheckCircle size={14} /> Private preparation assistance
          </span>

          <h1>
            Travel assistance for the <span>UK and the US</span>
          </h1>

          <p>
            Prepare, review, and track your U.S. Passport, U.S. Visa, ESTA,
            and UK ETA requests through guided support and clear next steps.
          </p>

          <div className="hero-actions">
            <Link to="/orientation" className="hero-btn primary">
              Start Orientation <FiArrowRight />
            </Link>

            <Link to="/suivi" className="hero-btn secondary">
              Check your request <FiArrowRight />
            </Link>
          </div>

          <div className="hero-features">
            {features.map((f) => (
              <div key={f.text}>
                {f.icon}
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-steps">
          {steps.map((s, i) => (
            <div key={s.title}>
              <span>{s.icon}</span>
              <strong>{s.title}</strong>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tm-hero-section {
          padding: 110px 0 90px;
          background: linear-gradient(135deg, #173763 0%, #27548f 54%, #5a8dca 100%);
          color: white;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          max-width: 1200px;
          margin: auto;
          align-items: center;
        }

        .hero-copy h1 {
          margin: 20px 0;
          color: white;
          font-size: clamp(2.4rem, 5vw, 4.5rem);
          line-height: 1;
        }

        .hero-copy h1 span {
          color: #dbeafe;
        }

        .hero-copy p {
          max-width: 620px;
          color: rgba(255,255,255,0.82);
          line-height: 1.75;
          margin-bottom: 30px;
        }

        .hero-kicker,
        .hero-features div {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 700;
        }

        .hero-actions,
        .hero-features {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hero-features {
          margin-top: 22px;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 48px;
          border-radius: 999px;
          padding: 13px 22px;
          font-weight: 800;
        }

        .hero-btn.primary {
          background: white;
          color: #173763;
          box-shadow: 0 18px 34px rgba(0,0,0,0.18);
        }

        .hero-btn.secondary {
          border: 1px solid rgba(255,255,255,0.25);
          color: white;
          background: rgba(255,255,255,0.1);
        }

        .hero-steps {
          display: grid;
          gap: 14px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 28px;
          background: rgba(255,255,255,0.12);
          padding: 24px;
          box-shadow: 0 28px 70px rgba(0,0,0,0.2);
          backdrop-filter: blur(16px);
        }

        .hero-steps div {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 4px 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.08);
          padding: 16px;
        }

        .hero-steps span {
          grid-row: span 2;
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: rgba(255,255,255,0.14);
        }

        .hero-steps strong {
          color: white;
        }

        .hero-steps p {
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
