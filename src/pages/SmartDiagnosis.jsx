import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import {
  FiAlertCircle,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCamera,
  FiCheckCircle,
  FiFileText,
  FiGlobe,
  FiImage,
  FiInfo,
  FiMapPin,
  FiRefreshCw,
  FiShield,
  FiUploadCloud,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { useAIContext } from "../context/AIContext";
import { NATIONALITIES } from "../data/nationalities";
import {
  DESTINATIONS,
  PASSPORT_STATUS_OPTIONS,
  REVIEW_PURPOSES,
} from "../data/serviceRouting";

const DESTINATION_OPTIONS = [
  ...DESTINATIONS,
  "Canada",
  "Schengen Area",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Australia",
  "New Zealand",
  "United Arab Emirates",
  "Saudi Arabia",
  "Turkey",
  "Japan",
  "Other / to confirm",
];

const EMPLOYMENT_OPTIONS = [
  "Permanent employee",
  "Temporary employee",
  "Self-employed",
  "Student",
  "Retired",
  "Unemployed",
  "Other",
];

const TRAVEL_HISTORY_OPTIONS = [
  "No international travel yet",
  "1-2 recent international trips",
  "Frequent traveler",
  "Previous visa refusal",
  "Previous overstay or border issue",
];

const DOCUMENT_OPTIONS = [
  "Valid passport",
  "National ID",
  "Birth certificate",
  "Bank statements",
  "Employment letter",
  "School enrollment",
  "Travel itinerary",
  "Hotel booking",
  "Travel insurance",
  "Invitation letter",
  "Previous visas",
  "Compliant photo",
];

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  placeOfBirth: "",
  nationality: "",
  destination: "",
  travelPurpose: "",
  passportStatus: "",
  employmentStatus: "",
  travelHistory: "",
  availableDocuments: [],
  travelDate: "",
};

const EMPTY_PHOTO_ANALYSIS = {
  uploaded: false,
  score: 0,
  status: "Not uploaded",
  fileName: "",
  fileSizeKb: 0,
  width: 0,
  height: 0,
  ratio: 0,
  brightness: 0,
  sharpness: 0,
  checks: [
    {
      label: "Photo uploaded",
      status: "issue",
      detail: "Upload a JPG, PNG, or WEBP image to start local analysis.",
    },
  ],
  issues: ["No photo uploaded."],
  recommendations: [
    "Upload a recent color photo with a clear face, plain background, and even lighting.",
  ],
};

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return String(value || "").trim().length > 0;
}

function parseLocalDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function calculateAge(value) {
  const birthDate = parseLocalDate(value);
  if (!birthDate) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

function isFutureDate(value) {
  const date = parseLocalDate(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

function isPastDate(value) {
  const date = parseLocalDate(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function looksLikePlace(value) {
  const text = normalize(value);
  if (!text) return false;
  if (["unknown", "n/a", "na", "tbd", "none", "city"].includes(text)) {
    return false;
  }

  const hasLetters = /[a-zA-ZÀ-ÿ]{3,}/.test(value);
  const containsKnownCountry = NATIONALITIES.some((country) =>
    text.includes(normalize(country)),
  );

  return hasLetters || containsKnownCountry;
}

function getTone(score) {
  if (score >= 82) return "strong";
  if (score >= 62) return "medium";
  return "weak";
}

function getRiskLevel(score, hasCriticalIssue) {
  if (hasCriticalIssue || score < 58) return "High";
  if (score < 78) return "Moderate";
  return "Low";
}

function scoreLabel(score) {
  if (score >= 82) return "Strong";
  if (score >= 62) return "Needs review";
  return "Incomplete";
}

function formatFileSize(kb) {
  if (!kb) return "0 KB";
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
}

function buildCheck(label, passed, detail, warning = false) {
  return {
    label,
    status: passed ? "ok" : warning ? "warning" : "issue",
    detail,
  };
}

function analyzePhotoFile(file, objectUrl) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const ratio = width && height ? width / height : 0;
      const maxCanvasSide = 220;
      const scale = Math.min(1, maxCanvasSide / Math.max(width, height));
      const canvas = document.createElement("canvas");
      const canvasWidth = Math.max(1, Math.round(width * scale));
      const canvasHeight = Math.max(1, Math.round(height * scale));
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0, canvasWidth, canvasHeight);

      const pixels = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
      let luminanceTotal = 0;
      let edgeTotal = 0;
      let edgeCount = 0;
      const grayscale = new Float32Array(canvasWidth * canvasHeight);

      for (let i = 0, p = 0; i < pixels.length; i += 4, p += 1) {
        const luminance =
          0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
        luminanceTotal += luminance;
        grayscale[p] = luminance;
      }

      for (let y = 0; y < canvasHeight - 1; y += 1) {
        for (let x = 0; x < canvasWidth - 1; x += 1) {
          const index = y * canvasWidth + x;
          edgeTotal +=
            Math.abs(grayscale[index] - grayscale[index + 1]) +
            Math.abs(grayscale[index] - grayscale[index + canvasWidth]);
          edgeCount += 2;
        }
      }

      const brightness = Math.round(luminanceTotal / (canvasWidth * canvasHeight));
      const sharpness = Number((edgeTotal / Math.max(1, edgeCount)).toFixed(1));
      const fileSizeKb = file.size / 1024;
      const supportedFormat = ["image/jpeg", "image/png", "image/webp"].includes(
        file.type,
      );
      const sizeOk = fileSizeKb >= 60 && fileSizeKb <= 5120;
      const dimensionOk = width >= 600 && height >= 600;
      const dimensionFair = width >= 400 && height >= 400;
      const ratioOk = ratio >= 0.72 && ratio <= 1.08;
      const ratioFair = ratio > 1.08 && ratio <= 1.35;
      const brightnessOk = brightness >= 85 && brightness <= 220;
      const brightnessFair =
        (brightness >= 65 && brightness < 85) ||
        (brightness > 220 && brightness <= 235);
      const sharpnessOk = sharpness >= 12;
      const sharpnessFair = sharpness >= 7;

      const formatScore = supportedFormat ? 100 : 25;
      const sizeScore = sizeOk ? 100 : fileSizeKb >= 35 && fileSizeKb <= 8192 ? 70 : 40;
      const dimensionScore = dimensionOk ? 100 : dimensionFair ? 75 : 35;
      const ratioScore = ratioOk ? 100 : ratioFair ? 68 : 35;
      const brightnessScore = brightnessOk ? 100 : brightnessFair ? 68 : 35;
      const sharpnessScore = sharpnessOk ? 100 : sharpnessFair ? 70 : 40;
      const placeholderScore = 55;

      const score = Math.round(
        formatScore * 0.12 +
          sizeScore * 0.1 +
          dimensionScore * 0.18 +
          ratioScore * 0.14 +
          brightnessScore * 0.2 +
          sharpnessScore * 0.16 +
          placeholderScore * 0.1,
      );

      const checks = [
        buildCheck("Photo uploaded", true, `${file.name} detected locally.`),
        buildCheck(
          "JPG / PNG / WEBP format",
          supportedFormat,
          supportedFormat
            ? `${file.type.replace("image/", "").toUpperCase()} is supported.`
            : "Use JPG, PNG, or WEBP for local compatibility.",
        ),
        buildCheck(
          "File size",
          sizeOk,
          `${formatFileSize(fileSizeKb)} detected. Ideal range: 60 KB to 5 MB.`,
          fileSizeKb >= 35 && fileSizeKb <= 8192,
        ),
        buildCheck(
          "Dimensions",
          dimensionOk,
          `${width} x ${height}px detected. Aim for at least 600 x 600px.`,
          dimensionFair,
        ),
        buildCheck(
          "Passport / visa ratio",
          ratioOk,
          `Ratio ${ratio.toFixed(2)} detected. Square or portrait formats are safest.`,
          ratioFair,
        ),
        buildCheck(
          "Brightness / lighting",
          brightnessOk,
          `Average brightness is ${brightness}/255.`,
          brightnessFair,
        ),
        buildCheck(
          "Sharpness",
          sharpnessOk,
          `Local edge score is ${sharpness}. Higher means clearer detail.`,
          sharpnessFair,
        ),
        {
          label: "Face visibility",
          status: "manual",
          detail: "Placeholder only: confirm the face is fully visible and centered.",
        },
        {
          label: "Neutral background",
          status: "manual",
          detail: "Placeholder only: confirm the background is plain and light.",
        },
        {
          label: "Professional appearance",
          status: "manual",
          detail: "Placeholder only: confirm neutral expression, no filters, no heavy shadows.",
        },
      ];

      const issues = checks
        .filter((check) => check.status === "issue")
        .map((check) => check.detail);

      const recommendations = [
        !supportedFormat && "Convert the photo to JPG, PNG, or WEBP.",
        !dimensionOk && "Use a higher-resolution image, ideally at least 600 x 600px.",
        !ratioOk && "Crop the photo to a square or official portrait ratio.",
        !brightnessOk && "Retake or edit the photo with even, front-facing lighting.",
        !sharpnessOk && "Use a sharper image without motion blur or heavy compression.",
        "Manually confirm face visibility, neutral background, and official size rules for the exact destination.",
      ].filter(Boolean);

      resolve({
        uploaded: true,
        score: clamp(score),
        status: scoreLabel(score),
        fileName: file.name,
        fileSizeKb,
        width,
        height,
        ratio,
        brightness,
        sharpness,
        checks,
        issues,
        recommendations,
      });
    };

    image.onerror = () => {
      resolve({
        ...EMPTY_PHOTO_ANALYSIS,
        uploaded: true,
        status: "Unreadable",
        fileName: file.name,
        fileSizeKb: file.size / 1024,
        issues: ["The image could not be read locally."],
        recommendations: ["Try another JPG, PNG, or WEBP file."],
      });
    };

    image.src = objectUrl;
  });
}

function FieldShell({ label, icon, children }) {
  return (
    <div className="smart-field">
      <label className="smart-label">
        <span>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function ProgressBar({ label, value, tone = "strong" }) {
  return (
    <div className="smart-progress">
      <div className="smart-progress-head">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="smart-progress-track">
        <span
          className={`smart-progress-fill smart-progress-fill--${tone}`}
          style={{ width: `${clamp(value)}%` }}
        />
      </div>
    </div>
  );
}

function StatusIcon({ status }) {
  if (status === "ok") return <FiCheckCircle size={16} />;
  if (status === "manual" || status === "warning") return <FiInfo size={16} />;
  return <FiXCircle size={16} />;
}

function SmartDiagnosis() {
  const { setAssistantContext, resetAssistantContext } = useAIContext();
  const [form, setForm] = useState(INITIAL_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoAnalysis, setPhotoAnalysis] = useState(EMPTY_PHOTO_ANALYSIS);
  const [photoLoading, setPhotoLoading] = useState(false);

  const age = useMemo(() => calculateAge(form.dateOfBirth), [form.dateOfBirth]);

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleDocument = (documentName) => {
    setForm((current) => {
      const exists = current.availableDocuments.includes(documentName);
      return {
        ...current,
        availableDocuments: exists
          ? current.availableDocuments.filter((item) => item !== documentName)
          : [...current.availableDocuments, documentName],
      };
    });
  };

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview("");
      setPhotoAnalysis(EMPTY_PHOTO_ANALYSIS);
      setPhotoLoading(false);
      return undefined;
    }

    let cancelled = false;
    const objectUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(objectUrl);
    setPhotoLoading(true);

    analyzePhotoFile(photoFile, objectUrl).then((analysis) => {
      if (cancelled) return;
      setPhotoAnalysis(analysis);
      setPhotoLoading(false);
    });

    return () => {
      cancelled = true;
      URL.revokeObjectURL(objectUrl);
    };
  }, [photoFile]);

  const diagnosis = useMemo(() => {
    const missingInformation = [];
    const detectedIssues = [];
    const recommendations = [];
    const strengths = [];

    const requiredFields = [
      ["firstName", "First name"],
      ["lastName", "Last name"],
      ["dateOfBirth", "Date of birth"],
      ["placeOfBirth", "Place of birth"],
      ["nationality", "Nationality"],
      ["destination", "Destination"],
      ["travelPurpose", "Travel purpose"],
      ["passportStatus", "Passport status"],
      ["employmentStatus", "Employment status"],
      ["travelHistory", "Travel history"],
      ["availableDocuments", "Available preparation items"],
      ["travelDate", "Travel date"],
    ];

    requiredFields.forEach(([key, label]) => {
      if (!hasValue(form[key])) missingInformation.push(label);
    });

    const birthDate = parseLocalDate(form.dateOfBirth);
    const birthDateFuture = isFutureDate(form.dateOfBirth);
    const clientAge = calculateAge(form.dateOfBirth);
    const placeOk = looksLikePlace(form.placeOfBirth);
    const normalizedPlace = normalize(form.placeOfBirth);
    const normalizedNationality = normalize(form.nationality);
    const normalizedDestination = normalize(form.destination);
    const placeMentionsNationality =
      normalizedNationality && normalizedPlace.includes(normalizedNationality);
    const placeMentionsDestination =
      normalizedDestination && normalizedPlace.includes(normalizedDestination);

    if (!form.dateOfBirth) {
      detectedIssues.push("Date of birth is mandatory.");
    } else if (!birthDate) {
      detectedIssues.push("Date of birth is not a valid date.");
    } else if (birthDateFuture) {
      detectedIssues.push("Date of birth cannot be in the future.");
    } else {
      strengths.push(`Age calculated automatically: ${clientAge} years old.`);
      if (clientAge < 18) {
        detectedIssues.push("Traveler is a minor and may need guardian authorization.");
      }
    }

    if (!form.placeOfBirth) {
      detectedIssues.push("Place of birth is mandatory.");
    } else if (!placeOk) {
      detectedIssues.push("Place of birth should contain a clear city or country.");
    } else if (!form.placeOfBirth.includes(",") && !placeMentionsNationality) {
      recommendations.push("Add city and country to the place of birth for a cleaner file.");
    }

    if (
      form.nationality &&
      form.destination &&
      normalizedNationality === normalizedDestination &&
      form.travelPurpose !== "Passport service"
    ) {
      detectedIssues.push(
        "Nationality matches the destination; verify whether the case is a visa, passport, or domestic travel request.",
      );
    }

    if (
      form.nationality &&
      form.destination &&
      form.placeOfBirth &&
      placeMentionsDestination &&
      !placeMentionsNationality &&
      normalizedNationality !== normalizedDestination
    ) {
      detectedIssues.push(
        "Place of birth matches the destination but nationality differs; confirm citizenship, dual nationality, or residence status.",
      );
    }

    if (form.travelDate && isPastDate(form.travelDate)) {
      detectedIssues.push("Travel date is in the past.");
    }

    if (
      ["Expired", "Need renewal", "Need new passport"].includes(form.passportStatus)
    ) {
      detectedIssues.push("Passport status may block visa or travel preparation.");
    }

    if (form.travelHistory === "Previous visa refusal") {
      detectedIssues.push("Previous visa refusal should be disclosed and documented.");
    }

    if (form.travelHistory === "Previous overstay or border issue") {
      detectedIssues.push("Previous overstay or border issue creates a higher review risk.");
    }

    if (form.availableDocuments.length > 0) {
      strengths.push(`${form.availableDocuments.length} preparation item(s) selected.`);
    }

    let dataScore = 100;
    dataScore -= missingInformation.length * 7;
    if (form.dateOfBirth && !birthDate) dataScore -= 18;
    if (birthDateFuture) dataScore -= 22;
    if (form.placeOfBirth && !placeOk) dataScore -= 12;
    if (clientAge !== null && clientAge < 18) dataScore -= 6;
    if (form.travelDate && isPastDate(form.travelDate)) dataScore -= 10;
    if (["Expired", "Need renewal", "Need new passport"].includes(form.passportStatus)) {
      dataScore -= 8;
    }
    if (
      ["Previous visa refusal", "Previous overstay or border issue"].includes(
        form.travelHistory,
      )
    ) {
      dataScore -= form.travelHistory === "Previous overstay or border issue" ? 12 : 8;
    }

    dataScore = clamp(Math.round(dataScore));

    if (missingInformation.length) {
      recommendations.push(
        "Complete the missing traveler information fields before sending the file for review.",
      );
    }

    if (clientAge !== null && clientAge < 18) {
      recommendations.push(
        "Prepare guardian consent, parent IDs, and minor-specific support items before appointment booking.",
      );
    }

    if (["Expired", "Need renewal", "Need new passport"].includes(form.passportStatus)) {
      recommendations.push("Resolve the passport status before continuing on the dedicated portal.");
    }

    if (form.availableDocuments.length < 4) {
      recommendations.push(
        "Collect core preparation items early: passport, proof of funds, travel plan, and purpose evidence.",
      );
    }

    if (!photoAnalysis.uploaded) {
      recommendations.push(
        "Upload a traveler photo to calculate the photo compatibility score.",
      );
    } else if (photoAnalysis.score < 78) {
      recommendations.push(...photoAnalysis.recommendations.slice(0, 3));
    }

    const photoScore = photoAnalysis.score;
    const overallReadiness = clamp(Math.round(dataScore * 0.62 + photoScore * 0.38));
    const hasCriticalIssue =
      !form.dateOfBirth ||
      (form.dateOfBirth && (!birthDate || birthDateFuture)) ||
      !form.placeOfBirth ||
      !photoAnalysis.uploaded;
    const riskLevel = getRiskLevel(overallReadiness, hasCriticalIssue);

    if (overallReadiness >= 82 && riskLevel === "Low") {
      recommendations.push(
        "Move to Readiness Review and instructions as the next step in the preparation flow.",
      );
    }

    return {
      age: clientAge,
      isMinor: clientAge !== null && clientAge < 18,
      dataScore,
      photoScore,
      overallReadiness,
      riskLevel,
      missingInformation,
      detectedIssues,
      recommendations: [...new Set(recommendations)],
      strengths,
    };
  }, [form, photoAnalysis]);

  useEffect(() => {
    setAssistantContext({
      currentPage: "smart-diagnosis",
      destination: form.destination,
      journeyStep: "Smart Diagnosis & Photo Compatibility",
      readinessScore: diagnosis.overallReadiness,
      riskLevel: diagnosis.riskLevel,
      activeService: form.travelPurpose,
      warnings: diagnosis.detectedIssues.slice(0, 3),
      missingDocuments: diagnosis.missingInformation,
    });
  }, [diagnosis, form.destination, form.travelPurpose, setAssistantContext]);

  useEffect(() => () => resetAssistantContext(), [resetAssistantContext]);

  const reset = () => {
    setForm(INITIAL_FORM);
    setPhotoFile(null);
    setPhotoPreview("");
    setPhotoAnalysis(EMPTY_PHOTO_ANALYSIS);
  };

  return (
    <main className="smart-diagnosis-page">
      <PageHero
        eyebrow="Smart Diagnosis"
        icon={<FiShield size={14} />}
        title="Review client readiness and photo compatibility"
        description={
          <>
            <p>
              Check traveler information, identity coherence, passport status,
              travel history, and local photo compatibility before continuing
              through the preparation flow.
            </p>
            <div className="smart-hero-actions">
              <Link to="/orientation" className="btn-primary">
                Orientation <FiArrowRight size={16} />
              </Link>
              <Link to="/visa-scoring" className="btn-outline">
                Readiness Review
              </Link>
              <Link to="/instructions" className="btn-outline">
                Instructions
              </Link>
            </div>
          </>
        }
      >
        <motion.div
          className="smart-score-panel"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div
            className={`smart-readiness-ring smart-readiness-ring--${getTone(diagnosis.overallReadiness)}`}
            style={{ "--smart-ring": `${diagnosis.overallReadiness}%` }}
          >
            <strong>{diagnosis.overallReadiness}%</strong>
            <span>Overall</span>
          </div>
          <div className="smart-score-panel-copy">
            <span className={`smart-risk-badge smart-risk-badge--${diagnosis.riskLevel.toLowerCase()}`}>
              {diagnosis.riskLevel} risk
            </span>
            <h2>{scoreLabel(diagnosis.overallReadiness)} readiness</h2>
            <p>
              Traveler information score {diagnosis.dataScore}% and photo
              compatibility score {diagnosis.photoScore}%.
            </p>
          </div>
        </motion.div>
      </PageHero>

      <section className="smart-diagnosis-workspace">
        <div className="container smart-diagnosis-layout">
          <motion.form
            className="smart-card smart-client-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
          >
            <div className="smart-card-head">
              <div>
                <p>Traveler information</p>
                <h2>Identity and travel overview</h2>
              </div>
              <button type="button" className="smart-reset" onClick={reset}>
                <FiRefreshCw size={14} />
                Reset
              </button>
            </div>

            <div className="smart-form-grid">
              <FieldShell label="First name" icon={<FiUser size={14} />}>
                <input
                  className="input-field"
                  value={form.firstName}
                  onChange={(event) => setField("firstName", event.target.value)}
                  placeholder="Traveler first name"
                />
              </FieldShell>

              <FieldShell label="Last name" icon={<FiUser size={14} />}>
                <input
                  className="input-field"
                  value={form.lastName}
                  onChange={(event) => setField("lastName", event.target.value)}
                  placeholder="Traveler last name"
                />
              </FieldShell>

              <FieldShell label="Date of birth" icon={<FiCalendar size={14} />}>
                <input
                  className="input-field"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) => setField("dateOfBirth", event.target.value)}
                />
              </FieldShell>

              <FieldShell label="Place of birth" icon={<FiMapPin size={14} />}>
                <input
                  className="input-field"
                  value={form.placeOfBirth}
                  onChange={(event) => setField("placeOfBirth", event.target.value)}
                  placeholder="City, country"
                />
              </FieldShell>

              <FieldShell label="Nationality" icon={<FiGlobe size={14} />}>
                <select
                  className="input-field"
                  value={form.nationality}
                  onChange={(event) => setField("nationality", event.target.value)}
                >
                  <option value="">Select nationality</option>
                  {NATIONALITIES.map((nationality) => (
                    <option key={nationality} value={nationality}>
                      {nationality}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Destination" icon={<FiGlobe size={14} />}>
                <select
                  className="input-field"
                  value={form.destination}
                  onChange={(event) => setField("destination", event.target.value)}
                >
                  <option value="">Select destination</option>
                  {DESTINATION_OPTIONS.map((destination) => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Travel purpose" icon={<FiBriefcase size={14} />}>
                <select
                  className="input-field"
                  value={form.travelPurpose}
                  onChange={(event) => setField("travelPurpose", event.target.value)}
                >
                  <option value="">Select purpose</option>
                  {REVIEW_PURPOSES.map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Passport status" icon={<FiFileText size={14} />}>
                <select
                  className="input-field"
                  value={form.passportStatus}
                  onChange={(event) => setField("passportStatus", event.target.value)}
                >
                  <option value="">Select passport status</option>
                  {PASSPORT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Employment status" icon={<FiBriefcase size={14} />}>
                <select
                  className="input-field"
                  value={form.employmentStatus}
                  onChange={(event) => setField("employmentStatus", event.target.value)}
                >
                  <option value="">Select employment status</option>
                  {EMPLOYMENT_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Travel history" icon={<FiGlobe size={14} />}>
                <select
                  className="input-field"
                  value={form.travelHistory}
                  onChange={(event) => setField("travelHistory", event.target.value)}
                >
                  <option value="">Select travel history</option>
                  {TRAVEL_HISTORY_OPTIONS.map((history) => (
                    <option key={history} value={history}>
                      {history}
                    </option>
                  ))}
                </select>
              </FieldShell>

              <FieldShell label="Travel date" icon={<FiCalendar size={14} />}>
                <input
                  className="input-field"
                  type="date"
                  value={form.travelDate}
                  onChange={(event) => setField("travelDate", event.target.value)}
                />
              </FieldShell>
            </div>

            {age !== null && !isFutureDate(form.dateOfBirth) && (
              <div className={`smart-age-note ${age < 18 ? "is-minor" : ""}`}>
                <FiInfo size={16} />
                <span>
                  Age: <strong>{age}</strong>{" "}
                  {age < 18 ? "Minor traveler detected" : "Adult traveler"}
                </span>
              </div>
            )}

            <div className="smart-documents-block">
              <div className="smart-documents-head">
                <p>Available preparation items</p>
                <span>{form.availableDocuments.length} selected</span>
              </div>
              <div className="smart-document-grid">
                {DOCUMENT_OPTIONS.map((documentName) => {
                  const selected = form.availableDocuments.includes(documentName);
                  return (
                    <button
                      key={documentName}
                      type="button"
                      className={`smart-document-chip ${selected ? "selected" : ""}`}
                      onClick={() => toggleDocument(documentName)}
                    >
                      {selected ? <FiCheckCircle size={15} /> : <FiFileText size={15} />}
                      {documentName}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.form>

          <motion.aside
            className="smart-side-stack"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.06 }}
          >
            <section className="smart-card smart-photo-card">
              <div className="smart-card-head">
                <div>
                  <p>Photo compatibility analysis</p>
                  <h2>Local photo compatibility</h2>
                </div>
                <span className={`smart-mini-score smart-mini-score--${getTone(photoAnalysis.score)}`}>
                  {photoAnalysis.score}%
                </span>
              </div>

              <label className="smart-upload-zone">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
                />
                {photoPreview ? (
                  <img src={photoPreview} alt="Uploaded traveler preview" />
                ) : (
                  <span>
                    <FiUploadCloud size={24} />
                    Upload traveler photo
                  </span>
                )}
              </label>

              <div className="smart-photo-meta">
                <div>
                  <span>File</span>
                  <strong>{photoAnalysis.fileName || "No file"}</strong>
                </div>
                <div>
                  <span>Size</span>
                  <strong>{formatFileSize(photoAnalysis.fileSizeKb)}</strong>
                </div>
                <div>
                  <span>Dimensions</span>
                  <strong>
                    {photoAnalysis.width ? `${photoAnalysis.width} x ${photoAnalysis.height}` : "N/A"}
                  </strong>
                </div>
                <div>
                  <span>Lighting</span>
                  <strong>{photoAnalysis.brightness || 0}/255</strong>
                </div>
              </div>

              {photoLoading && (
                <div className="smart-loading-note">
                  <FiImage size={15} />
                  Analyzing image locally...
                </div>
              )}

              <div className="smart-checklist">
                {photoAnalysis.checks.map((check) => (
                  <div
                    key={check.label}
                    className={`smart-check smart-check--${check.status}`}
                  >
                    <StatusIcon status={check.status} />
                    <div>
                      <strong>{check.label}</strong>
                      <span>{check.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="smart-card smart-results-card">
              <div className="smart-card-head">
                <div>
                  <p>Readiness overview</p>
                  <h2>Readiness summary</h2>
                </div>
                <span className={`smart-risk-badge smart-risk-badge--${diagnosis.riskLevel.toLowerCase()}`}>
                  {diagnosis.riskLevel}
                </span>
              </div>

              <div className="smart-progress-stack">
                <ProgressBar
                  label="Traveler information score"
                  value={diagnosis.dataScore}
                  tone={getTone(diagnosis.dataScore)}
                />
                <ProgressBar
                  label="Photo compatibility score"
                  value={diagnosis.photoScore}
                  tone={getTone(diagnosis.photoScore)}
                />
                <ProgressBar
                  label="Overall readiness"
                  value={diagnosis.overallReadiness}
                  tone={getTone(diagnosis.overallReadiness)}
                />
              </div>
            </section>
          </motion.aside>
        </div>
      </section>

      <section className="smart-diagnosis-insights">
        <div className="container smart-insight-grid">
          <InsightCard
            title="Missing information"
            icon={<FiAlertCircle size={18} />}
            tone="orange"
            items={diagnosis.missingInformation}
            empty="No missing information detected."
          />
          <InsightCard
            title="Detected issues"
            icon={<FiShield size={18} />}
            tone={diagnosis.riskLevel.toLowerCase()}
            items={diagnosis.detectedIssues}
            empty="No major issue detected yet."
          />
          <InsightCard
            title="Personalized recommendations"
            icon={<FiCamera size={18} />}
            tone="blue"
            items={diagnosis.recommendations}
            empty="Complete the form to unlock recommendations."
          />
          <InsightCard
            title="Positive signals"
            icon={<FiCheckCircle size={18} />}
            tone="green"
            items={diagnosis.strengths}
            empty="Strong signals will appear as the profile becomes complete."
          />
        </div>

        <div className="container smart-next-actions">
          <div>
            <p>Next step</p>
            <h2>Turn diagnosis into a prepared travel file.</h2>
          </div>
          <div className="smart-next-action-links">
            <Link to="/orientation" className="btn-outline">
              Orientation
            </Link>
            <Link to="/visa-scoring" className="btn-primary">
              Readiness Review <FiArrowRight size={16} />
            </Link>
            <Link to="/instructions" className="btn-outline">
              Instructions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InsightCard({ title, icon, tone, items, empty }) {
  const visibleItems = items.length ? items : [empty];

  return (
    <motion.article
      className={`smart-card smart-insight-card smart-insight-card--${tone}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.32 }}
    >
      <div className="smart-insight-head">
        <span>{icon}</span>
        <h3>{title}</h3>
      </div>
      <ul>
        {visibleItems.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </motion.article>
  );
}

export default SmartDiagnosis;
