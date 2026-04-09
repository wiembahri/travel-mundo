import api from "./api";

// Connexion via API backend (à activer quand le backend est prêt)
export async function loginAPI(email, password) {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("tm_user", JSON.stringify(data));
    return { success: true, user: data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Erreur de connexion",
    };
  }
}

// Déconnexion
export function logoutAPI() {
  localStorage.removeItem("tm_user");
}

// Récupère l'utilisateur connecté depuis le localStorage
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("tm_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Vérifie si le token est encore valide (à implémenter avec JWT)
export function isTokenValid() {
  const user = getCurrentUser();
  if (!user?.token) return false;
  // Décodage JWT basique pour vérifier expiration
  try {
    const payload = JSON.parse(atob(user.token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
