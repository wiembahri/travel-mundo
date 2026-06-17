import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiClock,
  FiHeadphones,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const SERVICE_LINKS = ["U.S. Visa", "ESTA", "UK ETA", "U.S. Passport"];

const PLATFORM_LINKS = [
  { to: "/orientation", label: "Orientation" },
  { to: "/instructions", label: "Instructions" },
  { to: "/suivi", label: "Track" },
  { to: "/visa-scoring", label: "Readiness Review" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="tm-footer">
      <div className="container">
        <div className="tm-footer-grid">
          <div className="tm-footer-brand">
            <div className="tm-footer-brand-row">
              <div className="tm-footer-logo">
                <img
                  src="/travel-mundo-logo.png"
                  alt="Travel Mundo"
                  className="tm-brand-logo"
                />
              </div>
              <span>
                Travel<strong>Mundo</strong>
              </span>
            </div>

            <p>
              Centralized travel preparation and orientation for UK and U.S.
              services.
            </p>
            <div className="tm-footer-badge">Administrative travel hub</div>
          </div>

          <div className="tm-footer-column">
            <h4>Services</h4>
            <ul>
              {SERVICE_LINKS.map((service) => (
                <li key={service}>
                  <Link to="/services">{service}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="tm-footer-column">
            <h4>Platform</h4>
            <ul>
              {PLATFORM_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="tm-footer-column tm-footer-contact">
            <h4>Contact</h4>

            {[
              { icon: <FiMapPin size={14} />, text: t("footer.onlineSupport") },
              { icon: <FiHeadphones size={14} />, text: "24/7 online assistance" },
              { icon: <FiMail size={14} />, text: "contact@travelmundo.tn" },
              { icon: <FiClock size={14} />, text: "Available 24/7" },
            ].map(({ icon, text }) => (
              <div key={text}>
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}

            <Link className="tm-footer-cta" to="/orientation">
              Start Orientation <FiArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="tm-footer-bottom">
          <p>Copyright {new Date().getFullYear()} Travel Mundo. {t("footer.rights")}</p>
          <p>{t("footer.notice")}</p>
        </div>
      </div>
    </footer>
  );
}
