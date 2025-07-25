# TaskMaster Frontend 🚀

## Description
Interface utilisateur moderne en React TypeScript pour TaskMarket - Une plateforme complète de gestion de propriétés immobilières avec intégration bot Telegram.

## 🌟 Fonctionnalités

### 🏠 Gestion des Propriétés
- Interface moderne pour créer, modifier, supprimer des propriétés
- Upload multiple d'images avec prévisualisation
- Galerie d'images interactive
- Filtrage et recherche de propriétés
- Cartes de propriétés avec informations détaillées

### 👥 Gestion des Utilisateurs
- Interface d'inscription et de connexion
- Dashboard personnalisés par type d'utilisateur
- Profils utilisateurs complets
- Gestion des rôles (Propriétaire, Acheteur, Administrateur)

### 💰 Gestion des Transactions
- Interface pour créer et suivre les transactions
- Système d'offres et négociations
- Statuts de transaction en temps réel
- Historique des transactions

### 🤖 Intégration Telegram
- Liaison de compte Telegram via QR code
- Interface pour générer des codes de liaison
- Statut de connexion en temps réel

### 🎨 Interface Utilisateur
- Design moderne avec Tailwind CSS
- Animations fluides avec Framer Motion
- Effets visuels avancés (Border Beam, Meteors)
- Interface responsive pour tous les appareils
- Thème sombre/clair (si implémenté)

## 🛠️ Technologies Utilisées

- **Framework**: React 18.3.1
- **Langage**: TypeScript 4.9.5
- **Routing**: React Router DOM 6.30.1
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.9
- **Build Tool**: Create React App
- **Utilitaires**: clsx, tailwind-merge

## 📋 Prérequis

- Node.js 16.0 ou plus récent
- npm ou yarn
- Backend TaskMarket en cours d'exécution

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/raoulalobo/TaskMasterFrontend.git
cd TaskMasterFrontend
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configuration de l'environnement**
Créer un fichier `.env` à la racine du projet :
```bash
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_MEDIA_URL=http://localhost:8000/media
REACT_APP_TELEGRAM_BOT_NAME=TaskMarketBot
```

4. **Démarrer le serveur de développement**
```bash
npm start
# ou
yarn start
```

L'application sera disponible sur `http://localhost:3000`

## 📁 Structure du Projet

```
TaskMasterFrontend/
├── public/
│   ├── index.html          # Template HTML principal
│   └── test-*.html         # Fichiers de test
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── ui/            # Composants UI de base
│   │   ├── ErrorMessage.tsx
│   │   ├── Navbar.tsx
│   │   ├── PropertyCard.tsx
│   │   └── ...
│   ├── pages/             # Pages de l'application
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── PropertiesPage.tsx
│   │   └── ...
│   ├── hooks/             # Hooks personnalisés
│   │   └── useAuth.ts
│   ├── contexts/          # Contextes React
│   ├── utils/             # Utilitaires
│   │   ├── api.ts         # Configuration API
│   │   ├── validation.ts  # Validation des données
│   │   └── errorHandling.ts
│   ├── styles/            # Styles CSS personnalisés
│   ├── assets/            # Images et ressources
│   ├── App.tsx            # Composant principal
│   └── index.tsx          # Point d'entrée
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🎯 Pages Principales

### 🏡 **Pages Publiques**
- **HomePage** : Page d'accueil avec présentation
- **PropertiesPage** : Catalogue des propriétés disponibles
- **PropertyDetailPage** : Détails d'une propriété
- **LoginPage** : Connexion utilisateur
- **RegisterPage** : Inscription utilisateur

### 🔒 **Pages Privées**
- **MyPropertiesPage** : Mes propriétés (propriétaires)
- **AddPropertyPage** : Ajouter une propriété
- **EditPropertyPage** : Modifier une propriété
- **TransactionsPage** : Mes transactions
- **ProfilePage** : Profil utilisateur

### 👨‍💼 **Pages Admin**
- **AdminDashboardPage** : Tableau de bord administrateur
- **AdminUsersPage** : Gestion des utilisateurs
- **AdminPropertiesPage** : Gestion des propriétés
- **AdminTransactionsPage** : Gestion des transactions

## 🔧 Composants Principaux

### 🏠 **Propriétés**
- `PropertyCard` : Carte de propriété avec image et infos
- `PropertyForm` : Formulaire d'ajout/modification
- `PropertyImageGallery` : Galerie d'images interactive
- `ImageUpload` : Composant d'upload d'images
- `PropertyReportModal` : Modal de signalement

### 💼 **Transactions**
- `MakeOfferForm` : Formulaire d'offre
- `TransactionStatusUpdater` : Mise à jour statut
- `VisitRequestModal` : Modal de demande de visite

### 🤖 **Telegram**
- `TelegramIntegration` : Interface de liaison Telegram

### 🎨 **UI/UX**
- `BorderBeam` : Effet de bordure animée
- `MeteorEffect` : Effet de météores
- `ScrollProgress` : Barre de progression de scroll

## 🌐 API Integration

L'application communique avec le backend Django via une API REST :

- **Base URL** : Configurée via `REACT_APP_API_URL`
- **Authentification** : Tokens JWT
- **Endpoints** : Users, Properties, Transactions, Telegram

## 📱 Responsive Design

- Interface optimisée pour desktop, tablette et mobile
- Navigation adaptative
- Composants flexibles avec Tailwind CSS

## 🔐 Authentification & Autorisation

- Système de routes protégées
- Redirection automatique selon le rôle
- Gestion des tokens dans le localStorage
- Auto-logout en cas d'expiration

## 🎨 Personnalisation

### Couleurs et Thèmes
Modifiez `tailwind.config.js` pour personnaliser :
- Palette de couleurs
- Animations personnalisées  
- Breakpoints responsive

### Composants UI
Les composants UI sont dans `src/components/ui/` et peuvent être personnalisés facilement.

## 🚀 Build et Déploiement

### Build de Production
```bash
npm run build
# ou
yarn build
```

### Variables d'Environnement de Production
```bash
REACT_APP_API_URL=https://votre-api.com/api
REACT_APP_MEDIA_URL=https://votre-api.com/media
REACT_APP_TELEGRAM_BOT_NAME=TaskMarketBot
```

### Déploiement
L'application peut être déployée sur :
- Vercel
- Netlify  
- GitHub Pages
- Serveur web statique

## 🧪 Tests

```bash
npm test
# ou
yarn test
```

## 📝 Scripts Disponibles

- `npm start` : Démarre le serveur de développement
- `npm build` : Build de production
- `npm test` : Lance les tests
- `npm eject` : Éjecte la configuration CRA (irréversible)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

**Raoul Alobo** - [GitHub](https://github.com/raoulalobo)

## 🙏 Remerciements

- React Team pour l'excellent framework
- Tailwind CSS pour le système de design
- Framer Motion pour les animations
- Toute la communauté open source

---

🎯 *Généré avec Claude Code*