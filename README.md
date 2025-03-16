# My 80's Store - Frontend

Bienvenue dans le repository frontend de **My 80's Store**, une boutique en ligne proposant des objets vintage emblématiques des années 80-90 : jeux vidéo, consoles, vêtements, VHS, etc.

## Aperçu des pages

Voici un aperçu de la page Home :
![Home](/public/Home.png)

## Prérequis

Avant de lancer le projet, assurez-vous d'avoir les outils suivants installés :

- [Node.js](https://nodejs.org/) (version recommandée : 18.x)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Installation

1. Clonez ce repository :
   ```bash
   git clone https://github.com/votre-utilisateur/my-80s-store-frontend.git
   ```
2. Accédez au dossier du projet :
   ```bash
   cd my-80s-store-frontend
   ```
3. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

## Configuration

Créez un fichier `.env` à la racine du projet et ajoutez-y les variables d'environnement nécessaires :

```
VITE_STRIPE_PUBLIC_KEY=pk_test_yourStripePublicKey
```

## Scripts disponibles

- **Démarrage du serveur de développement** :
  ```bash
  npm run dev
  # ou
  yarn dev
  ```
- **Build de l'application pour la production** :
  ```bash
  npm run build
  # ou
  yarn build
  ```
- **Prévisualisation du build** :
  ```bash
  npm run preview
  # ou
  yarn preview
  ```
- **Linter** :
  ```bash
  npm run lint
  # ou
  yarn lint
  ```

## Structure du projet

La structure du projet est la suivante :

```
/src
  /pages
  /components
  /styles
  /assets
  /store
```

## Fonctionnalités principales

- Catalogue de produits des années 80-90
- Pages produits avec détails complets
- Système de panier avec gestion des quantités
- Gestion des commandes avec historique
- Gestion des adresses personnelles pour les utilisateurs
- Paiement en ligne via Stripe
- Expérience utilisateur moderne et fluide
- **Back-office** : Les utilisateurs avec le rôle "admin" peuvent ajouter des articles, gérer les stocks et modifier les informations des produits.

## Améliorations futures

- Mise en place de tests unitaires et d'intégration
- Rendre le site entièrement responsive

## Lien vers le site

[My 80's Store](https://my-80store-frontend.vercel.app/)

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez votre branche de fonctionnalité : `git checkout -b ma-fonctionnalite`
3. Commitez vos changements : `git commit -m "Ajout de ma fonctionnalité"`
4. Poussez votre branche : `git push origin ma-fonctionnalite`
5. Créez une Pull Request
