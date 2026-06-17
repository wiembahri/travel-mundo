import api from "./api";

export async function getDossierByRef(reference) {
  const { data } = await api.get(`/dossiers/${reference}`);
  return data;
}

export async function getAllDossiers(filters = {}) {
  const { data } = await api.get("/dossiers", { params: filters });
  return data;
}

export async function updateStatut(id, status) {
  const { data } = await api.patch(`/dossiers/${id}/statut`, { status });
  return data;
}

export const FAKE_DOSSIERS = {
  "TM-2024-001": {
    reference: "TM-2024-001",
    name: "Ahmed Ben Salah",
    service: "ESTA",
    status: "In Progress",
    createdAt: "10/01/2024",
    steps: [
      { label: "Travel Mundo reference created", done: true, date: "10/01/2024" },
      { label: "Support items reviewed", done: true, date: "12/01/2024" },
      { label: "Portal handoff prepared", done: true, date: "15/01/2024" },
      { label: "Awaiting preparation update", done: false, date: null },
      { label: "Next status update", done: false, date: null },
    ],
  },
  "TM-2024-002": {
    reference: "TM-2024-002",
    name: "Sonia Mejri",
    service: "Passport",
    status: "Completed",
    createdAt: "02/01/2024",
    steps: [
      { label: "Travel Mundo reference created", done: true, date: "02/01/2024" },
      { label: "Support items reviewed", done: true, date: "03/01/2024" },
      { label: "Portal handoff prepared", done: true, date: "05/01/2024" },
      { label: "Preparation update received", done: true, date: "07/01/2024" },
      { label: "Preparation path ready", done: true, date: "08/01/2024" },
    ],
  },
  "TM-2024-003": {
    reference: "TM-2024-003",
    name: "Karim Trabelsi",
    service: "Visa",
    status: "Pending",
    createdAt: "18/01/2024",
    steps: [
      { label: "Travel Mundo reference created", done: true, date: "18/01/2024" },
      { label: "Support items review", done: false, date: null },
      { label: "Portal handoff preparation", done: false, date: null },
      { label: "Preparation update", done: false, date: null },
      { label: "Next status update", done: false, date: null },
    ],
  },
  "TM-2024-004": {
    reference: "TM-2024-004",
    name: "Maya Laurent",
    service: "ETA",
    status: "Incomplete",
    createdAt: "22/01/2024",
    steps: [
      { label: "Travel Mundo reference created", done: true, date: "22/01/2024" },
      { label: "Information review", done: true, date: "23/01/2024" },
      { label: "Portal handoff preparation", done: false, date: null },
      { label: "Preparation update", done: false, date: null },
      { label: "Final update", done: false, date: null },
    ],
  },
  "TM-2024-005": {
    reference: "TM-2024-005",
    name: "Nour Haddad",
    service: "Visa",
    status: "Rejected",
    createdAt: "28/01/2024",
    steps: [
      { label: "Travel Mundo reference created", done: true, date: "28/01/2024" },
      { label: "Support items reviewed", done: true, date: "29/01/2024" },
      { label: "Missing information detected", done: true, date: "30/01/2024" },
      { label: "Client correction pending", done: false, date: null },
      { label: "Next status update", done: false, date: null },
    ],
  },
};
