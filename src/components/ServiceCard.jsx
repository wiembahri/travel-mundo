import { Link } from "react-router-dom";
import { FiArrowRight, FiExternalLink, FiCheckCircle } from "react-icons/fi";
import "./ServiceCard.css";

export default function ServiceCard({ service }) {
  const title = service.titre || service.title;
  const description = service.description;
  const link = service.lien || service.link;
  const color = service.couleur || service.color || "var(--tm-navy)";
  const bg = service.bg || "var(--tm-soft)";
  const badge = service.badge || "Travel guidance";
  const Icon = service.icon;
  const destination = service.destination;
  const focus = service.focus;

  return (
    <article
      className="service-card"
      style={{
        "--service-accent": color,
        "--service-soft": bg,
      }}
    >
      <div className="service-card__topline">
        <span className="service-card__destination">{destination}</span>
        <span className="service-card__badge">{badge}</span>
      </div>

      <div className="service-card__head">
        {Icon && (
          <span className="service-card__main-icon">
            <Icon size={22} />
          </span>
        )}
        <div>
          <h3 className="service-card__title">{title}</h3>
          <p className="service-card__description">{description}</p>
        </div>
      </div>

      {focus && (
        <div className="service-card__focus">
          <p className="service-card__label">Preparation focus</p>
          <strong>{focus}</strong>
        </div>
      )}

      <div className="service-card__note">
        <FiCheckCircle size={15} />
        <span>Guidance and readiness review before dedicated portal handoff.</span>
      </div>

      <div className="service-card__footer">
        <Link to="/instructions" className="service-card__cta service-card__cta--secondary">
          <span>View guidance</span>
          <FiArrowRight size={14} />
        </Link>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="service-card__cta"
          >
            <span>Open dedicated portal</span>
            <FiExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
