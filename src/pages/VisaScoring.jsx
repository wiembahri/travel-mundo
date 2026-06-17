import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHero from "../components/PageHero";
import {
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiDownload,
  FiFileText,
  FiFolder,
  FiGlobe,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";
import { jsPDF } from "jspdf";
import AIAnalysisPanel from "../components/AIAnalysisPanel";
import DynamicChecklist from "../components/DynamicChecklist";
import ScoreGauge from "../components/ScoreGauge";
import { useAIContext } from "../context/AIContext";
import { useLanguage } from "../context/LanguageContext";
import { NATIONALITIES } from "../data/nationalities";
import {
  DESTINATIONS,
  PASSPORT_STATUS_OPTIONS,
  REVIEW_PURPOSES,
  SERVICE_DETAILS,
  getRecommendedService,
} from "../data/serviceRouting";
import { analyzeTravelProfile } from "../services/aiAnalysis";
import { calculerScoreVisa } from "../services/scoring";

const EMPLOYMENT_OPTIONS = [
  "Permanent",
  "Temporary",
  "Self-employed",
  "Student",
  "Retired",
  "Unemployed",
];

const FORM_INITIAL = {
  nationalite: "",
  destination: "",
  typeVisa: "",
  duration: "",
  passportStatus: "",
  recommendedService: "",
  revenu: "",
  voyages: "",
  emploi: "",
  docs: [],
};

const CHECKLIST_INITIAL = {
  checkedLabels: [],
  checkedEntries: [],
  progress: 0,
  completedCount: 0,
  totalCount: 0,
};

function StepIndicator({ step }) {
  const steps = [
    { num: 1, label: "Profile", icon: <FiUser size={15} /> },
    { num: 2, label: "Finances", icon: <FiDollarSign size={15} /> },
    { num: 3, label: "Checklist", icon: <FiFolder size={15} /> },
    { num: 4, label: "Review", icon: <FiAward size={15} /> },
  ];

  return (
    <div className="vs-steps">
      {steps.map((s, i) => (
        <div key={s.num} className="vs-step-wrap">
          <div className="vs-step-block">
            <div
              className={`vs-step-circle ${
                step === s.num ? "active" : step > s.num ? "done" : ""
              }`}
            >
              {step > s.num ? <FiCheckCircle size={16} /> : s.icon}
            </div>
            <span
              className={`vs-step-label ${
                step >= s.num ? "current-label" : ""
              }`}
            >
              {s.label}
            </span>
          </div>

          {i < steps.length - 1 && (
            <div className={`vs-step-line ${step > s.num ? "filled" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldShell({ label, icon, children }) {
  return (
    <div className="vs-field-shell">
      <label className="vs-label">
        <span className="vs-label-icon">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

const REPORT_COLORS = {
  navy: [23, 55, 99],
  blue: [37, 99, 235],
  sky: [14, 165, 233],
  slate: [71, 84, 103],
  muted: [100, 116, 139],
  border: [203, 213, 225],
  surface: [255, 255, 255],
  softBlue: [239, 246, 255],
  softSlate: [248, 250, 252],
  success: [22, 163, 74],
  warning: [217, 119, 6],
  danger: [220, 38, 38],
  ink: [15, 23, 42],
};

const REPORT_LAYOUT = {
  pageWidth: 210,
  marginX: 14,
  contentTop: 52,
  contentWidth: 182,
  footerReserve: 18,
  lineHeight: 4.8,
};

const REPORT_NOTICE =
  "This report is informational and does not guarantee approval, entry, or official processing.";
const READINESS_SCORE_NOTE =
  "This score estimates how prepared the file is based on the traveler profile, selected preparation items, detected issues, and route consistency. It is not an approval guarantee.";
const READINESS_MEANING_TEXT =
  "The score helps identify whether the traveler is ready to continue on the dedicated portal or should strengthen the preparation first.";

function isMissingReportValue(value) {
  return value === null || value === undefined || value === "";
}

function formatReportValue(value, suffix = "") {
  if (isMissingReportValue(value)) return "Not available";
  return `${value}${suffix}`;
}

function formatCurrencyValue(value) {
  if (isMissingReportValue(value)) return "Not available";
  return `$${value}/month`;
}

function formatTripDuration(value) {
  if (isMissingReportValue(value)) return "Not available";
  return `${value} day(s)`;
}

function formatTravelHistoryValue(value) {
  if (isMissingReportValue(value)) return "Not available";
  return `${value} international trip(s) in the last 5 years`;
}

function toReportList(items) {
  if (!Array.isArray(items)) return [];
  return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
}

function buildReportReference() {
  return `TM-REPORT-${Math.floor(1000 + Math.random() * 9000)}`;
}

function getRiskBadgeTheme(level) {
  if (level === "Low") {
    return {
      fill: REPORT_COLORS.success,
      softFill: [240, 253, 244],
    };
  }

  if (level === "High") {
    return {
      fill: REPORT_COLORS.danger,
      softFill: [254, 242, 242],
    };
  }

  return {
    fill: REPORT_COLORS.warning,
    softFill: [255, 247, 237],
  };
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = REPORT_LAYOUT.lineHeight) {
  const lines = doc.splitTextToSize(text || "Not available", maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function getWrappedTextHeight(doc, text, maxWidth, lineHeight = REPORT_LAYOUT.lineHeight) {
  const lines = doc.splitTextToSize(text || "Not available", maxWidth);
  return Math.max(lines.length, 1) * lineHeight;
}

function drawPanel(doc, x, y, width, height, fillColor, borderColor = REPORT_COLORS.border) {
  doc.setFillColor(...fillColor);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(x, y, width, height, 4, 4, "FD");
}

function drawPageHeader(doc, meta) {
  doc.setFillColor(...REPORT_COLORS.navy);
  doc.rect(0, 0, REPORT_LAYOUT.pageWidth, 30, "F");
  doc.setFillColor(...REPORT_COLORS.blue);
  doc.rect(0, 30, REPORT_LAYOUT.pageWidth, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Travel Mundo", REPORT_LAYOUT.marginX, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Private travel readiness intelligence", REPORT_LAYOUT.marginX, 21);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(meta.title, REPORT_LAYOUT.marginX, 39);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...REPORT_COLORS.muted);
  doc.text(`Generated on ${meta.generatedAt}`, REPORT_LAYOUT.marginX, 45);
}

function drawPageFooter(doc, pageNumber, pageCount) {
  const footerY = 286;
  doc.setDrawColor(...REPORT_COLORS.border);
  doc.line(REPORT_LAYOUT.marginX, footerY - 5, 196, footerY - 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...REPORT_COLORS.muted);
  doc.text("Travel Mundo readiness report. Informational use only.", REPORT_LAYOUT.marginX, footerY);
  doc.text(`Page ${pageNumber}/${pageCount}`, 196, footerY, { align: "right" });
}

function drawMetaStrip(doc, meta, y) {
  drawPanel(
    doc,
    REPORT_LAYOUT.marginX,
    y,
    REPORT_LAYOUT.contentWidth,
    22,
    REPORT_COLORS.surface,
  );

  const blocks = [
    { label: "Date", value: meta.generatedAt, x: 20 },
    { label: "Reference", value: meta.reference, x: 82 },
    { label: "Recommended service", value: meta.service, x: 144 },
  ];

  blocks.forEach((block) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...REPORT_COLORS.muted);
    doc.text(block.label.toUpperCase(), block.x, y + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...REPORT_COLORS.ink);
    doc.text(block.value, block.x, y + 15);
  });

  return y + 28;
}

function drawMetricCard(doc, { x, y, width, height, label, value, accent, helperText }) {
  drawPanel(doc, x, y, width, height, REPORT_COLORS.surface);
  doc.setFillColor(...accent);
  doc.roundedRect(x, y, width, 5, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...REPORT_COLORS.muted);
  doc.text(label.toUpperCase(), x + 6, y + 12);
  doc.setFontSize(24);
  doc.setTextColor(...REPORT_COLORS.navy);
  doc.text(value, x + 6, y + 23);

  if (helperText) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...REPORT_COLORS.slate);
    doc.text(helperText, x + 6, y + height - 6);
  }
}

function drawCompactMetric(doc, { x, y, width, label, value }) {
  drawPanel(doc, x, y, width, 18, REPORT_COLORS.softSlate);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...REPORT_COLORS.muted);
  doc.text(label.toUpperCase(), x + 4, y + 6.5);
  doc.setFontSize(11);
  doc.setTextColor(...REPORT_COLORS.ink);
  doc.text(value, x + 4, y + 13.5);
}

function drawBadgeCard(doc, { x, y, width, label, value, theme }) {
  drawPanel(doc, x, y, width, 18, theme.softFill, theme.fill);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...REPORT_COLORS.muted);
  doc.text(label.toUpperCase(), x + 4, y + 6.5);
  doc.setFillColor(...theme.fill);
  doc.roundedRect(x + 4, y + 9, width - 8, 6, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(value, x + width / 2, y + 13.4, { align: "center" });
}

function drawTextCallout(doc, title, body, y) {
  const textHeight = getWrappedTextHeight(doc, body, 170);
  const boxHeight = Math.max(22, textHeight + 15);
  drawPanel(
    doc,
    REPORT_LAYOUT.marginX,
    y,
    REPORT_LAYOUT.contentWidth,
    boxHeight,
    REPORT_COLORS.softBlue,
    [191, 219, 254],
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...REPORT_COLORS.navy);
  doc.text(title, 20, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...REPORT_COLORS.slate);
  addWrappedText(doc, body, 20, y + 15, 170);
  return y + boxHeight + 6;
}

function drawDetailSection(doc, title, rows, y) {
  const safeRows = rows?.length
    ? rows
    : [{ label: "Details", value: "Not available" }];

  const boxHeight = safeRows.reduce((total, row) => {
    const valueHeight = getWrappedTextHeight(doc, row.value, 112);
    return total + Math.max(8, valueHeight + 2);
  }, 16);

  drawPanel(doc, REPORT_LAYOUT.marginX, y, REPORT_LAYOUT.contentWidth, boxHeight, REPORT_COLORS.surface);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...REPORT_COLORS.navy);
  doc.text(title, 20, y + 9);

  let cursor = y + 16;
  safeRows.forEach((row, index) => {
    if (index > 0) {
      doc.setDrawColor(...REPORT_COLORS.border);
      doc.line(20, cursor - 3, 188, cursor - 3);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...REPORT_COLORS.muted);
    doc.text(row.label, 20, cursor + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...REPORT_COLORS.ink);
    const nextY = addWrappedText(doc, row.value, 74, cursor + 2, 112, 4.4);
    cursor = nextY + 3;
  });

  return y + boxHeight + 6;
}

function drawListSection(doc, title, items, y, accent = REPORT_COLORS.blue) {
  const safeItems = toReportList(items);
  const listItems = safeItems.length ? safeItems : ["Not available"];
  const boxHeight = listItems.reduce(
    (total, item) => total + getWrappedTextHeight(doc, item, 160, 4.4) + 3,
    16,
  );

  drawPanel(doc, REPORT_LAYOUT.marginX, y, REPORT_LAYOUT.contentWidth, boxHeight, REPORT_COLORS.surface);
  doc.setFillColor(...accent);
  doc.roundedRect(REPORT_LAYOUT.marginX, y, 5, boxHeight, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...REPORT_COLORS.navy);
  doc.text(title, 24, y + 9);

  let cursor = y + 16;
  listItems.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...REPORT_COLORS.slate);
    doc.text("-", 24, cursor);
    const nextY = addWrappedText(doc, item, 29, cursor, 157, 4.4);
    cursor = nextY + 3;
  });

  return y + boxHeight + 6;
}

function SummaryItem({ label, value }) {
  return (
    <div className="vs-summary-item">
      <span>{label}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

function getReadinessColor(score) {
  if (score >= 82) return "#0b2f6b";
  if (score >= 62) return "#1d4ed8";
  if (score >= 40) return "#d97706";
  return "#c91f2f";
}

export default function VisaScoring() {
  const { t } = useLanguage();
  const { setAssistantContext, resetAssistantContext } = useAIContext();
  const location = useLocation();
  const importedProfile = useMemo(() => {
    const state = location.state;
    if (!state || state.source !== "orientation") return null;

    const hasImportedValues =
      state.nationality ||
      state.destination ||
      state.purpose ||
      state.duration ||
      state.passportStatus ||
      state.recommendedService;

    if (!hasImportedValues) return null;

    return {
      nationalite: state.nationality || "",
      destination: state.destination || "",
      typeVisa: state.purpose || "",
      duration: state.duration || "",
      passportStatus: state.passportStatus || "",
      recommendedService: state.recommendedService || "",
    };
  }, [location.state]);

  const hasImportedProfile = Boolean(importedProfile);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(FORM_INITIAL);
  const [result, setResult] = useState(null);
  const [checklistState, setChecklistState] = useState(CHECKLIST_INITIAL);
  const [showImportedEditor, setShowImportedEditor] = useState(false);

  useEffect(() => {
    if (!importedProfile) return;

    setForm((current) => ({
      ...current,
      ...FORM_INITIAL,
      ...importedProfile,
    }));
    setResult(null);
    setChecklistState(CHECKLIST_INITIAL);
    setStep(1);
    setShowImportedEditor(false);
  }, [importedProfile]);

  const setField = (key, val) => {
    setForm((current) => ({ ...current, [key]: val }));
  };

  const recommendedService = useMemo(() => {
    const hasProfileContext =
      form.nationalite ||
      form.destination ||
      form.typeVisa ||
      form.duration ||
      form.passportStatus;

    if (!hasProfileContext) return form.recommendedService || "";
    return getRecommendedService(form);
  }, [form]);

  useEffect(() => {
    if (!recommendedService || form.recommendedService === recommendedService) return;
    setForm((current) => ({ ...current, recommendedService }));
  }, [form.recommendedService, recommendedService]);

  const activeService = recommendedService || form.recommendedService;
  const serviceDetails = SERVICE_DETAILS[activeService];
  const checklistKey = activeService || "U.S. Visa";

  const handleChecklistChange = (state) => {
    setChecklistState(state);
    const coreDocuments = (state.checkedEntries || [])
      .filter((item) => item.sectionKey === "requiredDocuments")
      .map((item) => item.label);

    setForm((current) => ({
      ...current,
      docs: coreDocuments,
    }));
  };

  const reviewApplication = () => {
    const score = calculerScoreVisa(form);
    setResult(score);
    setStep(4);
  };

  const reset = () => {
    setForm(importedProfile ? { ...FORM_INITIAL, ...importedProfile } : FORM_INITIAL);
    setResult(null);
    setChecklistState(CHECKLIST_INITIAL);
    setStep(1);
    setShowImportedEditor(false);
  };

  const step1Valid =
    form.nationalite &&
    form.destination &&
    form.typeVisa &&
    form.duration &&
    form.passportStatus;
  const step2Valid = form.revenu && form.emploi && form.voyages !== "";

  const liveScore = useMemo(() => {
    if (!step1Valid || !step2Valid) return null;
    return calculerScoreVisa(form);
  }, [form, step1Valid, step2Valid]);

  const analysis = useMemo(() => {
    if (!step1Valid) return null;

    return analyzeTravelProfile({
      nationality: form.nationalite,
      destination: form.destination,
      purpose: form.typeVisa,
      duration: form.duration,
      passportStatus: form.passportStatus,
      selectedDocuments: checklistState.checkedLabels,
      checklistProgress: checklistState.progress,
      checklistCompletedCount: checklistState.completedCount,
      checklistTotalItems: checklistState.totalCount,
      income: form.revenu,
      employmentStatus: form.emploi,
      travelHistory: form.voyages,
      baseScore: result?.score ?? liveScore?.score ?? null,
      recommendedService: activeService,
    });
  }, [activeService, checklistState, form, liveScore, result, step1Valid]);

  const visibleAnalysis = useMemo(() => {
    if (!analysis) return null;

    return {
      ...analysis,
      strengths: toReportList([...(analysis.strengths || []), ...(result?.pointsForts || [])]),
      profileStrength: toReportList([
        ...(analysis.profileStrength || []),
        ...(analysis.strengths || []),
        ...(result?.pointsForts || []),
      ]),
      recommendations: toReportList([
        ...(analysis.recommendations || []),
        ...(result?.recommandations || []),
      ]),
    };
  }, [analysis, result]);

  const displayAnalysis = visibleAnalysis || analysis;
  const finalReadinessScore = displayAnalysis?.preparationPercentage ?? result?.score ?? 0;
  const readinessLevel = displayAnalysis?.readinessStatus ?? result?.niveau ?? "In progress";
  const scoreColor = getReadinessColor(finalReadinessScore);

  useEffect(() => {
    const stepLabels = {
      1: "Travel profile",
      2: "Financial review",
      3: "Checklist preparation",
      4: "Readiness review",
    };

    setAssistantContext({
      currentPage: "review",
      recommendedService: activeService,
      destination: form.destination,
      journeyStep: stepLabels[step] || "Readiness review",
      readinessScore:
        analysis?.preparationPercentage ??
        result?.score ??
        liveScore?.score ??
        null,
      riskLevel: analysis?.riskLevel || "",
      checklistProgress: checklistState.progress ?? null,
      activeService,
      warnings: [
        ...(analysis?.detectedIssues?.slice(0, 2) || []),
        ...(result?.recommandations?.slice(0, 1) || []),
      ],
      missingDocuments: analysis?.missingDocuments || [],
    });
  }, [
    activeService,
    analysis,
    checklistState.progress,
    form.destination,
    liveScore,
    result,
    setAssistantContext,
    step,
  ]);

  useEffect(() => () => resetAssistantContext(), [resetAssistantContext]);

  const downloadReadinessReport = () => {
    const reportAnalysis = displayAnalysis;
    if (!result || !reportAnalysis) return;

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const generatedAt = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const reportMeta = {
      title: "Preparation Readiness Report",
      generatedAt,
      reference: buildReportReference(),
      service: formatReportValue(reportAnalysis.recommendedService || activeService),
    };

    const readinessValue = formatReportValue(finalReadinessScore, "%");
    const readinessLevelValue = formatReportValue(reportAnalysis.readinessStatus || result?.niveau);
    const riskLevelValue = formatReportValue(reportAnalysis.riskLevel);
    const recommendedPathValue = formatReportValue(
      reportAnalysis.recommendedService || activeService,
    );
    const nextBestAction = formatReportValue(reportAnalysis.nextBestAction);
    const selectedDocuments = toReportList(
      checklistState.checkedLabels?.length ? checklistState.checkedLabels : form.docs,
    );
    const strengths = toReportList([
      ...(reportAnalysis.profileStrength || []),
      ...(reportAnalysis.strengths || []),
      ...(result?.pointsForts || []),
    ]);
    const recommendations = toReportList([
      ...(reportAnalysis.recommendations || []),
      ...(result?.recommandations || []),
    ]);

    let y = REPORT_LAYOUT.contentTop;

    const startNewPage = () => {
      doc.addPage();
      drawPageHeader(doc, reportMeta);
      y = REPORT_LAYOUT.contentTop;
    };

    const ensureSpace = (height) => {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (y + height > pageHeight - REPORT_LAYOUT.footerReserve) {
        startNewPage();
      }
    };

    drawPageHeader(doc, reportMeta);
    y = drawMetaStrip(doc, reportMeta, y);

    ensureSpace(34);
    drawMetricCard(doc, {
      x: 14,
      y,
      width: 182,
      height: 30,
      label: "Preparation readiness score",
      value: readinessValue,
      accent: REPORT_COLORS.softBlue,
      helperText: readinessLevelValue,
    });
    y += 36;

    ensureSpace(24);
    drawCompactMetric(doc, {
      x: 14,
      y,
      width: 58,
      label: "Readiness level",
      value: readinessLevelValue,
    });
    drawBadgeCard(doc, {
      x: 76,
      y,
      width: 54,
      label: "Risk level",
      value: riskLevelValue,
      theme: getRiskBadgeTheme(reportAnalysis.riskLevel),
    });
    drawCompactMetric(doc, {
      x: 136,
      y,
      width: 60,
      label: "Recommended path",
      value: recommendedPathValue,
    });
    y += 24;

    ensureSpace(30);
    y = drawTextCallout(doc, "Next best action", nextBestAction, y);

    ensureSpace(70);
    y = drawDetailSection(
      doc,
      "User profile",
      [
        { label: "Nationality", value: formatReportValue(form.nationalite) },
        { label: "Destination", value: formatReportValue(form.destination) },
        { label: "Travel purpose", value: formatReportValue(form.typeVisa) },
        { label: "Trip duration", value: formatTripDuration(form.duration) },
        { label: "Passport status", value: formatReportValue(form.passportStatus) },
        { label: "Recommended path", value: reportMeta.service },
        { label: "Monthly income", value: formatCurrencyValue(form.revenu) },
        { label: "Employment status", value: formatReportValue(form.emploi) },
        { label: "Travel history", value: formatTravelHistoryValue(form.voyages) },
      ],
      y,
    );

    ensureSpace(26);
    y = drawDetailSection(
      doc,
      "Checklist progress",
      [
        {
          label: "Completion",
          value:
            checklistState.totalCount > 0
              ? `${checklistState.completedCount}/${checklistState.totalCount} items completed`
              : "Not available",
        },
        {
          label: "Selected preparation items",
          value:
            selectedDocuments.length > 0
              ? `${selectedDocuments.length} item(s) currently selected`
              : "Not available",
        },
      ],
      y,
    );

    ensureSpace(32);
    y = drawListSection(doc, "Preparation items selected", selectedDocuments, y, REPORT_COLORS.blue);

    ensureSpace(32);
    y = drawListSection(
      doc,
      "Detected issues",
      reportAnalysis.detectedIssues,
      y,
      REPORT_COLORS.danger,
    );

    ensureSpace(32);
    y = drawListSection(doc, "Strengths", strengths, y, REPORT_COLORS.success);

    ensureSpace(32);
    y = drawListSection(
      doc,
      "Recommendations",
      recommendations,
      y,
      REPORT_COLORS.warning,
    );

    ensureSpace(32);
    y = drawListSection(
      doc,
      "Country-specific advice",
      reportAnalysis.countryAdvice,
      y,
      REPORT_COLORS.slate,
    );

    ensureSpace(32);
    drawTextCallout(doc, "Important notice", REPORT_NOTICE, y);

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      drawPageFooter(doc, page, pageCount);
    }

    doc.save("travel-mundo-readiness-report.pdf");
  };

  const renderProfileForm = !hasImportedProfile || showImportedEditor;
  const isWideMode = step === 3 || step === 4;

  return (
    <section className="vs-page">
      <div className="vs-bg-orb vs-bg-orb-1" />
      <div className="vs-bg-orb vs-bg-orb-2" />

      <PageHero
        align="center"
        eyebrow={t("visaScoring.badge")}
        icon={<FiAward size={14} />}
        title={t("visaScoring.title")}
        description={t("visaScoring.subtitle")}
      />

      <div
        className={`container ${isWideMode ? "vs-container-wide" : ""}`}
        style={{ paddingTop: 36 }}
      >
        <StepIndicator step={step} />

        <div
          className={`vs-card ${isWideMode ? "wide-mode" : ""} ${
            step === 4 ? "result-mode" : ""
          }`}
        >
          <div className="vs-card-top">
            <div>
              <p className="vs-mini-kicker">{t("visaScoring.smartFlow")}</p>
              <h2 className="vs-card-title">
                {step === 1 && t("visaScoring.travelProfile")}
                {step === 2 && t("visaScoring.finances")}
                {step === 3 && t("visaScoring.checklist")}
                {step === 4 && t("visaScoring.applicationScore")}
              </h2>
            </div>

            <div className="vs-top-badges">
              {hasImportedProfile && (
                <span className="vs-imported-badge">
                  <FiCheckCircle size={14} />
                  Imported from Orientation
                </span>
              )}
              <div className="vs-step-badge">
                {t("visaScoring.step")} {step} {t("visaScoring.of")} 4
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="vs-form-grid">
              {hasImportedProfile && !renderProfileForm ? (
                <>
                  <div className="vs-imported-panel">
                    <div className="vs-imported-head">
                      <div>
                        <p className="vs-mini-kicker">Imported profile</p>
                        <h3 className="vs-imported-title">
                          Your orientation data is already loaded
                        </h3>
                      </div>
                      <button
                        className="vs-btn-ghost vs-edit-button"
                        onClick={() => setShowImportedEditor(true)}
                      >
                        Edit imported details
                      </button>
                    </div>

                    <div className="vs-summary-grid">
                      <SummaryItem
                        label={t("visaScoring.nationality")}
                        value={form.nationalite}
                      />
                      <SummaryItem
                        label={t("visaScoring.destination")}
                        value={form.destination}
                      />
                      <SummaryItem
                        label={t("visaScoring.travelPurpose")}
                        value={form.typeVisa}
                      />
                      <SummaryItem label="Duration" value={`${form.duration} day(s)`} />
                      <SummaryItem label="Passport status" value={form.passportStatus} />
                      <SummaryItem label="Recommended service" value={activeService} />
                    </div>
                  </div>

                  <button
                    className="vs-btn-primary full"
                    disabled={!step1Valid}
                    onClick={() => setStep(2)}
                  >
                    {t("visaScoring.continue")} <FiChevronRight size={16} />
                  </button>
                </>
              ) : (
                <>
                  {hasImportedProfile && (
                    <div className="vs-imported-inline-note">
                      Imported orientation data is prefilled below. You can adjust it before continuing.
                    </div>
                  )}

                  <FieldShell label={t("visaScoring.nationality")} icon={<FiUser size={14} />}>
                    <select
                      value={form.nationalite}
                      onChange={(e) => setField("nationalite", e.target.value)}
                      className="vs-input"
                    >
                      <option value="">{t("visaScoring.selectNationality")}</option>
                      {NATIONALITIES.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </FieldShell>

                  <FieldShell label={t("visaScoring.destination")} icon={<FiGlobe size={14} />}>
                    <select
                      value={form.destination}
                      onChange={(e) => setField("destination", e.target.value)}
                      className="vs-input"
                    >
                      <option value="">{t("visaScoring.selectDestination")}</option>
                      {DESTINATIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </FieldShell>

                  <FieldShell
                    label={t("visaScoring.travelPurpose")}
                    icon={<FiFileText size={14} />}
                  >
                    <select
                      value={form.typeVisa}
                      onChange={(e) => setField("typeVisa", e.target.value)}
                      className="vs-input"
                    >
                      <option value="">{t("visaScoring.selectPurpose")}</option>
                      {REVIEW_PURPOSES.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </FieldShell>

                  <FieldShell label="Duration" icon={<FiClock size={14} />}>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 14"
                      value={form.duration}
                      onChange={(e) => setField("duration", e.target.value)}
                      className="vs-input"
                    />
                  </FieldShell>

                  <FieldShell label="Passport status" icon={<FiFileText size={14} />}>
                    <div className="vs-chip-grid">
                      {PASSPORT_STATUS_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setField("passportStatus", option)}
                          className={`vs-chip ${
                            form.passportStatus === option ? "selected" : ""
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </FieldShell>

                  <div className="vs-service-preview">
                    <span>Recommended service</span>
                    <strong>{activeService || "Pending"}</strong>
                    <p>
                      {serviceDetails?.explanation ||
                        "Complete the profile so Review can align the checklist and guidance analysis with the right route."}
                    </p>
                  </div>

                  <button
                    className="vs-btn-primary full"
                    disabled={!step1Valid}
                    onClick={() => setStep(2)}
                  >
                    {t("visaScoring.continue")} <FiChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="vs-form-grid">
              <FieldShell
                label={t("visaScoring.monthlyIncome")}
                icon={<FiDollarSign size={14} />}
              >
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 2500"
                  value={form.revenu}
                  onChange={(e) => setField("revenu", e.target.value)}
                  className="vs-input"
                />
              </FieldShell>

              <FieldShell
                label={t("visaScoring.employmentStatus")}
                icon={<FiBriefcase size={14} />}
              >
                <div className="vs-chip-grid">
                  {EMPLOYMENT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setField("emploi", option)}
                      className={`vs-chip ${
                        form.emploi === option ? "selected" : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </FieldShell>

              <FieldShell
                label={t("visaScoring.travelHistory")}
                icon={<FiGlobe size={14} />}
              >
                <input
                  type="number"
                  min="0"
                  max="50"
                  placeholder="e.g. 3"
                  value={form.voyages}
                  onChange={(e) => setField("voyages", e.target.value)}
                  className="vs-input"
                />
              </FieldShell>

              <div className="vs-actions-row">
                <button className="vs-btn-ghost" onClick={() => setStep(1)}>
                  <FiChevronLeft size={16} /> {t("visaScoring.back")}
                </button>

                <button
                  className="vs-btn-primary"
                  disabled={!step2Valid}
                  onClick={() => setStep(3)}
                >
                  {t("visaScoring.continue")} <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="vs-review-dashboard-layout vs-checklist-layout">
              <div className="vs-checklist-column">
                <div className="vs-service-header">
                  <div>
                    <p className="vs-mini-kicker">Full review checklist</p>
                    <h3>{activeService || "Service pending"}</h3>
                  </div>
                </div>

                <p className="vs-docs-helper">
                  {t("visaScoring.docsHelper")} The checklist now adapts to{" "}
                  {activeService || "the selected service"} so the readiness guidance,
                  support items, and detected issues update in real time.
                </p>

                <DynamicChecklist
                  key={checklistKey}
                  service={checklistKey}
                  onStateChange={handleChecklistChange}
                />

                <div className="vs-actions-row" style={{ marginTop: 24 }}>
                  <button className="vs-btn-ghost" onClick={() => setStep(2)}>
                    <FiChevronLeft size={16} /> {t("visaScoring.back")}
                  </button>

                  <button className="vs-btn-primary" onClick={reviewApplication}>
                    {t("visaScoring.reviewApplication")} <FiAward size={16} />
                  </button>
                </div>
              </div>

              <div className="vs-ai-column">
                {displayAnalysis && (
                  <div className="vs-ai-summary-strip">
                    <SummaryItem
                      label="Recommended path"
                      value={displayAnalysis.recommendedService || activeService}
                    />
                    <SummaryItem
                      label="Readiness level"
                      value={displayAnalysis.readinessStatus}
                    />
                    <SummaryItem
                      label="Risk level"
                      value={displayAnalysis.riskLevel}
                    />
                  </div>
                )}
                <AIAnalysisPanel analysis={displayAnalysis} />
              </div>
            </div>
          )}

          {step === 4 && result && displayAnalysis && (
            <div className="vs-review-dashboard-layout vs-result-layout">
              <div className="vs-score-panel">
                <div className="vs-score-panel-inner">
                  <p className="vs-mini-kicker centered">{t("visaScoring.badge")}</p>
                  <h3 className="vs-score-title">Preparation Readiness Score</h3>

                  <div className="vs-gauge-wrap">
                    <ScoreGauge
                      score={finalReadinessScore}
                      couleur={scoreColor}
                      label="readiness"
                    />
                  </div>

                  <p className="vs-main-score-note">{READINESS_SCORE_NOTE}</p>

                  <div className="vs-result-meta">
                    <div className="vs-result-meta-card">
                      <span>Readiness level</span>
                      <strong style={{ color: scoreColor }}>{readinessLevel}</strong>
                    </div>

                    <div className="vs-result-meta-card">
                      <span>Risk level</span>
                      <strong>{displayAnalysis.riskLevel || "Not available"}</strong>
                    </div>

                    <div className="vs-result-meta-card">
                      <span>Recommended path</span>
                      <strong>
                        {displayAnalysis.recommendedService || activeService || "Pending"}
                      </strong>
                    </div>

                    <div className="vs-result-meta-card vs-result-meta-card--wide">
                      <span>Next best action</span>
                      <p>
                        {displayAnalysis.nextBestAction ||
                          "Strengthen the preparation file before moving forward on the dedicated portal."}
                      </p>
                    </div>
                  </div>

                  <div className="vs-result-explainer">
                    <p className="vs-result-explainer-title">What this means</p>
                    <p>{READINESS_MEANING_TEXT}</p>
                  </div>

                  <div className="vs-score-panel-actions">
                    <button
                      className="vs-report-button"
                      onClick={downloadReadinessReport}
                    >
                      <FiDownload size={15} /> {t("visaScoring.downloadReport")}
                    </button>

                    <button className="vs-btn-primary full" onClick={reset}>
                      <FiRefreshCw size={15} /> {t("visaScoring.startAgain")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="vs-dashboard-panel">
                <AIAnalysisPanel analysis={displayAnalysis} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .vs-page {
          position: relative;
          overflow: hidden;
          padding: 0 0 90px;
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 30%),
            radial-gradient(circle at bottom right, rgba(14,165,233,0.08), transparent 28%),
            linear-gradient(180deg, #f8fbff 0%, #f4f7fb 100%);
        }

        .vs-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          pointer-events: none;
        }

        .vs-bg-orb-1 {
          width: 320px;
          height: 320px;
          top: -90px;
          right: -80px;
          background: rgba(37, 99, 235, 0.09);
        }

        .vs-bg-orb-2 {
          width: 260px;
          height: 260px;
          bottom: 40px;
          left: -80px;
          background: rgba(14, 165, 233, 0.08);
        }

        .vs-hero-head {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 32px;
        }

        .vs-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 34px;
        }

        .vs-step-wrap {
          display: flex;
          align-items: center;
        }

        .vs-step-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .vs-step-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(148,163,184,0.22);
          color: var(--gray-500);
          box-shadow: 0 8px 24px rgba(15,23,42,0.06);
          transition: 0.25s ease;
          backdrop-filter: blur(8px);
        }

        .vs-step-circle.active {
          background: linear-gradient(135deg, var(--blue-700), var(--blue-500));
          color: white;
          border-color: transparent;
          box-shadow: 0 16px 36px rgba(37,99,235,0.26);
          transform: translateY(-2px);
        }

        .vs-step-circle.done {
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          color: white;
          border-color: transparent;
        }

        .vs-step-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--gray-400);
        }

        .vs-step-label.current-label {
          color: var(--blue-700);
        }

        .vs-step-line {
          width: 84px;
          height: 3px;
          border-radius: 999px;
          margin: 0 10px;
          background: rgba(203,213,225,0.8);
          margin-top: -24px;
        }

        .vs-step-line.filled {
          background: linear-gradient(90deg, var(--blue-500), #38bdf8);
        }

        .vs-container-wide {
          max-width: 1380px;
        }

        .vs-card {
          max-width: 760px;
          margin: 0 auto;
          width: 100%;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 28px;
          padding: 34px;
          box-shadow:
            0 20px 60px rgba(15,23,42,0.10),
            inset 0 1px 0 rgba(255,255,255,0.9);
          transition: all 0.25s ease;
        }

        .vs-card.result-mode,
        .vs-card.wide-mode {
          max-width: 1320px;
          width: 100%;
        }

        .vs-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(226,232,240,0.9);
        }

        .vs-mini-kicker {
          margin: 0 0 6px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--blue-600);
        }

        .vs-mini-kicker.centered {
          text-align: center;
        }

        .vs-card-title,
        .vs-imported-title {
          margin: 0;
          font-family: var(--font-heading);
          font-size: 1.45rem;
          color: var(--blue-900);
        }

        .vs-top-badges {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
          align-items: center;
        }

        .vs-step-badge,
        .vs-imported-badge {
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .vs-step-badge {
          background: rgba(37,99,235,0.08);
          color: var(--blue-700);
        }

        .vs-imported-badge {
          background: rgba(15,118,110,0.08);
          color: #0f766e;
        }

        .vs-form-grid {
          display: grid;
          gap: 20px;
        }

        .vs-field-shell {
          display: grid;
          gap: 10px;
        }

        .vs-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--blue-900);
        }

        .vs-label-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(37,99,235,0.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--blue-700);
          flex-shrink: 0;
        }

        .vs-input {
          width: 100%;
          min-height: 54px;
          border-radius: 14px;
          border: 1.5px solid rgba(203,213,225,0.9);
          background: rgba(248,250,252,0.85);
          padding: 0 16px;
          font-size: 15px;
          color: var(--gray-800);
          outline: none;
          transition: 0.22s ease;
          box-sizing: border-box;
        }

        .vs-input:focus {
          border-color: rgba(37,99,235,0.55);
          background: white;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.10);
        }

        .vs-chip-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .vs-chip {
          border: 1.5px solid rgba(203,213,225,0.9);
          background: white;
          color: var(--gray-700);
          border-radius: 999px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .vs-chip:hover {
          transform: translateY(-1px);
          border-color: rgba(37,99,235,0.3);
        }

        .vs-chip.selected {
          background: linear-gradient(135deg, rgba(37,99,235,0.12), rgba(56,189,248,0.10));
          border-color: var(--blue-500);
          color: var(--blue-700);
          box-shadow: 0 10px 24px rgba(37,99,235,0.12);
        }

        .vs-service-preview,
        .vs-imported-panel {
          border-radius: 20px;
          border: 1px solid rgba(189,210,238,0.82);
          background: linear-gradient(180deg, rgba(248,251,255,0.98), rgba(240,247,255,0.92));
          padding: 20px;
          display: grid;
          gap: 8px;
        }

        .vs-service-preview span,
        .vs-summary-item span {
          color: var(--gray-500);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .vs-service-preview strong,
        .vs-summary-item strong {
          color: var(--blue-900);
          font-family: var(--font-heading);
        }

        .vs-service-preview p {
          margin: 0;
          color: var(--gray-700);
          line-height: 1.7;
          font-size: 14px;
        }

        .vs-service-preview.compact {
          text-align: left;
        }

        .vs-imported-head {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .vs-summary-grid,
        .vs-ai-summary-strip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .vs-summary-item {
          border-radius: 18px;
          background: white;
          border: 1px solid rgba(226,232,240,0.95);
          padding: 14px;
          display: grid;
          gap: 6px;
          box-shadow: 0 10px 24px rgba(15,23,42,0.05);
        }

        .vs-imported-inline-note {
          border-radius: 16px;
          background: rgba(15,118,110,0.08);
          color: #115e59;
          padding: 14px 16px;
          font-size: 14px;
          line-height: 1.65;
        }

        .vs-actions-row {
          display: flex;
          gap: 12px;
          margin-top: 6px;
        }

        .vs-btn-primary,
        .vs-btn-ghost {
          min-height: 52px;
          border-radius: 14px;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 18px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.22s ease;
        }

        .vs-btn-primary {
          background: linear-gradient(135deg, var(--blue-700), var(--blue-500));
          color: white;
          box-shadow: 0 14px 28px rgba(37,99,235,0.24);
          flex: 1;
        }

        .vs-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 36px rgba(37,99,235,0.28);
        }

        .vs-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .vs-btn-ghost {
          background: white;
          color: var(--gray-700);
          border: 1.5px solid rgba(203,213,225,0.9);
          flex: 1;
        }

        .vs-btn-ghost:hover {
          background: var(--gray-50);
        }

        .vs-btn-primary.full {
          width: 100%;
        }

        .vs-edit-button {
          flex: none;
        }

        .vs-report-button {
          min-height: 52px;
          width: 100%;
          border-radius: 14px;
          border: 1.5px solid rgba(37,99,235,0.24);
          background: white;
          color: var(--blue-700);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 18px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(15,23,42,0.05);
          transition: 0.22s ease;
        }

        .vs-report-button:hover {
          transform: translateY(-1px);
          border-color: rgba(37,99,235,0.44);
          background: var(--blue-50);
        }

        .vs-docs-helper {
          margin: 0 0 20px;
          color: var(--gray-600);
          font-size: 14px;
          line-height: 1.7;
        }

        .vs-review-dashboard-layout,
        .vs-checklist-layout,
        .vs-result-layout {
          display: grid;
          grid-template-columns: minmax(360px, 0.9fr) minmax(520px, 1.4fr);
          gap: 28px;
          align-items: start;
        }

        .vs-checklist-column,
        .vs-ai-column,
        .vs-dashboard-panel {
          min-width: 0;
          display: grid;
          gap: 18px;
        }

        .vs-checklist-column {
          align-content: start;
        }

        .vs-ai-column,
        .vs-dashboard-panel {
          align-content: start;
        }

        .vs-ai-column .ai-intel,
        .vs-dashboard-panel .ai-intel {
          margin-top: 0;
          width: 100%;
          max-width: none;
        }

        .vs-service-header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .vs-service-header h3 {
          margin: 0;
          color: var(--blue-900);
          font-family: var(--font-heading);
          font-size: 1.35rem;
        }

        .vs-live-metric {
          min-width: 92px;
          border-radius: 18px;
          background: linear-gradient(135deg, var(--blue-800), var(--blue-500));
          color: white;
          padding: 14px;
          text-align: center;
          box-shadow: 0 16px 34px rgba(37,99,235,0.18);
        }

        .vs-live-metric strong {
          display: block;
          font-size: 1.3rem;
          line-height: 1;
        }

        .vs-live-metric span {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.78);
        }

        .vs-score-panel {
          position: sticky;
          top: 24px;
        }

        .vs-score-panel-inner {
          background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
          border: 1px solid rgba(191,219,254,0.8);
          border-radius: 24px;
          padding: 26px 22px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.85);
          display: grid;
          gap: 18px;
        }

        .vs-score-title {
          margin: 0;
          font-size: 1.2rem;
          font-family: var(--font-heading);
          color: var(--blue-900);
          text-align: center;
        }

        .vs-gauge-wrap {
          display: flex;
          justify-content: center;
        }

        .vs-main-score-note {
          margin: 0;
          padding: 16px 18px;
          border-radius: 18px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(226,232,240,0.95);
          color: var(--gray-700);
          font-size: 13.5px;
          line-height: 1.72;
          box-shadow: 0 12px 28px rgba(15,23,42,0.05);
        }

        .vs-result-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .vs-result-meta-card {
          border-radius: 18px;
          background: white;
          border: 1px solid rgba(226,232,240,0.95);
          padding: 16px;
          display: grid;
          gap: 8px;
          box-shadow: 0 12px 28px rgba(15,23,42,0.06);
        }

        .vs-result-meta-card span {
          color: var(--gray-500);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .vs-result-meta-card strong {
          color: var(--blue-900);
          font-family: var(--font-heading);
          font-size: 1rem;
          line-height: 1.35;
        }

        .vs-result-meta-card p {
          margin: 0;
          color: var(--gray-700);
          font-size: 14px;
          line-height: 1.7;
        }

        .vs-result-meta-card--wide {
          grid-column: 1 / -1;
        }

        .vs-result-explainer {
          border-radius: 20px;
          padding: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(239,246,255,0.94));
          border: 1px solid rgba(191,219,254,0.9);
          box-shadow: 0 14px 28px rgba(15,23,42,0.05);
        }

        .vs-result-explainer-title {
          margin: 0 0 8px;
          color: var(--blue-900);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .vs-result-explainer p:last-child {
          margin: 0;
          color: var(--gray-700);
          font-size: 14px;
          line-height: 1.72;
        }

        .vs-score-panel-actions {
          display: grid;
          gap: 12px;
        }

        .vs-summary-box {
          background: white;
          border: 1px solid rgba(226,232,240,0.95);
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 12px 28px rgba(15,23,42,0.06);
        }

        .vs-summary-label {
          margin: 0 0 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .vs-summary-level {
          margin: 0 0 8px;
          font-size: 1rem;
          font-weight: 800;
        }

        .vs-summary-text {
          margin: 0;
          font-size: 13.5px;
          color: var(--gray-700);
          line-height: 1.7;
        }

        .vs-ai-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .vs-ai-pill {
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(37,99,235,0.08);
          color: var(--blue-700);
          font-size: 12px;
          font-weight: 800;
        }

        .vs-insight-box {
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 14px 28px rgba(15,23,42,0.05);
          text-align: left;
        }

        .vs-insight-box.compact {
          padding: 18px;
        }

        .vs-insight-box.green {
          background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%);
          border: 1px solid #bbf7d0;
        }

        .vs-insight-box.orange {
          background: linear-gradient(180deg, #fff7ed 0%, #fffaf5 100%);
          border: 1px solid #fed7aa;
        }

        .vs-insight-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 14px;
          font-size: 1rem;
          font-weight: 800;
        }

        .green-text {
          color: #15803d;
        }

        .orange-text {
          color: #c2410c;
        }

        .vs-list {
          margin: 0;
          padding-left: 18px;
        }

        .vs-list li {
          margin-bottom: 10px;
          color: var(--gray-700);
          line-height: 1.75;
        }

        @media (max-width: 980px) {
          .vs-container-wide {
            max-width: 1200px;
          }

          .vs-review-dashboard-layout,
          .vs-checklist-layout,
          .vs-result-layout {
            grid-template-columns: 1fr;
          }

          .vs-score-panel {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .vs-page {
            padding: 46px 0 70px;
          }

          .vs-card {
            padding: 22px;
            border-radius: 22px;
          }

          .vs-card-top,
          .vs-imported-head,
          .vs-service-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .vs-top-badges {
            justify-content: flex-start;
          }

          .vs-actions-row {
            flex-direction: column;
          }

          .vs-step-line {
            width: 40px;
          }

          .vs-step-label {
            font-size: 11px;
          }

          .vs-summary-grid,
          .vs-ai-summary-strip {
            grid-template-columns: 1fr;
          }

          .vs-result-meta {
            grid-template-columns: 1fr;
          }

          .vs-result-meta-card--wide {
            grid-column: auto;
          }
        }

        @media (max-width: 560px) {
          .vs-steps {
            gap: 12px;
          }

          .vs-step-wrap {
            width: calc(50% - 8px);
            justify-content: center;
          }

          .vs-step-line {
            display: none;
          }

          .vs-card-title,
          .vs-imported-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
}
