import {
  getRecommendedService,
  isUsNationality,
} from "../data/serviceRouting";

const STRONG_INCOME_THRESHOLD = 3000;
const MINIMUM_INCOME_THRESHOLD = 1500;

const PASSPORT_BLOCKING_STATUSES = [
  "expired",
  "need renewal",
  "need new passport",
];

const SIGNAL_PATTERNS = {
  passport: [/passport/, /travel document/, /biographical page/, /passport details?/, /issuing country/, /expiry date/, /issue date/],
  payment: [/payment/, /card/, /fees?/, /fee payment/],
  contact: [/contact/, /address/, /mailing/, /personal details?/, /email/, /emergency contact/, /full name/, /date of birth/],
  accommodation: [/accommodation/, /hotel/, /host/, /lodging/],
  travel: [/travel info/, /travel details?/, /ticket/, /insurance/, /itinerary/, /intended dates?/, /travel route/, /point of contact/],
  purpose: [/travel purpose/, /purpose of travel/, /business documents?/, /trip is 90 days or less/, /short-term/, /tourism/, /transit/, /business/],
  financial: [/bank/, /financial/, /fund/, /sponsor/, /fee payment/, /financial capacity/],
  employment: [/employment/, /contract/, /work certificate/, /employment information/, /business registration/, /proof of employment/, /studies/],
  history: [/travel history/, /previous travel/, /travel records?/],
  study: [/study/, /enrollment/, /school/, /student/, /university/, /ds-160/, /social media identifiers/],
  invitation: [/invitation/, /host document/, /business documents?/, /school documents?/, /u\.s\. contact/],
  identity: [/proof of identity/, /\bidentity\b/],
  citizenship: [/citizenship/],
  photo: [/photo/],
  renewal: [/previous passport/, /renewal/, /replacement/, /ds-11/, /ds-82/, /form/],
};

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function uniqueItems(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getDocumentSignals(selectedDocuments, passportStatus) {
  const normalizedDocs = (selectedDocuments || []).map((item) =>
    normalizeText(item),
  );
  const hasDoc = (patterns) =>
    normalizedDocs.some((document) =>
      patterns.some((pattern) => pattern.test(document)),
    );

  const passportText = normalizeText(passportStatus);

  return {
    passport: passportText === "valid" || hasDoc(SIGNAL_PATTERNS.passport),
    payment: hasDoc(SIGNAL_PATTERNS.payment),
    contact: hasDoc(SIGNAL_PATTERNS.contact),
    accommodation: hasDoc(SIGNAL_PATTERNS.accommodation),
    travel: hasDoc(SIGNAL_PATTERNS.travel),
    purpose: hasDoc(SIGNAL_PATTERNS.purpose),
    financial: hasDoc(SIGNAL_PATTERNS.financial),
    employment: hasDoc(SIGNAL_PATTERNS.employment),
    history: hasDoc(SIGNAL_PATTERNS.history),
    study: hasDoc(SIGNAL_PATTERNS.study),
    invitation: hasDoc(SIGNAL_PATTERNS.invitation),
    identity: hasDoc(SIGNAL_PATTERNS.identity),
    citizenship: hasDoc(SIGNAL_PATTERNS.citizenship),
    photo: hasDoc(SIGNAL_PATTERNS.photo),
    renewal: hasDoc(SIGNAL_PATTERNS.renewal),
  };
}

function getRequirements(service, purpose) {
  const normalizedPurpose = normalizeText(purpose);

  if (service === "ESTA") {
    return [
      {
        key: "passport",
        label: "Passport validated",
        issue: "Valid passport details are still missing.",
        recommendation:
          "Confirm your travel passport details before moving forward with ESTA.",
      },
      {
        key: "payment",
        label: "Payment readiness",
        issue: "A payment method for the ESTA file is not ready yet.",
        recommendation: "Prepare a valid payment card before continuing on the dedicated portal.",
      },
      {
        key: "contact",
        label: "Traveler identity profile",
        issue: "Personal or contact details are incomplete.",
        recommendation:
          "Complete your personal and contact details to avoid delays.",
      },
      {
        key: "accommodation",
        label: "U.S. accommodation proof",
        issue: "Missing accommodation proof or U.S. contact information.",
        recommendation:
          "Add U.S. accommodation or host details to strengthen the file.",
      },
    ];
  }

  if (service === "UK ETA") {
    return [
      {
        key: "passport",
        label: "Passport validated",
        issue: "Valid passport details are still missing.",
        recommendation:
          "Use the passport you plan to travel with for the UK ETA route.",
      },
      {
        key: "payment",
        label: "Payment readiness",
        issue: "A payment method for the UK ETA file is not ready yet.",
        recommendation:
          "Prepare the payment method early so the ETA file can be completed smoothly.",
      },
      {
        key: "contact",
        label: "Profile details",
        issue: "Personal or contact details are incomplete.",
        recommendation:
          "Complete your profile and contact information before continuing on the dedicated portal.",
      },
      {
        key: "travel",
        label: "UK route details",
        issue: "UK travel details are still missing.",
        recommendation:
          "Add itinerary or travel details to make the ETA file cleaner.",
      },
    ];
  }

  if (service === "U.S. Passport") {
    return [
      {
        key: "identity",
        label: "Identity evidence",
        issue: "Proof of identity is still missing.",
        recommendation:
          "Prepare your proof of identity before starting the passport step.",
      },
      {
        key: "citizenship",
        label: "Citizenship evidence",
        issue: "Proof of citizenship is not ready yet.",
        recommendation:
          "Gather citizenship evidence if it applies to your passport request.",
      },
      {
        key: "photo",
        label: "Passport photo",
        issue: "Passport photo requirements are not covered yet.",
        recommendation:
          "Prepare a compliant passport photo to avoid delays.",
      },
      {
        key: "renewal",
        label: "Renewal support",
        issue: "Previous passport or renewal support is missing.",
        recommendation:
          "If this is a renewal or replacement, prepare the previous passport details.",
      },
    ];
  }

  const requirements = [
    {
      key: "passport",
      label: "Passport validated",
      issue: "Valid passport support is still missing.",
      recommendation:
        "Confirm passport validity before moving further into the visa file.",
    },
    {
      key: "financial",
      label: "Financial support",
      issue: "Financial support evidence is still missing.",
      recommendation:
        "Add bank statements or other financial evidence to strengthen the case.",
    },
    {
      key: "travel",
      label: "Travel route evidence",
      issue: "Travel itinerary details are incomplete.",
      recommendation:
        "Add ticket, itinerary, insurance, or travel planning details.",
    },
    {
      key: "history",
      label: "Travel history evidence",
      issue: "Previous travel history is not documented yet.",
      recommendation:
        "Include previous travel records if they are available.",
    },
  ];

  if (normalizedPurpose === "study") {
    requirements.push({
      key: "study",
      label: "Study support",
      issue: "Study-related support evidence is still missing.",
      recommendation: "Add school, enrollment, or academic support evidence.",
    });
  }

  if (["business", "family"].includes(normalizedPurpose)) {
    requirements.push({
      key: "invitation",
      label: "Invitation or host support",
      issue: "Invitation or host support is still missing.",
      recommendation:
        "Prepare an invitation or host document that matches your purpose.",
    });
  } else {
    requirements.push({
      key: "employment",
      label: "Employment support",
      issue: "Employment or activity support is still missing.",
      recommendation:
        "Add employment, business, or professional support evidence.",
    });
  }

  return requirements;
}

function getCountryAdvice(destination, service, purpose, duration) {
  const normalizedDestination = normalizeText(destination);
  const normalizedPurpose = normalizeText(purpose);
  const advice = [];

  if (service === "U.S. Passport") {
    advice.push(
      "Resolve the passport step first. Travel Mundo only proceeds to ESTA, U.S. Visa, or UK ETA once passport readiness is clear.",
    );
  }

  if (normalizedDestination === "united states") {
    if (service === "ESTA") {
      advice.push(
        "For U.S. tourism, business, or transit stays of 90 days or less, ESTA is the strongest Travel Mundo route.",
      );
    }

    if (service === "U.S. Visa") {
      advice.push(
        "For U.S. study plans or stays above 90 days, the U.S. Visa route is the correct Travel Mundo path.",
      );
    }

    if (normalizedPurpose === "transit") {
      advice.push(
        "Keep airline and transit details aligned with your declared transit purpose.",
      );
    }

    advice.push(
      "Keep passport data, purpose, and duration consistent across every U.S. travel document.",
    );
  }

  if (normalizedDestination === "united kingdom") {
    advice.push(
      "Travel Mundo routes United Kingdom trips through UK ETA support, so passport and travel details should be consistent from the start.",
    );

    if (duration && duration > 180) {
      advice.push(
        "A long UK stay deserves extra review because the UK ETA flow is strongest for short travel preparation.",
      );
    }
  }

  if (!advice.length) {
    advice.push(
      "Keep your destination, purpose, and supporting evidence aligned before the final portal step.",
    );
  }

  return uniqueItems(advice);
}

function getProfileCompleteness(profile) {
  const fields = [
    profile.nationality,
    profile.destination,
    profile.purpose,
    profile.duration,
    profile.passportStatus,
  ];

  const filled = fields.filter(Boolean).length;
  return fields.length ? filled / fields.length : 0;
}

function getReadinessStatus(score) {
  if (score >= 90) return "Ready for handoff";
  if (score >= 75) return "Nearly ready";
  if (score >= 55) return "In progress";
  return "Needs work";
}

function getRiskLevel(preparationPercentage, criticalRisk, riskScore) {
  if (criticalRisk || preparationPercentage < 50 || riskScore >= 67) {
    return "High";
  }

  if (preparationPercentage < 78 || riskScore >= 34) {
    return "Moderate";
  }

  return "Low";
}

function getProbabilityLevel(probabilityScore) {
  if (probabilityScore >= 78) return "Strong";
  if (probabilityScore >= 52) return "Medium";
  return "Weak";
}

function buildTimelineItem(status, title, detail) {
  return { status, title, detail };
}

export function analyzeTravelProfile(profile = {}) {
  const normalizedProfile = {
    nationality: profile.nationality || profile.nationalite || "",
    destination: profile.destination || "",
    purpose: profile.purpose || profile.typeVisa || "",
    duration: toNumber(profile.duration) || 0,
    passportStatus: profile.passportStatus || "",
    selectedDocuments: Array.isArray(profile.selectedDocuments)
      ? profile.selectedDocuments
      : Array.isArray(profile.docs)
        ? profile.docs
        : [],
    income: toNumber(profile.income ?? profile.revenu),
    employmentStatus: profile.employmentStatus || profile.emploi || "",
    travelHistory: toNumber(profile.travelHistory ?? profile.voyages),
    baseScore: toNumber(profile.baseScore),
    checklistProgress: toNumber(profile.checklistProgress),
    checklistCompletedCount: toNumber(profile.checklistCompletedCount) || 0,
    checklistTotalItems: toNumber(profile.checklistTotalItems) || 0,
  };

  const strengths = [];
  const profileStrength = [];
  const detectedIssues = [];
  const profileWeakness = [];
  const recommendations = [];
  const timeline = [];

  const recommendedService =
    profile.recommendedService || getRecommendedService(normalizedProfile);
  const isUsPassportFlow =
    recommendedService === "U.S. Passport" ||
    normalizeText(normalizedProfile.purpose) === "passport service" ||
    isUsNationality(normalizedProfile.nationality);
  const passportStatus = normalizeText(normalizedProfile.passportStatus);
  const hasBlockingPassportIssue =
    PASSPORT_BLOCKING_STATUSES.includes(passportStatus);
  const passportExpiresSoon =
    passportStatus.includes("expiring soon") ||
    passportStatus.includes("expires soon");
  const documentSignals = getDocumentSignals(
    normalizedProfile.selectedDocuments,
    normalizedProfile.passportStatus,
  );
  const requirements = getRequirements(
    recommendedService,
    normalizedProfile.purpose,
  );
  const missingRequirements = requirements.filter(
    (requirement) => !documentSignals[requirement.key],
  );
  const coveredRequirements = requirements.filter(
    (requirement) => documentSignals[requirement.key],
  );
  const missingDocuments = missingRequirements.map((item) => item.label);
  const profileCompleteness = getProfileCompleteness(normalizedProfile);
  const hasChecklist =
    normalizedProfile.checklistTotalItems > 0 &&
    normalizedProfile.checklistProgress !== null;
  const checklistFactor = hasChecklist
    ? clamp(normalizedProfile.checklistProgress / 100, 0, 1)
    : clamp(normalizedProfile.selectedDocuments.length / 6, 0, 1);
  const documentCoverage = requirements.length
    ? coveredRequirements.length / requirements.length
    : checklistFactor;

  const purpose = normalizeText(normalizedProfile.purpose);
  const destination = normalizeText(normalizedProfile.destination);
  const employmentStatus = normalizeText(normalizedProfile.employmentStatus);

  let criticalRisk = false;
  let riskScore = 8;
  let confidenceScore = 38;
  let probabilityScore = 34;
  let travelConsistency = 62;

  if (recommendedService) {
    confidenceScore += 10;
    probabilityScore += 10;
    timeline.push(
      buildTimelineItem(
        "positive",
        `${recommendedService} route detected`,
        `Smart guidance matched the current profile to the ${recommendedService} travel path.`,
      ),
    );
  }

  if (documentSignals.passport && !hasBlockingPassportIssue) {
    strengths.push("Passport readiness looks aligned with the selected route.");
    profileStrength.push("Passport validity is aligned with the selected path.");
    confidenceScore += 10;
    probabilityScore += 8;
    timeline.push(
      buildTimelineItem(
        "positive",
        "Passport validated",
        "A usable passport signal is present in the file.",
      ),
    );
  } else if (hasBlockingPassportIssue) {
    criticalRisk = true;
    riskScore += 42;
    confidenceScore -= 18;
    probabilityScore -= 20;
    travelConsistency -= 20;
    detectedIssues.push(
      "Your passport is expired or needs renewal, so you should renew it before continuing.",
    );
    profileWeakness.push(
      "Passport validity is a blocking issue for the current travel preparation.",
    );
    recommendations.push(
      isUsPassportFlow
        ? "Renew your passport before continuing. U.S. Passport support may be the correct next step for your case."
        : "Renew your passport with the appropriate passport authority before continuing your travel preparation.",
    );
    timeline.push(
      buildTimelineItem(
        "warning",
        "Passport issue detected",
        "The current passport status needs renewal or replacement before the preparation can progress.",
      ),
    );
  } else if (passportExpiresSoon) {
    riskScore += 18;
    confidenceScore -= 8;
    probabilityScore -= 7;
    detectedIssues.push(
      "Passport validity may become too short for a smooth travel file.",
    );
    profileWeakness.push(
      "Passport validity looks fragile for the selected route.",
    );
    recommendations.push(
      "Consider renewing the passport early to avoid validity issues later.",
    );
    timeline.push(
      buildTimelineItem(
        "warning",
        "Passport validity window is tight",
      "The passport may expire too soon for a confident service path.",
      ),
    );
  } else {
    riskScore += 12;
    confidenceScore -= 8;
    detectedIssues.push("Passport validity is not confirmed yet.");
    recommendations.push(
      "Confirm a valid passport before completing the next preparation step.",
    );
    timeline.push(
      buildTimelineItem(
        "warning",
        "Passport signal missing",
        "No clear valid passport signal is currently present in the file.",
      ),
    );
  }

  missingRequirements.forEach((requirement) => {
    detectedIssues.push(requirement.issue);
    recommendations.push(requirement.recommendation);
    profileWeakness.push(requirement.issue);
    riskScore += recommendedService === "U.S. Visa" ? 8 : 6;
    confidenceScore -= 4;
    probabilityScore -= 4;
  });

  if (coveredRequirements.length) {
    confidenceScore += coveredRequirements.length * 3;
    probabilityScore += coveredRequirements.length * 2.5;
    profileStrength.push(
      `${coveredRequirements.length} critical requirement${
        coveredRequirements.length > 1 ? "s are" : " is"
      } already covered.`,
    );
  }

  if (coveredRequirements.length >= Math.max(2, requirements.length - 1)) {
    strengths.push("Most expected document categories are already covered.");
  } else if (coveredRequirements.length > 0) {
    strengths.push("Some key supporting elements are already in place.");
  }

  if (normalizedProfile.selectedDocuments.length === 0) {
    confidenceScore -= 8;
    probabilityScore -= 6;
    recommendations.push(
      recommendedService === "U.S. Passport"
        ? "Begin checking off passport support items so the file can progress."
        : "Add supporting items to move the preparation meter upward.",
    );
    timeline.push(
      buildTimelineItem(
        "warning",
        "No support items selected",
        "The readiness review has very little evidence to validate the route.",
      ),
    );
  } else {
    timeline.push(
      buildTimelineItem(
        "positive",
        `${normalizedProfile.selectedDocuments.length} support item${
          normalizedProfile.selectedDocuments.length > 1 ? "s" : ""
        } detected`,
        "The file is gaining evidence from selected support items and checklist items.",
      ),
    );
  }

  if (
    destination === "united states" &&
    ["tourism", "business", "transit"].includes(purpose) &&
    normalizedProfile.duration > 90
  ) {
    criticalRisk = true;
    riskScore += 24;
    confidenceScore -= 14;
    probabilityScore -= 14;
    travelConsistency -= 26;
    detectedIssues.push(
      "A U.S. short-stay purpose with a duration above 90 days creates a route mismatch.",
    );
    profileWeakness.push(
      "Declared purpose and duration are inconsistent for a short-stay U.S. route.",
    );
    recommendations.push(
      "Switch to the U.S. Visa route for a stay that exceeds 90 days.",
    );
    timeline.push(
      buildTimelineItem(
        "warning",
        "Route inconsistency detected",
        "The duration does not match a short-stay U.S. purpose.",
      ),
    );
  } else if (
    destination === "united states" &&
    recommendedService === "ESTA" &&
    ["tourism", "business", "transit"].includes(purpose) &&
    normalizedProfile.duration > 0 &&
    normalizedProfile.duration <= 90
  ) {
    confidenceScore += 9;
    probabilityScore += 10;
    travelConsistency += 12;
    timeline.push(
      buildTimelineItem(
        "positive",
        "ESTA eligibility detected",
        "Short-term U.S. travel purpose and duration are aligned.",
      ),
    );
  }

  if (recommendedService === "UK ETA") {
    confidenceScore += 8;
    probabilityScore += 8;
    travelConsistency += 8;
    strengths.push("Your destination aligns with the UK ETA path supported by Travel Mundo.");
    timeline.push(
      buildTimelineItem(
        "positive",
        "UK ETA route confirmed",
        "Destination and route selection are aligned with the UK ETA flow.",
      ),
    );
  }

  if (recommendedService === "U.S. Visa" && purpose === "study") {
    riskScore += 10;
    confidenceScore -= 3;
    recommendations.push(
      "Study profiles need stronger academic and financial support than short-stay routes.",
    );
    timeline.push(
      buildTimelineItem(
        "warning",
        "Study route requires deeper support",
        "The current route needs more documentation than a short-stay case.",
      ),
    );
  }

  if (normalizedProfile.income !== null) {
    if (normalizedProfile.income >= STRONG_INCOME_THRESHOLD) {
      confidenceScore += 12;
      probabilityScore += 12;
      travelConsistency += 4;
      strengths.push(
        "Income level looks supportive for a stronger preparation file.",
      );
      profileStrength.push(
        "Income strength supports the financial credibility of the file.",
      );
    } else if (normalizedProfile.income >= MINIMUM_INCOME_THRESHOLD) {
      confidenceScore += 4;
      probabilityScore += 3;
      recommendations.push(
        "Recent bank statements can help reinforce the financial side of the file.",
      );
    } else {
      riskScore += 16;
      confidenceScore -= 9;
      probabilityScore -= 10;
      detectedIssues.push("Income appears low for a confident preparation profile.");
      profileWeakness.push(
        "Income level may not be strong enough without extra financial support.",
      );
      recommendations.push(
        "Add stronger financial proof or sponsorship evidence to offset low income.",
      );
      timeline.push(
        buildTimelineItem(
          "warning",
          "Financial strength is limited",
          "Low income reduces the overall preparation strength unless more support is added.",
        ),
      );
    }
  }

  if (employmentStatus === "permanent") {
    confidenceScore += 9;
    probabilityScore += 8;
    strengths.push(
      "Stable employment adds credibility to the overall preparation profile.",
    );
    profileStrength.push("Stable employment supports return-ties credibility.");
  } else if (employmentStatus === "self-employed") {
    confidenceScore += 4;
    recommendations.push(
      "Add business registration and strong financial records for a self-employed profile.",
    );
  } else if (["temporary", "student", "retired"].includes(employmentStatus)) {
    confidenceScore += 1;
    recommendations.push(
      "Add status-specific supporting evidence to strengthen overall profile stability.",
    );
  } else if (employmentStatus === "unemployed") {
    riskScore += 15;
    confidenceScore -= 8;
    probabilityScore -= 8;
    detectedIssues.push(
      "Current employment status may require stronger supporting evidence.",
    );
    profileWeakness.push(
      "Employment profile is currently weak and needs stronger backup evidence.",
    );
    recommendations.push(
      "Prepare extra ties and financial support evidence before moving forward.",
    );
  }

  if (normalizedProfile.travelHistory !== null) {
    if (normalizedProfile.travelHistory >= 4) {
      confidenceScore += 8;
      probabilityScore += 10;
      strengths.push(
        "Strong travel history helps reinforce the credibility of the file.",
      );
      profileStrength.push("Travel history supports the overall credibility of the route.");
      timeline.push(
        buildTimelineItem(
          "positive",
          "Travel history validated",
          "Previous travel adds positive credibility to the current file.",
        ),
      );
    } else if (normalizedProfile.travelHistory >= 1) {
      confidenceScore += 3;
      probabilityScore += 3;
      recommendations.push(
        "Reference previous travel clearly to make the case stronger.",
      );
    } else {
      riskScore += 12;
      confidenceScore -= 7;
      probabilityScore -= 12;
      detectedIssues.push(
        "Travel history is limited, which can weaken the overall preparation strength.",
      );
      profileWeakness.push(
        "Travel history is weak and may require stronger ties or document support.",
      );
      recommendations.push(
        "Use employment, finances, and itinerary consistency to compensate for limited travel history.",
      );
      timeline.push(
        buildTimelineItem(
          "warning",
          "Travel history weak",
          "Limited prior travel lowers the overall preparation strength of the profile.",
        ),
      );
    }
  }

  if (hasChecklist) {
    confidenceScore += checklistFactor * 18;
    probabilityScore += checklistFactor * 10;

    if (checklistFactor >= 0.96) {
      travelConsistency += 10;
      timeline.push(
        buildTimelineItem(
          "positive",
          "Checklist fully completed",
          "The checklist is complete and reinforces the readiness profile.",
        ),
      );
    } else if (checklistFactor >= 0.75) {
      timeline.push(
        buildTimelineItem(
          "positive",
          "Checklist almost complete",
          "The file has strong operational readiness from the checklist.",
        ),
      );
    } else {
      timeline.push(
        buildTimelineItem(
          "neutral",
          "Checklist is still in progress",
          "Operational readiness is improving but still incomplete.",
        ),
      );
    }
  }

  if (documentCoverage >= 0.85) {
    travelConsistency += 8;
  } else if (documentCoverage <= 0.35) {
    travelConsistency -= 8;
  }

  if (normalizedProfile.baseScore !== null) {
    confidenceScore = confidenceScore * 0.74 + normalizedProfile.baseScore * 0.26;
    probabilityScore = probabilityScore * 0.72 + normalizedProfile.baseScore * 0.28;
  }

  confidenceScore = clamp(Math.round(confidenceScore), 18, 99);
  probabilityScore = clamp(Math.round(probabilityScore), 14, 99);
  riskScore = clamp(Math.round(riskScore), 6, 98);
  travelConsistency = clamp(Math.round(travelConsistency), 18, 98);

  let preparationPercentage =
    8 +
    profileCompleteness * 18 +
    documentCoverage * 28 +
    checklistFactor * 24 +
    (confidenceScore * 0.16) +
    ((100 - riskScore) * 0.08) +
    (travelConsistency * 0.12);

  if (normalizedProfile.selectedDocuments.length === 0) {
    preparationPercentage = Math.min(preparationPercentage, 35);
  }

  if (
    normalizedProfile.selectedDocuments.length > 0 &&
    documentCoverage >= 0.4 &&
    checklistFactor >= 0.25
  ) {
    preparationPercentage = Math.max(preparationPercentage, 60);
  }

  if (checklistFactor >= 0.8 && documentCoverage >= 0.75 && !criticalRisk) {
    preparationPercentage = Math.max(preparationPercentage, 85);
  }

  if (
    checklistFactor >= 0.98 &&
    documentCoverage === 1 &&
    !criticalRisk &&
    confidenceScore >= 80
  ) {
    preparationPercentage = Math.max(preparationPercentage, 96);
  }

  preparationPercentage = clamp(Math.round(preparationPercentage), 18, 100);

  const riskLevel = getRiskLevel(
    preparationPercentage,
    criticalRisk,
    riskScore,
  );
  const probabilityLevel = getProbabilityLevel(probabilityScore);
  const readinessStatus = getReadinessStatus(preparationPercentage);

  const countryAdvice = getCountryAdvice(
    normalizedProfile.destination,
    recommendedService,
    normalizedProfile.purpose,
    normalizedProfile.duration,
  );

  const recommendationChips = uniqueItems([
    `Recommended path: ${recommendedService}`,
    `Readiness: ${readinessStatus}`,
    riskLevel === "High" ? "Critical issues detected" : "Route is actively improving",
    probabilityLevel === "Strong"
      ? "Smart guidance detected a strong route fit"
      : "Smart guidance sees room to strengthen the case",
  ]);

  const nextBestAction = hasBlockingPassportIssue
    ? isUsPassportFlow
      ? "Renew your passport before continuing. U.S. Passport support may be the correct next step for your case."
      : "Renew your passport with the relevant passport authority before continuing."
    : missingRequirements[0]
      ? missingRequirements[0].recommendation
      : recommendedService === "ESTA"
        ? "Move forward with ESTA preparation and keep every travel detail consistent."
        : recommendedService === "UK ETA"
          ? "Continue with the UK ETA flow and verify passport plus itinerary details."
          : "Continue with your U.S. Visa preparation and consolidate your supporting evidence.";

  timeline.push(
    buildTimelineItem(
      riskLevel === "Low" ? "positive" : riskLevel === "Moderate" ? "neutral" : "warning",
      "Readiness model recalculated",
      `The file is currently marked as ${readinessStatus.toLowerCase()} for the next preparation step.`,
    ),
  );

  return {
    recommendedService,
    readinessStatus,
    preparationPercentage,
    aiConfidence: confidenceScore,
    riskScore,
    visaProbability: probabilityScore,
    travelConsistency,
    riskLevel,
    probabilityLevel,
    missingDocuments,
    missingRequirements,
    detectedIssues: uniqueItems(detectedIssues),
    recommendations: uniqueItems(recommendations),
    strengths: uniqueItems(strengths),
    profileStrength: uniqueItems(profileStrength.length ? profileStrength : strengths),
    profileWeakness: uniqueItems(profileWeakness.length ? profileWeakness : detectedIssues),
    countryAdvice,
    recommendationChips,
    timeline,
    nextBestAction,
  };
}
