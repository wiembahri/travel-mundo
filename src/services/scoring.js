export function calculerScoreVisa(form) {
  let score = 0;
  const recommandations = [];
  const pointsForts = [];

  // 1. Monthly income (25 pts)
  const rev = parseInt(form.revenu) || 0;
  if (rev >= 3000) {
    score += 25;
    pointsForts.push(
      "Strong monthly income - this helps demonstrate financial capacity for the preparation file.",
    );
  } else if (rev >= 1500) {
    score += 15;
    recommandations.push(
      "Income is below the recommended level. Consider adding 6 months of bank statements and proof of employment.",
    );
  } else {
    score += 5;
    recommandations.push(
      "Income may be insufficient for the selected destination. Consider adding stronger financial support evidence.",
    );
  }

  // 2. Travel history (20 pts)
  const voyages = parseInt(form.voyages) || 0;
  if (voyages >= 5) {
    score += 20;
    pointsForts.push(
      "Strong travel history - previous trips can help support the credibility of your preparation file.",
    );
  } else if (voyages >= 2) {
    score += 12;
    recommandations.push(
      "Limited travel history. Include previous trips and supporting travel records where possible.",
    );
  } else {
    score += 4;
    recommandations.push(
      "No travel history detected. You may need stronger supporting evidence such as employment, family, or property ties.",
    );
  }

  // 3. Employment situation (20 pts)
  if (form.emploi === "Permanent") {
    score += 20;
    pointsForts.push(
      "Permanent employment — this shows a stable professional situation.",
    );
  } else if (form.emploi === "Self-employed") {
    score += 14;
    recommandations.push(
      "As a self-employed applicant, consider adding financial records and business registration evidence.",
    );
  } else if (form.emploi === "Temporary") {
    score += 10;
    recommandations.push(
      "Temporary employment may require additional proof of professional stability.",
    );
  } else if (form.emploi === "Student") {
    score += 8;
    recommandations.push(
      "As a student, you may need enrollment proof and financial support evidence.",
    );
  } else if (form.emploi === "Retired") {
    score += 8;
    recommandations.push(
      "As a retired traveler, pension proof and financial evidence may help support your preparation file.",
    );
  } else {
    score += 3;
    recommandations.push(
      "Your current profile may require stronger supporting evidence to improve the preparation file.",
    );
  }

  // 4. Available support items (20 pts)
  const nbDocs = (form.docs || []).length;
  if (nbDocs >= 5) {
    score += 20;
    pointsForts.push(
      "Strong support-item preparation - your file appears well supported.",
    );
  } else if (nbDocs >= 3) {
    score += 12;
    recommandations.push(
      `You may still be missing ${8 - nbDocs} recommended support item(s). Completing your file may strengthen your preparation.`,
    );
  } else {
    score += 4;
    recommandations.push(
      "Your file appears incomplete. Missing support items can significantly weaken readiness.",
    );
  }

  // 5. Nationality / profile factor (15 pts)
  const nationalityScore = {
    France: 15,
    Belgium: 15,
    Canada: 14,
    Morocco: 11,
    Tunisia: 10,
    Algeria: 9,
    Senegal: 7,
    "Côte d'Ivoire": 7,
  };

  score += nationalityScore[form.nationalite] || 8;

  const scoreTotal = Math.min(Math.round(score), 100);

  let niveau, couleur, conseil;
  if (scoreTotal >= 75) {
    niveau = "Excellent";
    couleur = "#16A34A";
    conseil =
      "Your preparation profile looks strong. You can move forward with confidence.";
  } else if (scoreTotal >= 55) {
    niveau = "Good";
    couleur = "#2563EB";
    conseil =
      "Your profile is solid, but a few improvements could strengthen the preparation further.";
  } else if (scoreTotal >= 35) {
    niveau = "Average";
    couleur = "#D97706";
    conseil =
      "Your file may need stronger supporting evidence before handoff.";
  } else {
    niveau = "Weak";
    couleur = "#DC2626";
    conseil =
      "Your profile may face a high risk of rejection. Consider improving your supporting evidence before moving forward.";
  }

  return {
    score: scoreTotal,
    niveau,
    couleur,
    conseil,
    pointsForts,
    recommandations,
  };
}
