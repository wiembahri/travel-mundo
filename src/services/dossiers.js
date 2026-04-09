import api from "./api";

// Récupère un dossier par son numéro de référence
export async function getDossierByRef(reference) {
  const { data } = await api.get(`/dossiers/${reference}`);
  return data;
}

// Récupère tous les dossiers (admin)
export async function getAllDossiers(filters = {}) {
  const { data } = await api.get("/dossiers", { params: filters });
  return data;
}

// Met à jour le statut d'un dossier (admin)
export async function updateStatut(id, statut) {
  const { data } = await api.patch(`/dossiers/${id}/statut`, { statut });
  return data;
}

// ─── Données de simulation (à utiliser jusqu'à ce que le backend soit prêt) ───
export const FAKE_DOSSIERS = {
  "TM-2024-001": {
    reference: "TM-2024-001",
    nom: "Ahmed Ben Salah",
    service: "Visa Schengen — France",
    statut: "En cours de traitement",
    dateCreation: "10/01/2024",
    steps: [
      { label: "Demande reçue", done: true, date: "10/01/2024" },
      { label: "Vérification documents", done: true, date: "12/01/2024" },
      { label: "Soumission portail", done: true, date: "15/01/2024" },
      { label: "En attente ambassade", done: false, date: null },
      { label: "Décision finale", done: false, date: null },
    ],
  },
  "TM-2024-002": {
    reference: "TM-2024-002",
    nom: "Sonia Mejri",
    service: "Passeport biométrique",
    statut: "Terminé",
    dateCreation: "02/01/2024",
    steps: [
      { label: "Demande reçue", done: true, date: "02/01/2024" },
      { label: "Vérification documents", done: true, date: "03/01/2024" },
      { label: "Soumission", done: true, date: "05/01/2024" },
      { label: "Traitement officiel", done: true, date: "07/01/2024" },
      { label: "Passeport prêt", done: true, date: "08/01/2024" },
    ],
  },
  "TM-2024-003": {
    reference: "TM-2024-003",
    nom: "Karim Trabelsi",
    service: "Visa USA — B1/B2",
    statut: "En attente",
    dateCreation: "18/01/2024",
    steps: [
      { label: "Demande reçue", done: true, date: "18/01/2024" },
      { label: "Vérification documents", done: false, date: null },
      { label: "Soumission ambassade", done: false, date: null },
      { label: "Entretien visa", done: false, date: null },
      { label: "Décision finale", done: false, date: null },
    ],
  },
};
    