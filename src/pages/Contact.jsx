import { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";

const INFOS = [
  {
    icon: <FiMapPin size={20} />,
    title: "Service",
    value: "Visa, passport, ETA / ESTA application assistance",
    color: "var(--blue-600)",
  },
  {
    icon: <FiPhone size={20} />,
    title: "Phone",
    value: "+216 71 000 000",
    color: "var(--blue-700)",
  },
  {
    icon: <FiMail size={20} />,
    title: "Email",
    value: "contact@travelmundo.tn",
    color: "var(--blue-600)",
  },
  {
    icon: <FiClock size={20} />,
    title: "Hours",
    value: "Monday – Friday: 8:30 AM – 5:30 PM",
    color: "var(--blue-700)",
  },
];

export default function Contact() {
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
      style={{
        padding: "60px 0 88px",
        background: "var(--gray-50)",
        minHeight: "80vh",
      }}
    >
      <div className="container">
        <div className="section-header">
          <span className="badge">Contact</span>
          <h1 className="section-title">We’re here to help</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Have a question about your visa, passport, ETA, or ESTA application?
            Our team is here to guide you through the next steps.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
            gap: 32,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Contact info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {INFOS.map((info, i) => (
              <div
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
                      letterSpacing: "0.05em",
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
                  Message sent successfully
                </h3>

                <p
                  style={{
                    color: "var(--gray-600)",
                    fontSize: 14,
                    marginBottom: 24,
                  }}
                >
                  Thank you for contacting us. Our team will get back to you as
                  soon as possible.
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
                  Send another message
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
                  Send us a message
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
                    <label className="label">Full name</label>
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
                    <label className="label">Email</label>
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
                  <label className="label">Subject</label>
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
                  <label className="label">Message</label>
                  <textarea
                    className="input-field"
                    rows="6"
                    placeholder="Tell us how we can help you with your application"
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
                    "Sending..."
                  ) : (
                    <>
                      <FiSend size={15} /> Send message
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
        `}</style>
      </div>
    </div>
  );
}
