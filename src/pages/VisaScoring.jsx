import { useState } from "react";
import {
  FiUser,
  FiDollarSign,
  FiFolder,
  FiAward,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { calculerScoreVisa } from "../services/scoring";

const NATIONALITIES = [
  "Tunisia",
  "Morocco",
  "Algeria",
  "France",
  "Belgium",
  "Canada",
  "Senegal",
  "Côte d'Ivoire",
];

const DESTINATIONS = [
  "France (Schengen)",
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany (Schengen)",
  "Italy (Schengen)",
];

const VISA_TYPES = ["Tourism", "Business", "Study", "Family", "Transit"];
const EMPLOYMENT_OPTIONS = [
  "Permanent",
  "Temporary",
  "Self-employed",
  "Student",
  "Retired",
  "Unemployed",
];

const DOCS_LIST = [
  "Valid passport (6+ months)",
  "Bank statements",
  "Employment proof / contract",
  "Travel insurance",
  "Hotel / accommodation details",
  "Round-trip ticket",
  "Enrollment or work certificate",
  "Official invitation",
];

const FORM_INITIAL = {
  nationalite: "",
  destination: "",
  typeVisa: "",
  revenu: "",
  voyages: "",
  emploi: "",
  docs: [],
};

function StepIndicator({ step }) {
  const steps = [
    { num: 1, label: "Profile", icon: <FiUser size={14} /> },
    { num: 2, label: "Finances", icon: <FiDollarSign size={14} /> },
    { num: 3, label: "Documents", icon: <FiFolder size={14} /> },
    { num: 4, label: "Review", icon: <FiAward size={14} /> },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 0,
        marginBottom: 40,
        flexWrap: "wrap",
      }}
    >
      {steps.map((s, i) => (
        <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background:
                  step >= s.num ? "var(--blue-600)" : "var(--gray-200)",
                color: step >= s.num ? "white" : "var(--gray-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  step === s.num
                    ? "3px solid var(--blue-200)"
                    : "3px solid transparent",
                fontWeight: 700,
              }}
            >
              {step > s.num ? <FiCheckCircle size={16} /> : s.num}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: step >= s.num ? "var(--blue-700)" : "var(--gray-400)",
              }}
            >
              {s.label}
            </span>
          </div>

          {i < steps.length - 1 && (
            <div
              style={{
                width: 60,
                height: 2,
                margin: "0 4px",
                marginTop: -18,
                background:
                  step > s.num ? "var(--blue-400)" : "var(--gray-200)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function VisaScoring() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(FORM_INITIAL);
  const [result, setResult] = useState(null);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const toggleDoc = (doc) =>
    setField(
      "docs",
      form.docs.includes(doc)
        ? form.docs.filter((x) => x !== doc)
        : [...form.docs, doc],
    );

  const reviewApplication = () => {
    const r = calculerScoreVisa(form);
    setResult(r);
    setStep(4);
  };

  const reset = () => {
    setForm(FORM_INITIAL);
    setResult(null);
    setStep(1);
  };

  const step1Valid = form.nationalite && form.destination && form.typeVisa;
  const step2Valid = form.revenu && form.emploi && form.voyages !== "";

  return (
    <div
      style={{
        padding: "60px 0 88px",
        minHeight: "80vh",
        background: "var(--gray-50)",
      }}
    >
      <div className="container">
        <div className="section-header">
          <span className="badge">Application Review</span>
          <h1 className="section-title">Review your application profile</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Fill in the required details and receive a general review with
            recommendations to strengthen your application.
          </p>
        </div>

        <StepIndicator step={step} />

        <div
          style={{
            maxWidth: 580,
            margin: "0 auto",
            background: "white",
            borderRadius: "var(--radius-lg)",
            padding: "40px 40px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--gray-200)",
          }}
        >
          {step === 1 && (
            <div>
              <h3
                style={{
                  marginBottom: 28,
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--blue-700)",
                }}
              >
                <FiUser /> Travel profile
              </h3>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {[
                  {
                    label: "Nationality",
                    key: "nationalite",
                    options: NATIONALITIES,
                    placeholder: "Select your nationality",
                  },
                  {
                    label: "Destination",
                    key: "destination",
                    options: DESTINATIONS,
                    placeholder: "Select a destination",
                  },
                  {
                    label: "Travel purpose",
                    key: "typeVisa",
                    options: VISA_TYPES,
                    placeholder: "Select travel purpose",
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="label">{field.label}</label>
                    <select
                      value={form[field.key]}
                      onChange={(e) => setField(field.key, e.target.value)}
                      className="input-field"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <button
                  className="btn-primary"
                  disabled={!step1Valid}
                  onClick={() => setStep(2)}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3
                style={{
                  marginBottom: 28,
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--blue-700)",
                }}
              >
                <FiDollarSign /> Financial and professional details
              </h3>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 22 }}
              >
                <div>
                  <label className="label">Monthly net income</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2500"
                    value={form.revenu}
                    onChange={(e) => setField("revenu", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Employment status</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {EMPLOYMENT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setField("emploi", option)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 8,
                          fontSize: 13,
                          border:
                            form.emploi === option
                              ? "2px solid var(--blue-600)"
                              : "1.5px solid var(--gray-200)",
                          background:
                            form.emploi === option ? "var(--blue-50)" : "white",
                          color:
                            form.emploi === option
                              ? "var(--blue-700)"
                              : "var(--gray-700)",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">
                    Number of international trips in the last 5 years
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="e.g. 3"
                    value={form.voyages}
                    onChange={(e) => setField("voyages", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="btn-ghost"
                    onClick={() => setStep(1)}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn-primary"
                    disabled={!step2Valid}
                    onClick={() => setStep(3)}
                    style={{ flex: 2, justifyContent: "center" }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3
                style={{
                  marginBottom: 12,
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--blue-700)",
                }}
              >
                <FiFolder /> Available documents
              </h3>

              <p
                style={{
                  color: "var(--gray-600)",
                  fontSize: 14,
                  marginBottom: 18,
                }}
              >
                Select the documents you currently have available.
              </p>

              <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
                {DOCS_LIST.map((doc) => (
                  <label
                    key={doc}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "var(--gray-50)",
                      border: "1px solid var(--gray-200)",
                      borderRadius: 10,
                      padding: "12px 14px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.docs.includes(doc)}
                      onChange={() => toggleDoc(doc)}
                    />
                    <span style={{ fontSize: 14, color: "var(--gray-700)" }}>
                      {doc}
                    </span>
                  </label>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn-ghost"
                  onClick={() => setStep(2)}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  onClick={reviewApplication}
                  style={{ flex: 2, justifyContent: "center" }}
                >
                  Review application
                </button>
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div>
              <h3
                style={{
                  marginBottom: 18,
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  color: "var(--blue-700)",
                }}
              >
                Application review result
              </h3>

              <div
                style={{
                  background: "var(--blue-50)",
                  border: "1px solid var(--blue-200)",
                  borderRadius: 12,
                  padding: "18px 20px",
                  marginBottom: 20,
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                  Overall result: {result.niveau}
                </p>
                <p style={{ fontSize: 14, color: "var(--gray-700)" }}>
                  {result.conseil}
                </p>
              </div>

              {!!result.pointsForts?.length && (
                <div style={{ marginBottom: 18 }}>
                  <h4 style={{ marginBottom: 8 }}>Strengths</h4>
                  <ul style={{ paddingLeft: 18 }}>
                    {result.pointsForts.map((item, i) => (
                      <li
                        key={i}
                        style={{ marginBottom: 6, color: "var(--gray-700)" }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!!result.recommandations?.length && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ marginBottom: 8 }}>Recommendations</h4>
                  <ul style={{ paddingLeft: 18 }}>
                    {result.recommandations.map((item, i) => (
                      <li
                        key={i}
                        style={{ marginBottom: 6, color: "var(--gray-700)" }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className="btn-primary"
                onClick={reset}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <FiRefreshCw size={15} /> Start again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
