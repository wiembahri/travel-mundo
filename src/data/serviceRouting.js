import {
  FiBriefcase,
  FiCompass,
  FiFileText,
  FiGlobe,
} from "react-icons/fi";

export const DESTINATIONS = ["United States", "United Kingdom"];

export const REVIEW_PURPOSES = [
  "Tourism",
  "Business",
  "Study",
  "Family",
  "Transit",
  "Passport service",
];

export const PASSPORT_STATUS_OPTIONS = [
  "Valid",
  "Expired",
  "Need renewal",
  "Need new passport",
];

export const SERVICE_DETAILS = {
  "U.S. Passport": {
    Icon: FiFileText,
    url: "https://mypassportcenter.com/",
    time: "Preparation usually starts within a few guided steps. Timing depends on the selected passport service.",
    explanation:
      "Your request matches the U.S. Passport support path, which is the right starting point for U.S. passport preparation or renewal support.",
  },
  "U.S. Visa": {
    Icon: FiBriefcase,
    url: "https://usimmigrationassistance.com/apply/?gadid=773046734052",
    time: "Preparation time depends on profile, appointment availability, and the type of visa required.",
    explanation:
      "Your United States trip appears to require a visa path because of the purpose selected or the planned duration.",
  },
  ESTA: {
    Icon: FiGlobe,
    url: "https://usimmigrationassistance.com/apply/?gadid=773046734052",
    time: "Preparation is usually quick once passport and travel details are ready.",
    explanation:
      "Your United States trip matches the short-stay travel pattern commonly handled through ESTA support.",
  },
  "UK ETA": {
    Icon: FiCompass,
    url: "https://uketasupport.com/",
    time: "Preparation is usually quick once passport, profile, and travel information are ready.",
    explanation:
      "Your destination is the United Kingdom, so the recommended orientation path is UK ETA support.",
  },
};

export function isUsNationality(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return (
    normalized === "united states" ||
    normalized === "united states of america" ||
    normalized === "usa"
  );
}

export function getRecommendedService(profile = {}) {
  const duration = Number(profile.duration) || 0;
  const destination = String(profile.destination || "").trim();
  const purpose = String(profile.purpose || profile.typeVisa || "").trim();
  const passportStatus = String(profile.passportStatus || "").trim();
  const nationality = String(
    profile.nationality || profile.nationalite || "",
  ).trim();

  if (purpose === "Passport service") {
    return "U.S. Passport";
  }

  if (
    isUsNationality(nationality) &&
    ["Expired", "Need renewal", "Need new passport"].includes(passportStatus)
  ) {
    return "U.S. Passport";
  }

  if (destination === "United Kingdom") {
    return "UK ETA";
  }

  if (destination === "United States") {
    if (purpose === "Study" || purpose === "Family" || duration > 90) {
      return "U.S. Visa";
    }

    if (
      purpose === "Transit" ||
      (["Tourism", "Business"].includes(purpose) && duration <= 90)
    ) {
      return "ESTA";
    }

    return "U.S. Visa";
  }

  return "U.S. Visa";
}
