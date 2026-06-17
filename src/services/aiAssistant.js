import { DOCUMENTS_LIBRARY } from "../data/documentsLibrary";
import { SERVICE_DETAILS } from "../data/serviceRouting";

const PAGE_MAP = {
  "/orientation": "orientation",
  "/visa-scoring": "review",
  "/travel-flow": "travelFlow",
  "/instructions": "instructions",
  "/documents": "instructions",
  "/services": "services",
  "/suivi": "track",
  "/contact": "contact",
  "/a-propos": "about",
  "/": "home",
};

const PAGE_CONFIG = {
  orientation: {
    title: "Orientation",
    greeting: "Need help choosing the right service?",
    suggestions: [
      "Which service should I choose?",
      "Do I need ESTA or U.S. Visa?",
      "What preparation items should I prepare?",
    ],
  },
  review: {
    title: "Readiness Review",
    greeting: "Use the readiness review to organize your preparation.",
    suggestions: [
      "How does readiness review work?",
      "How can I improve readiness?",
      "What preparation items are missing?",
    ],
  },
  travelFlow: {
    title: "Travel Journey",
    greeting: "Explore the recommended journey.",
    suggestions: [
      "Explain the process",
      "Show next step",
      "Compare ESTA and Visa",
    ],
  },
  instructions: {
    title: "Instructions",
    greeting: "Let's prepare your guidance steps.",
    suggestions: [
      "Which preparation items are required?",
      "Common mistakes",
      "Preparation tips",
    ],
  },
  services: {
    title: "Services",
    greeting: "Explore the supported UK and U.S. service paths.",
    suggestions: [
      "Explain the supported services",
      "Which path fits my travel?",
      "What should I prepare first?",
    ],
  },
  track: {
    title: "Track",
    greeting: "Follow your current Travel Mundo reference.",
    suggestions: [
      "How does tracking work?",
      "What happens after readiness review?",
      "What should I prepare next?",
    ],
  },
  home: {
    title: "Home",
    greeting: "Ask for guidance on the next travel support step.",
    suggestions: [
      "Show supported services",
      "Start with orientation",
      "Explain Travel Mundo",
    ],
  },
  default: {
    title: "Travel Mundo",
    greeting: "Live guidance is ready for your current page.",
    suggestions: [
      "Show next step",
      "Explain the process",
      "What should I prepare first?",
    ],
  },
};

const SERVICES = ["ESTA", "U.S. Visa", "UK ETA", "U.S. Passport"];
const DEFAULT_FALLBACK_REPLY =
  "I can help with service orientation, preparation items, readiness review, tracking references, and dedicated portal guidance.";

const GUARANTEED_REPLIES = {
  readinessReview:
    "The readiness review checks the traveler profile, selected preparation items, detected issues, and route consistency. It provides a preparation score and recommendations before continuing on the dedicated portal.",
  improveReadiness:
    "To improve readiness, complete the missing preparation items, verify passport information, review travel purpose and duration, and follow the recommended next action before opening the dedicated portal.",
  missingItems:
    "Missing preparation items depend on the selected service. Open the Instructions page or complete the checklist in Readiness Review to see the items that still need attention.",
  ESTA:
    "ESTA is generally used for short U.S. tourism, business, or transit travel when the traveler matches the eligible route. Travel Mundo helps prepare the required information before continuing on the dedicated portal.",
  "U.S. Visa":
    "U.S. Visa guidance is recommended for longer stays, study, family travel, or cases that do not fit ESTA. Travel Mundo helps review preparation items and consistency before the dedicated portal step.",
  "UK ETA":
    "UK ETA guidance supports travelers preparing for short travel to the United Kingdom. The platform helps review passport details, travel purpose, and preparation items before portal handoff.",
  "U.S. Passport":
    "U.S. Passport guidance helps travelers prepare renewal, replacement, correction, or first-time passport support items before continuing through the dedicated service path.",
};

const SERVICE_PATTERNS = [
  { service: "ESTA", patterns: ["esta"] },
  { service: "U.S. Visa", patterns: ["u.s. visa", "us visa", "american visa"] },
  { service: "UK ETA", patterns: ["uk eta", "eta uk", "united kingdom eta"] },
  {
    service: "U.S. Passport",
    patterns: ["u.s. passport", "us passport", "passport"],
  },
];

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function toPercent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function getPageConfig(currentPage) {
  return PAGE_CONFIG[currentPage] || PAGE_CONFIG.default;
}

function getLibraryEntry(service) {
  return DOCUMENTS_LIBRARY.find((entry) => entry.service === service);
}

function formatList(items) {
  return (items || []).filter(Boolean).join(", ");
}

export function inferCurrentPage(pathname = "") {
  return PAGE_MAP[pathname] || "default";
}

export function getQuickActionServices() {
  return SERVICES;
}

export function getServiceKnowledge(service) {
  const entry = getLibraryEntry(service);
  const details = SERVICE_DETAILS[service];

  if (!entry || !details) return null;

  return {
    service,
    description: details.explanation,
    documents: entry.documents.slice(0, 3).map((item) => item.label),
    mistakes: entry.mistakes.slice(0, 3).map((item) => item.label),
    tips: entry.tips.slice(0, 3).map((item) => item.label),
    destination: entry.destination,
    url: entry.url,
  };
}

export function formatServiceKnowledge(service) {
  return GUARANTEED_REPLIES[service] || DEFAULT_FALLBACK_REPLY;
}

export function getContextualSuggestions(context = {}) {
  const pageConfig = getPageConfig(context.currentPage);
  const score = toPercent(context.readinessScore);
  const checklistProgress = toPercent(context.checklistProgress);
  const service =
    context.recommendedService || context.activeService || "your selected service";
  const warnings = [...(context.warnings || [])];
  const suggestions = [...pageConfig.suggestions];
  const destination = context.destination || "";
  const step = context.journeyStep || "";
  const missingDocuments = context.missingDocuments || [];

  if (context.currentPage === "review" && score !== null && score > 0) {
    suggestions.unshift(
      score < 70 ? "Why is my score low?" : "How can I prepare the final handoff?",
    );
  }

  if (context.currentPage === "instructions" && context.activeService) {
    suggestions.unshift(`Show ${context.activeService} requirements`);
  }

  if (context.currentPage === "travelFlow" && destination) {
    suggestions.unshift(`Explain the ${destination} path`);
  }

  if (context.currentPage === "orientation" && service && service !== "your selected service") {
    suggestions.unshift(`Why was ${service} recommended?`);
  }

  if (!context.recommendedService && context.currentPage === "orientation") {
    warnings.push("Complete the orientation profile to unlock the recommended service.");
  }

  if (context.currentPage === "review" && score !== null && score > 0) {
    if (score < 60 || normalize(context.riskLevel) === "high") {
      warnings.push("Some preparation items may still need attention.");
    } else if (score < 80) {
      warnings.push("A few support items may still need attention before continuing.");
    }
  }

  if (checklistProgress !== null && checklistProgress > 0 && checklistProgress < 70) {
    warnings.push("Some preparation items may still need attention.");
  }

  if (missingDocuments.length) {
    warnings.push(`Missing support areas: ${missingDocuments.slice(0, 3).join(", ")}.`);
  }

  let insightLine =
    "Your preparation guidance will update as you complete the orientation or readiness review.";
  if (checklistProgress !== null && checklistProgress > 0 && context.recommendedService) {
    insightLine = `Your ${context.recommendedService} preparation is ${checklistProgress}% complete.`;
  } else if (context.currentPage === "review" && (score === null || score === 0)) {
    insightLine = "Start the readiness review to receive a preparation score.";
  } else if (score !== null && score > 0 && context.currentPage === "review") {
    insightLine = `Your readiness review is currently at ${score}%.`;
  } else if (destination && context.currentPage === "travelFlow") {
    insightLine = `${destination} is the active route in the travel journey experience.`;
  } else if (context.activeService && context.currentPage === "instructions") {
    insightLine = `${context.activeService} is currently active in the instructions center.`;
  } else if (context.currentPage === "orientation" && !context.recommendedService) {
    insightLine = "Complete the orientation to receive tailored guidance.";
  } else if (context.currentPage === "orientation") {
    insightLine = "Orientation is ready to guide you toward the correct service path.";
  }

  let nextStep = "Continue with the next guided Travel Mundo step.";
  if (context.currentPage === "orientation") {
    nextStep = context.recommendedService
      ? `Move from orientation to ${context.recommendedService} readiness review.`
      : "Complete destination, purpose, nationality, and passport status to get a recommendation.";
  } else if (context.currentPage === "review") {
    if (score === null || score === 0) {
      nextStep = "Complete more preparation items before continuing.";
    } else {
      nextStep =
        checklistProgress !== null && checklistProgress < 100
          ? "Complete more preparation items before continuing."
          : "Generate the preparation report and continue on the dedicated portal.";
    }
  } else if (context.currentPage === "travelFlow") {
    nextStep = step
      ? `The current flow focus is ${step}. Continue into Orientation or Review when ready.`
      : "Select a destination flow, then continue to Orientation or Review.";
  } else if (context.currentPage === "instructions") {
    nextStep = context.activeService
      ? `Use the ${context.activeService} instructions to prepare the required items before review.`
      : "Choose a service filter to inspect the required preparation items, common mistakes, and tips.";
  }

  return {
    pageTitle: pageConfig.title,
    greeting: pageConfig.greeting,
    suggestions: [...new Set(suggestions)].slice(0, 4),
    warnings: [...new Set(warnings)].slice(0, 1),
    nextStep,
    insightLine,
    liveBadge: "Online",
  };
}

function compareEstaAndVisa() {
  return [
    "ESTA is best for short U.S. tourism, business, or transit stays of 90 days or less.",
    "U.S. Visa is better for study, long stays, or cases that do not fit ESTA.",
    "ESTA usually focuses on passport, contact details, and travel purpose.",
    "U.S. Visa usually needs DS-160, interview preparation, and stronger supporting evidence.",
  ].join("\n");
}

function getDocumentsPrompt(service) {
  if (!service) {
    return "Choose ESTA, U.S. Visa, U.S. Passport, or UK ETA and I will summarize the main preparation requirements.";
  }
  const entry = getLibraryEntry(service);
  if (!entry) return "I could not find instruction guidance for that service yet.";

  return [
    `${service} instruction focus:`,
    `Required: ${formatList(entry.documents.slice(0, 4).map((item) => item.label))}`,
    `Common mistakes: ${formatList(entry.mistakes.slice(0, 2).map((item) => item.label))}`,
    `Preparation tips: ${formatList(entry.tips.slice(0, 2).map((item) => item.label))}`,
  ].join("\n");
}

export function getContextualReply(message, context = {}, fallbackReply = "") {
  const normalizedMessage = normalize(message);
  const serviceMatch = SERVICE_PATTERNS.find(({ patterns }) =>
    patterns.some((pattern) => normalizedMessage.includes(pattern)),
  );
  const service = serviceMatch?.service;

  if (service) {
    return formatServiceKnowledge(service);
  }

  if (normalizedMessage.includes("readiness review")) {
    return GUARANTEED_REPLIES.readinessReview;
  }

  if (
    normalizedMessage.includes("compare esta and visa") ||
    (normalizedMessage.includes("esta") && normalizedMessage.includes("visa"))
  ) {
    return compareEstaAndVisa();
  }

  if (
    normalizedMessage.includes("show next step") ||
    normalizedMessage.includes("next step") ||
    normalizedMessage.includes("what should i do next")
  ) {
    return getContextualSuggestions(context).nextStep;
  }

  if (
    normalizedMessage.includes("why is my score low") ||
    normalizedMessage.includes("improve readiness") ||
    normalizedMessage.includes("how can i improve readiness")
  ) {
    return GUARANTEED_REPLIES.improveReadiness;
  }

  if (
    normalizedMessage.includes("documents are missing") ||
    normalizedMessage.includes("what documents are missing") ||
    normalizedMessage.includes("missing documents") ||
    normalizedMessage.includes("preparation items are missing") ||
    normalizedMessage.includes("what preparation items are missing") ||
    normalizedMessage.includes("missing preparation items") ||
    normalizedMessage.includes("missing items") ||
    normalizedMessage === "missing" ||
    normalizedMessage.includes(" preparation items missing") ||
    normalizedMessage.includes("missing")
  ) {
    return GUARANTEED_REPLIES.missingItems;
  }

  if (
    normalizedMessage.includes("which documents") ||
    normalizedMessage.includes("documents required") ||
    normalizedMessage.includes("which preparation items") ||
    normalizedMessage.includes("preparation items required") ||
    normalizedMessage.includes("which items are required") ||
    normalizedMessage.includes("required items") ||
    normalizedMessage.includes("preparation tips") ||
    normalizedMessage.includes("common mistakes")
  ) {
    return getDocumentsPrompt(context.recommendedService || context.activeService);
  }

  if (
    normalizedMessage.includes("explain the process") ||
    normalizedMessage.includes("explain process")
  ) {
    const insights = getContextualSuggestions(context);
    return [
      `Current page: ${insights.pageTitle}.`,
      insights.insightLine,
      `Next step: ${insights.nextStep}`,
    ].join("\n");
  }

  if (
    normalizedMessage.includes("which service should i choose") ||
    normalizedMessage.includes("do i need esta or u.s. visa") ||
    normalizedMessage.includes("do i need esta or us visa")
  ) {
    return compareEstaAndVisa();
  }

  return fallbackReply || DEFAULT_FALLBACK_REPLY;
}

export function getAssistantFallbackReply() {
  return DEFAULT_FALLBACK_REPLY;
}
