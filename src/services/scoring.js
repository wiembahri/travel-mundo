// Calcul du score Visa Readiness côté frontend
// Quand votre backend IA sera prêt, remplacez par un appel API

export function calculerScoreVisa(form) {
  let score = 0;
  const recommandations = [];
  const pointsForts = [];

  // ── 1. Revenu mensuel (25 pts) ─────────────────
  const rev = parseInt(form.revenu) || 0;
  if (rev >= 3000) {
    score += 25;
    pointsForts.push(
      "Revenu mensuel solide — rassure les ambassades sur votre capacité financière.",
    );
  } else if (rev >= 1500) {
    score += 15;
    recommandations.push(
      "Revenu en dessous du seuil recommandé. Joignez 6 mois de relevés bancaires et une lettre de votre employeur.",
    );
  } else {
    score += 5;
    recommandations.push(
      "Revenu insuffisant pour la destination choisie. Envisagez un co-demandeur ou un garant financier.",
    );
  }

  // ── 2. Historique de voyages (20 pts) ──────────
  const voyages = parseInt(form.voyages) || 0;
  if (voyages >= 5) {
    score += 20;
    pointsForts.push(
      "Excellent historique de voyages — preuve de vos habitudes de retour dans votre pays.",
    );
  } else if (voyages >= 2) {
    score += 12;
    recommandations.push(
      "Historique de voyages limité. Mentionnez tous vos voyages précédents, même les pays sans visa.",
    );
  } else {
    score += 4;
    recommandations.push(
      "Aucun historique de voyages détecté. Compensez avec des preuves solides de liens dans votre pays (emploi, famille, propriété).",
    );
  }

  // ── 3. Situation professionnelle (20 pts) ──────
  if (form.emploi === "CDI") {
    score += 20;
    pointsForts.push(
      "Contrat CDI — situation professionnelle stable, très appréciée des ambassades.",
    );
  } else if (form.emploi === "Indépendant") {
    score += 14;
    recommandations.push(
      "En tant qu'indépendant, joignez 3 ans de bilans comptables et votre extrait de registre de commerce.",
    );
  } else if (form.emploi === "CDD") {
    score += 10;
    recommandations.push(
      "CDD : précisez la durée du contrat et joignez une lettre de votre employeur confirmant votre retour.",
    );
  } else if (form.emploi === "Étudiant") {
    score += 8;
    recommandations.push(
      "Étudiant : joignez une attestation d'inscription, une lettre de la famille sponsor et relevés de compte.",
    );
  } else {
    score += 3;
    recommandations.push(
      "Situation sans emploi : les liens familiaux solides et preuves de propriété sont essentiels pour votre dossier.",
    );
  }

  // ── 4. Documents disponibles (20 pts) ──────────
  const nbDocs = (form.docs || []).length;
  if (nbDocs >= 5) {
    score += 20;
    pointsForts.push(
      "Dossier documentaire complet — tous les justificatifs requis sont présents.",
    );
  } else if (nbDocs >= 3) {
    score += 12;
    recommandations.push(
      `Il vous manque ${8 - nbDocs} document(s) recommandés. Complétez avant de soumettre votre demande.`,
    );
  } else {
    score += 4;
    recommandations.push(
      "Dossier incomplet. Le manque de documents est la première cause de rejet. Complétez impérativement.",
    );
  }

  // ── 5. Nationalité / profil de risque (15 pts) ─
  const nationaliteScore = {
    France: 15,
    Belgique: 15,
    Canada: 14,
    Maroc: 11,
    Tunisie: 10,
    Algérie: 9,
    Sénégal: 7,
    "Côte d'Ivoire": 7,
  };
  score += nationaliteScore[form.nationalite] || 8;

  // ── Résultat final ──────────────────────────────
  const scoreTotal = Math.min(Math.round(score), 100);

  let niveau, couleur, conseil;
  if (scoreTotal >= 75) {
    niveau = "Excellent";
    couleur = "#16A34A";
    conseil = "Votre dossier est solide. Soumettez votre demande sans tarder.";
  } else if (scoreTotal >= 55) {
    niveau = "Bon";
    couleur = "#2563EB";
    conseil = "Bon dossier avec quelques points à renforcer avant soumission.";
  } else if (scoreTotal >= 35) {
    niveau = "Moyen";
    couleur = "#D97706";
    conseil =
      "Dossier fragile. Renforcez les points faibles avant de soumettre.";
  } else {
    niveau = "Faible";
    couleur = "#DC2626";
    conseil =
      "Risque élevé de rejet. Consultez un agent Travel Mundo avant de soumettre.";
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
