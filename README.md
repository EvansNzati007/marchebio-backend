# 🌱 MarchéBio — Backend

Place de marché numérique reliant producteurs locaux et acheteurs urbains, en réduisant les intermédiaires.

Projet réalisé dans le cadre d'un projet tutoré (module de 30h) — Master 2 Génie Logiciel, ESGIS Gabon.

---

## 🎯 Le projet

Les producteurs de la périphérie peinent souvent à écouler leur production faute de canaux de distribution directs, tandis que les citadins cherchent des produits frais et locaux. **MarchéBio** connecte les deux directement : le producteur publie ses produits, l'acheteur parcourt, commande, et suit sa livraison.

Ce dépôt contient le **backend** de l'application, dont je suis responsable au sein de l'équipe projet.

---

## ✨ Fonctionnalités (MVP)

- 🔐 **Authentification** — inscription/connexion pour 3 profils : Producteur, Acheteur, Administrateur (JWT)
- 📦 **Gestion des produits** — CRUD complet côté producteur (nom, prix, quantité, photo)
- 🔍 **Catalogue & recherche** — parcours et recherche des produits côté acheteur
- 🛒 **Panier & commande** — panier côté client, validation en commande avec lignes de commande
- 📋 **Suivi des commandes** — statuts NOUVELLE → PRÉPARÉE → LIVRÉE
- 🛠️ **Back-office administrateur** — supervision des utilisateurs, produits et commandes

### Bonus (si le temps le permet)
- 💳 Paiement mobile simulé (Airtel Money / Moov Money)
- ⭐ Notation des producteurs par les acheteurs
- 📍 Géolocalisation des producteurs

---

## 🛠️ Stack technique

- **NestJS** — framework backend (TypeScript)
- **Prisma** — ORM
- **MySQL** — base de données
- **JWT** — authentification par tokens
- **class-validator** — validation des données
- **Swagger** — documentation de l'API

---

## 🏗️ Modélisation des données

Le modèle s'articule autour de 5 entités : `User`, `Produit`, `Commande`, `LigneCommande`, `Evaluation`.

Point clé : une commande peut contenir **plusieurs produits** grâce à l'entité `LigneCommande`, qui fige aussi le prix unitaire au moment de l'achat.

```
User (1) ----< (N) Produit           : un producteur publie plusieurs produits
User (1) ----< (N) Commande          : un acheteur passe plusieurs commandes
Commande (1) ----< (N) LigneCommande : une commande contient plusieurs lignes
Produit (1) ----< (N) LigneCommande  : un produit apparaît dans plusieurs lignes
User (1) ----< (N) Evaluation        : en tant qu'acheteur ou producteur
```

*Le détail complet (champs, contraintes, règles de gestion) est disponible dans le [Cahier des Charges](./docs/CahierDesCharges_MarcheBio.docx).*

---

## 🏛️ Architecture du backend

```
src/
├── auth/            # Authentification (JWT, guards, stratégies)
├── users/            # Gestion des utilisateurs et des rôles
├── produits/         # CRUD produits (producteur)
├── commandes/        # Commandes, lignes de commande, statuts
├── evaluations/       # Notation des producteurs
├── prisma/           # Service Prisma partagé
└── common/            # Guards de rôles, décorateurs, filtres partagés
```

---

## 🚀 Installation & lancement

### Prérequis
- Node.js (v18+)
- MySQL

### Étapes

```bash
# Cloner le dépôt
git clone https://github.com/EvansNzati007/marchebio-backend.git
cd marchebio-backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# (renseigner DATABASE_URL et JWT_SECRET dans .env)

# Appliquer les migrations Prisma
npx prisma migrate dev

# Démarrer le serveur en mode développement
npm run start:dev
```

L'API sera disponible sur `http://localhost:3000`

---

## 📡 Aperçu des endpoints

| Méthode | Endpoint | Description | Rôle requis |
|---------|----------|--------------|-------------|
| POST | `/auth/register` | Créer un compte | Public |
| POST | `/auth/login` | Se connecter | Public |
| GET | `/produits` | Lister les produits disponibles | Public |
| POST | `/produits` | Publier un produit | Producteur |
| POST | `/commandes` | Passer une commande | Acheteur |
| GET | `/commandes/mes-commandes` | Suivre ses commandes | Acheteur |
| PATCH | `/commandes/:id/statut` | Changer le statut d'une commande | Producteur / Admin |

---

## 📐 Règles de gestion clés

- Un producteur ne peut pas commander ses propres produits
- Une commande ne peut plus être modifiée une fois au statut `PRÉPARÉE`
- Le stock diminue automatiquement à la validation d'une commande
- Une commande ne peut être validée si le stock est insuffisant

---

## 👤 Équipe

**Evans NZATI** — Responsable Backend
[GitHub](https://github.com/EvansNzati007) · [LinkedIn](https://linkedin.com/in/evansnzati)

**NDONG NGOUA Andrew** - Responsable Frontend

---

*Projet tutoré — Master 2 Génie Logiciel, ESGIS Gabon.*
