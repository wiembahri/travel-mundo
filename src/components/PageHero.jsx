import { isValidElement } from "react";

function renderIcon(icon) {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;

  const Icon = icon;
  return <Icon size={14} />;
}

function renderDescription(description) {
  if (!description) return null;
  if (typeof description === "string") return <p>{description}</p>;
  return description;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  icon,
  variant = "standard",
  align = "left",
  children,
}) {
  const className = [
    "page-hero",
    `page-hero--${variant}`,
    `page-hero--${align}`,
    children ? "page-hero--with-children" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={className}>
      <div className="container page-hero__inner">
        <div className="page-hero__copy">
          {eyebrow && (
            <span className="page-hero__eyebrow">
              {renderIcon(icon)}
              {eyebrow}
            </span>
          )}

          {title && <h1 className="page-hero__title">{title}</h1>}

          {description && (
            <div className="page-hero__description">
              {renderDescription(description)}
            </div>
          )}
        </div>

        {children && <div className="page-hero__side">{children}</div>}
      </div>
    </section>
  );
}
