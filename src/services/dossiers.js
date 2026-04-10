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
    service: "Schengen Visa — France",
    status: "In Progress",
    createdAt: "10/01/2024",
    steps: [
      { label: "Application received", done: true, date: "10/01/2024" },
      { label: "Document review", done: true, date: "12/01/2024" },
      { label: "Submission prepared", done: true, date: "15/01/2024" },
      { label: "Awaiting processing", done: false, date: null },
      { label: "Final decision", done: false, date: null },
    ],
  },
  "TM-2024-002": {
    reference: "TM-2024-002",
    name: "Sonia Mejri",
    service: "Passport",
    status: "Completed",
    createdAt: "02/01/2024",
    steps: [
      { label: "Application received", done: true, date: "02/01/2024" },
      { label: "Document review", done: true, date: "03/01/2024" },
      { label: "Submission completed", done: true, date: "05/01/2024" },
      { label: "Official processing", done: true, date: "07/01/2024" },
      { label: "Application completed", done: true, date: "08/01/2024" },
    ],
  },
  "TM-2024-003": {
    reference: "TM-2024-003",
    name: "Karim Trabelsi",
    service: "U.S. Visa",
    status: "Pending",
    createdAt: "18/01/2024",
    steps: [
      { label: "Application received", done: true, date: "18/01/2024" },
      { label: "Document review", done: false, date: null },
      { label: "Submission preparation", done: false, date: null },
      { label: "Application processing", done: false, date: null },
      { label: "Final decision", done: false, date: null },
    ],
  },
};
