# Travel Mundo — Guide d'installation et de démarrage

## Installation rapide

```bash
# 1. Créer le projet
npx create-react-app travel-mundo
cd travel-mundo

# 2. Installer toutes les dépendances
npm install react-router-dom axios react-icons react-toastify recharts jspdf html2canvas framer-motion

# 3. Lancer le projet
npm start
```

---

## Structure des fichiers — où coller quoi

```
src/
├── index.css           ← Styles globaux (couleurs bleues, boutons, utilitaires)
├── index.js            ← Point d'entrée React (ne pas modifier)
├── App.jsx             ← Routeur principal
│
├── context/
│   └── AuthContext.jsx ← Gestion session admin
│
├── services/
│   ├── api.js          ← Configuration Axios
│   ├── auth.js         ← Fonctions login/logout API
│   ├── dossiers.js     ← Données dossiers + appels API
│   └── scoring.js      ← Algorithme de scoring IA
│
├── components/
│   ├── Navbar.jsx           ← Barre de navigation (sticky)
│   ├── Footer.jsx           ← Pied de page
│   ├── Chatbot.jsx          ← Assistant flottant en bas à droite
│   ├── HeroSection.jsx      ← Section hero réutilisable
│   ├── ServiceCard.jsx      ← Carte service réutilisable
│   ├── StatusTracker.jsx    ← Timeline de suivi réutilisable
│   ├── ScoreGauge.jsx       ← Jauge circulaire de score
│   └── ProtectedRoute.jsx   ← Protection page Dashboard
│
└── pages/
    ├── Home.jsx         → /
    ├── About.jsx        → /a-propos
    ├── Services.jsx     → /services
    ├── Contact.jsx      → /contact
    ├── VisaMap.jsx      → /visa-map
    ├── VisaScoring.jsx  → /visa-scoring
    ├── TrackRequest.jsx → /suivi
    └── Dashboard.jsx    → /dashboard (protégé)
```

---

## Identifiants de démonstration

```
Email    : admin@travelmundo.tn
Password : admin123
```

Pour tester le suivi de dossier, utilisez :

- `TM-2024-001` → En cours de traitement
- `TM-2024-002` → Terminé
- `TM-2024-003` → En attente

---

## Erreurs fréquentes et solutions

### ❌ "Cannot find module 'react-icons/fi'"

```bash
npm install react-icons
```

### ❌ "Cannot find module 'recharts'"

```bash
npm install recharts
```

### ❌ "Cannot find module 'react-router-dom'"

```bash
npm install react-router-dom
```

### ❌ "Module not found: Can't resolve '../context/AuthContext'"

Vérifiez que le fichier est dans `src/context/AuthContext.jsx`
et que le chemin d'import est correct depuis le composant.

### ❌ Page blanche au lancement

Ouvrez la console du navigateur (F12) et regardez l'erreur exacte.
Souvent c'est un import manquant ou un chemin incorrect.

### ❌ "Expected to import a component..."

Dans App.jsx, vérifiez que tous les imports pointent vers
les bons chemins (./pages/Home, ./components/Navbar, etc.)

---

## Variables d'environnement (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Travel Mundo
```

⚠️ Toujours préfixer les variables par `REACT_APP_` pour
que React les reconnaisse. Redémarrez `npm start` après
avoir modifié le fichier .env.

---

## Connexion au backend (quand il sera prêt)

Dans `src/services/dossiers.js`, remplacez les données
FAKE_DOSSIERS par de vrais appels API :

```js
// Avant (simulation)
export const FAKE_DOSSIERS = { ... }

// Après (avec backend)
export async function getDossierByRef(reference) {
  const { data } = await api.get(`/dossiers/${reference}`);
  return data;
}
```

Dans `src/context/AuthContext.jsx`, remplacez la
simulation par un appel API réel :

```js
// Avant
if (email === 'admin@...' && password === 'admin123') { ... }

// Après
const { data } = await api.post('/auth/login', { email, password });
setUser(data.user);
localStorage.setItem('tm_user', JSON.stringify(data));
```

---

## Prochaines étapes (backend)

1. **Node.js + Express** ou **Django** pour l'API REST
2. **MongoDB** ou **PostgreSQL** pour la base de données
3. **Endpoints à créer :**
   - `POST /api/auth/login`
   - `GET  /api/dossiers/:reference`
   - `GET  /api/dossiers` (admin)
   - `PATCH /api/dossiers/:id/statut`
   - `POST /api/scoring`
   - `POST /api/contact`
4. **Gmail API** pour l'automatisation des emails agents
5. **node-cron** pour les rappels passeport (6 mois / 1 mois)
