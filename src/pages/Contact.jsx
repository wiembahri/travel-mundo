import { useState } from "react";
import PageHero from "../components/PageHero";
import {
  FiMapPin,
  FiHeadphones,
  FiMail,
  FiClock,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const infos = [
    {
      icon: <FiMapPin size={20} />,
      title: t("contact.service"),
      value: t("contact.serviceValue"),
      color: "var(--blue-600)",
    },
    {
      icon: <FiHeadphones size={20} />,
      title: t("contact.support"),
      value: t("contact.supportValue"),
      color: "var(--blue-700)",
    },
    {
      icon: <FiMail size={20} />,
      title: t("contact.email"),
      value: "contact@travelmundo.tn",
      color: "var(--blue-600)",
    },
    {
      icon: <FiClock size={20} />,
      title: t("contact.availability"),
      value: t("contact.availabilityValue"),
      color: "var(--blue-700)",
    },
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div
      className="tm-form-page"
      style={{
        background: "var(--gray-50)",
        minHeight: "80vh",
      }}
    >
      <PageHero
        variant="compact"
        align="center"
        eyebrow={t("contact.badge")}
        icon={<FiHeadphones size={14} />}
        title={t("contact.title")}
        description={t("contact.subtitle")}
      />

      <section style={{ padding: "52px 0 88px" }}>
        <div className="container">
        <div
          className="contact-grid tm-contact-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Contact info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {infos.map((info, i) => (
              <div
                className="tm-info-card"
                key={i}
                style={{
                  background: "white",
                  border: "1px solid var(--gray-200)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: info.color + "14",
                    color: info.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {info.icon}
                </div>

                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--gray-500)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0,
                      marginBottom: 4,
                    }}
                  >
                    {info.title}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--gray-800)",
                      lineHeight: 1.5,
                    }}
                  >
                    {info.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div
            className="contact-form-card"
            style={{
              background: "white",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius-lg)",
              padding: "36px 36px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {sent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#F0FDF4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <FiCheckCircle size={28} color="#16A34A" />
                </div>

                <h3
                  style={{
                    marginBottom: 10,
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {t("contact.sentTitle")}
                </h3>

                <p
                  style={{
                    color: "var(--gray-600)",
                    fontSize: 14,
                    marginBottom: 24,
                  }}
                >
                  {t("contact.sentText")}
                </p>

                <button
                  className="btn-outline"
                  onClick={() => {
                    setSent(false);
                    setForm({
                      name: "",
                      email: "",
                      subject: "",
                      message: "",
                    });
                  }}
                >
                  {t("contact.another")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontFamily: "var(--font-heading)",
                    marginBottom: 4,
                  }}
                >
                  {t("contact.formTitle")}
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                  className="contact-form-grid"
                >
                  <div>
                    <label className="label">{t("contact.fullName")}</label>
                    <input
                      className="input-field"
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      required
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="label">{t("contact.emailLabel")}</label>
                    <input
                      className="input-field"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      required
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="label">{t("contact.subject")}</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Type of service or question"
                    value={form.subject}
                    required
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="label">{t("contact.message")}</label>
                  <textarea
                    className="input-field"
                    rows="6"
                    placeholder="Tell us how we can help with your travel preparation"
                    value={form.message}
                    required
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {loading ? (
                    t("contact.sending")
                  ) : (
                    <>
                      <FiSend size={15} /> {t("contact.send")}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .contact-grid {
              grid-template-columns: 1fr !important;
            }

            .contact-form-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 560px) {
            .contact-form-card {
              padding: 24px 20px !important;
              border-radius: 20px !important;
            }
          }
        `}</style>
        </div>
      </section>
    </div>
  );
}
