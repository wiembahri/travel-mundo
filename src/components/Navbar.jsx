import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronRight,
  FiGlobe,
  FiLogOut,
  FiMenu,
  FiShield,
  FiMoon,
  FiSun,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { to: "/", labelKey: "nav.home" },
  { to: "/services", labelKey: "nav.services" },
  { to: "/orientation", labelKey: "nav.orientation" },
  { to: "/instructions", labelKey: "nav.instructions" },
  { to: "/suivi", labelKey: "nav.track" },
  { to: "/a-propos", labelKey: "nav.about" },
  { to: "/contact", labelKey: "nav.contact" },
];

const LANGUAGES = [
  { code: "en", shortLabel: "EN", label: "English" },
  { code: "fr", shortLabel: "FR", label: "Francais" },
  { code: "es", shortLabel: "ES", label: "Espanol" },
];

function LanguageDropdown({
  language,
  setLanguage,
  mobile = false,
  closeSignal = 0,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const current =
    LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  const chooseLanguage = (code) => {
    setLanguage(code);
    setOpen(false);
    onSelect?.();
  };

  useEffect(() => {
    setOpen(false);
  }, [closeSignal]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`tm-language-dropdown ${
        mobile ? "tm-language-dropdown--mobile" : ""
      }`}
    >
      <button
        type="button"
        className="tm-language-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <FiGlobe size={14} />
        <span>{current.shortLabel}</span>
        <FiChevronDown size={13} />
      </button>

      {open && (
        <div className="tm-language-menu" role="menu">
          {LANGUAGES.map((item) => (
            <button
              key={item.code}
              type="button"
              role="menuitem"
              className={language === item.code ? "active" : ""}
              onClick={() => chooseLanguage(item.code)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [languageCloseSignal, setLanguageCloseSignal] = useState(0);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const closeInteractiveLayers = () => {
    setMenuOpen(false);
    setLanguageCloseSignal((current) => current + 1);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setLanguageCloseSignal((current) => current + 1);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1250) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showLogout = Boolean(user);
  const getNavLinkClassName = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className={`tm-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container">
        <nav className="tm-navbar" aria-label="Main navigation">
          <Link
            to="/"
            className="tm-brand"
            aria-label="Travel Mundo home"
            onClick={closeInteractiveLayers}
          >
            <span className="tm-brand-mark">
              <img
                src="/travel-mundo-logo.png"
                alt="Travel Mundo"
                className="tm-brand-logo"
              />
            </span>
            <span className="tm-brand-copy">
              <strong>
                Travel<span>Mundo</span>
              </strong>
              <small>{t("nav.brandSubtitle")}</small>
            </span>
          </Link>

          <div className="tm-nav-center">
              <ul>
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={getNavLinkClassName}
                      onClick={closeInteractiveLayers}
                    >
                      {link.label || t(link.labelKey)}
                    </NavLink>
                  </li>
                ))}
              </ul>
          </div>

          <div className="tm-nav-actions">
            <button
              type="button"
              className="tm-theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
            </button>

            <LanguageDropdown
              language={language}
              setLanguage={setLanguage}
              closeSignal={languageCloseSignal}
              onSelect={() => setLanguageCloseSignal((current) => current + 1)}
            />

            {showLogout ? (
              <button
                className="tm-nav-logout"
                onClick={() => {
                  closeInteractiveLayers();
                  logout();
                }}
              >
                <FiLogOut size={14} />
                {t("nav.logout")}
              </button>
            ) : (
              <Link
                to="/orientation"
                className="tm-nav-cta"
                onClick={closeInteractiveLayers}
              >
                {t("nav.startApplication")} <FiArrowRight size={14} />
              </Link>
            )}
          </div>

          <button
            type="button"
            className="tm-mobile-trigger"
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setLanguageCloseSignal((current) => current + 1);
            }}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </nav>
      </div>

      <button
        type="button"
        className={`tm-mobile-backdrop ${menuOpen ? "is-open" : ""}`}
        aria-label="Close menu"
        aria-hidden={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeInteractiveLayers}
      />
      <div
        className={`tm-mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="tm-mobile-menu-head">
          <div>
            <strong>TravelMundo</strong>
            <span>{t("nav.mobileSubtitle")}</span>
          </div>
          <FiShield size={18} />
        </div>

        <div className="tm-mobile-links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={getNavLinkClassName}
              onClick={closeInteractiveLayers}
            >
              <span>{link.label || t(link.labelKey)}</span>
              <FiChevronRight size={16} />
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="tm-mobile-theme-toggle"
          onClick={toggleTheme}
        >
          {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>

        {showLogout ? (
          <button
            type="button"
            className="tm-mobile-cta secondary"
            onClick={() => {
              closeInteractiveLayers();
              logout();
            }}
          >
            <FiLogOut size={15} />
            {t("nav.logout")}
          </button>
        ) : (
          <div className="tm-mobile-actions">
            <Link
              to="/orientation"
              className="tm-mobile-cta"
              onClick={closeInteractiveLayers}
            >
              {t("nav.startApplication")} <FiArrowRight size={15} />
            </Link>
            <LanguageDropdown
              language={language}
              setLanguage={setLanguage}
              mobile
              closeSignal={languageCloseSignal}
              onSelect={() => setLanguageCloseSignal((current) => current + 1)}
            />
          </div>
        )}
      </div>
    </header>
  );
}
