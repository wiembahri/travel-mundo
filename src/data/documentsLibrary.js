export const DOCUMENTS_LIBRARY = [
  {
    service: "U.S. Passport",
    shortName: "Passport",
    icon: "passport",
    destination: "United States",
    url: "https://mypassportcenter.com/",
    description:
      "Prepare for a passport service or renewal by checking identity evidence, passport photo requirements, and the correct service type.",
    preparationSteps: [
      "Identify the service type: first passport, renewal, replacement, or correction.",
      "Check the validity and consistency of identity evidence.",
      "Prepare a compliant passport photo and supporting evidence.",
      "Keep the Travel Mundo reference number to track progress.",
    ],
    documents: [
      { label: "Proof of U.S. citizenship when applicable", badge: "Required" },
      { label: "Government-issued photo ID", badge: "Required" },
      { label: "Previous passport for renewal paths", badge: "Required" },
      { label: "Compliant passport photo", badge: "Required" },
      { label: "Name change document when relevant", badge: "Recommended" },
    ],
    information: [
      { label: "Legal name, date of birth, and contact details", badge: "Required" },
      { label: "Passport service type: new, renewal, replacement, or correction", badge: "Required" },
      { label: "Current mailing address", badge: "Required" },
      { label: "Emergency contact information", badge: "Recommended" },
    ],
    mistakes: [
      { label: "Using a photo that does not meet passport standards", badge: "Common mistake" },
      { label: "Submitting mismatched names across identity evidence", badge: "Common mistake" },
      { label: "Forgetting the previous passport during a renewal path", badge: "Common mistake" },
    ],
    tips: [
      { label: "Prepare photocopies before starting the preparation flow", badge: "Recommended" },
      { label: "Check expiration dates before booking travel", badge: "Recommended" },
      { label: "Keep a local copy of all submitted information", badge: "Recommended" },
    ],
  },
  {
    service: "U.S. Visa",
    shortName: "Visa",
    icon: "visa",
    destination: "United States",
    url: "https://usimmigrationassistance.com/apply/?gadid=773046734052",
    description:
      "Prepare for the selected visa service for travel, study, a longer stay, or a situation that does not match ESTA eligibility.",
    preparationSteps: [
      "Clarify the travel purpose and intended duration.",
      "Gather financial, employment, school, or invitation evidence when relevant.",
      "Check that dates, names, and passport information are consistent.",
      "Track your Travel Mundo reference for preparation updates.",
    ],
    documents: [
      { label: "Valid passport", badge: "Required" },
      { label: "Recent visa-style photo", badge: "Required" },
      { label: "Financial support evidence", badge: "Recommended" },
      { label: "Employment, study, invitation, or business evidence", badge: "Recommended" },
      { label: "Travel and accommodation details", badge: "Recommended" },
    ],
    information: [
      { label: "Travel purpose and intended duration", badge: "Required" },
      { label: "Nationality and residence details", badge: "Required" },
      { label: "Employment or education status", badge: "Recommended" },
      { label: "Previous international travel history", badge: "Recommended" },
    ],
    mistakes: [
      { label: "Selecting a visa path that does not match the travel purpose", badge: "Common mistake" },
      { label: "Providing inconsistent dates across support items", badge: "Common mistake" },
      { label: "Uploading unclear or incomplete support evidence", badge: "Common mistake" },
    ],
    tips: [
      { label: "Prepare evidence that directly supports your stated purpose", badge: "Recommended" },
      { label: "Review all form answers before the final portal step", badge: "Recommended" },
      { label: "Keep financial and employment evidence recent", badge: "Recommended" },
    ],
  },
  {
    service: "ESTA",
    shortName: "ESTA",
    icon: "esta",
    destination: "United States",
    url: "https://usimmigrationassistance.com/apply/?gadid=773046734052",
    description:
      "Prepare an ESTA authorization for eligible short stays in the United States, including tourism, business, or transit.",
    preparationSteps: [
      "Confirm ESTA eligibility based on nationality and travel purpose.",
      "Verify the passport information that will be used for travel.",
      "Prepare contact details, travel information, and payment details.",
      "Save the confirmation and track the Travel Mundo reference.",
    ],
    documents: [
      { label: "Eligible valid passport", badge: "Required" },
      { label: "Passport biographical page details", badge: "Required" },
      { label: "Payment card for dedicated portal fees", badge: "Required" },
      { label: "U.S. accommodation or contact details if available", badge: "Recommended" },
    ],
    information: [
      { label: "Personal and contact information", badge: "Required" },
      { label: "Travel purpose", badge: "Required" },
      { label: "Employment information when applicable", badge: "Recommended" },
      { label: "Short-stay travel dates", badge: "Recommended" },
    ],
    mistakes: [
      { label: "Entering an incorrect passport number", badge: "Common mistake" },
      { label: "Using ESTA for a trip longer than 90 days", badge: "Common mistake" },
      { label: "Applying with a passport that will not be used for travel", badge: "Common mistake" },
    ],
    tips: [
      { label: "Confirm the trip is for tourism, business, or transit", badge: "Recommended" },
      { label: "Review passport dates carefully", badge: "Recommended" },
      { label: "Save the authorization confirmation with travel files", badge: "Recommended" },
    ],
  },
  {
    service: "UK ETA",
    shortName: "ETA",
    icon: "uk",
    destination: "United Kingdom",
    url: "https://uketasupport.com/",
    description:
      "Prepare for the selected ETA service with accurate passport and trip information.",
    preparationSteps: [
      "Confirm that the trip matches the UK ETA pathway.",
      "Use the same passport for the service path and for travel.",
      "Enter personal and contact information carefully.",
      "Keep the confirmation and check your Travel Mundo reference.",
    ],
    documents: [
      { label: "Valid passport", badge: "Required" },
      { label: "Clear passport details", badge: "Required" },
      { label: "Payment card for dedicated portal fees", badge: "Required" },
      { label: "UK travel details if available", badge: "Recommended" },
    ],
    information: [
      { label: "Personal and contact details", badge: "Required" },
      { label: "Travel purpose", badge: "Required" },
      { label: "Passport issuing country", badge: "Required" },
      { label: "Planned arrival information", badge: "Recommended" },
    ],
    mistakes: [
      { label: "Applying with a passport different from the travel passport", badge: "Common mistake" },
      { label: "Missing a typo in personal information", badge: "Common mistake" },
      { label: "Waiting until the last moment to prepare details", badge: "Common mistake" },
    ],
    tips: [
      { label: "Keep the passport used for ETA available for the full trip", badge: "Recommended" },
      { label: "Review all answers before the final portal step", badge: "Recommended" },
      { label: "Save the confirmation after portal handoff", badge: "Recommended" },
    ],
  },
];
