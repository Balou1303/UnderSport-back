# UnderSport — API back-end

API REST pour UnderSport, une plateforme d'actualités et d'encyclopédie sportive (football, basket) avec back-office d'administration. Elle centralise la gestion des contenus (articles, règles de sports, lexique, palmarès), l'authentification des utilisateurs et l'agrégation de données sportives en direct via des API externes.

Le front associé se trouve dans le repo [UnderSport-front](https://github.com/Balou1303/UnderSport-front).

## Contexte

Projet réalisé dans le cadre de la préparation du titre professionnel **DWWM (Développeur Web et Web Mobile)**, en tant que projet de certification.

## Stack technique

- **Runtime / Framework** : Node.js, Express 5
- **Base de données** : MySQL (driver `mysql2/promise`, requêtes SQL manuscrites, sans ORM)
- **Authentification** : JSON Web Token (`jsonwebtoken`) + hachage des mots de passe (`bcryptjs`)
- **Upload de fichiers** : Multer (images stockées sur disque, servies en statique)
- **Appels API externes** : Axios (football-data.org, balldontlie.io pour la NBA)
- **Tests** : Vitest + Supertest
- **Autres** : CORS, dotenv, nodemon (dev)

## Fonctionnalités principales

- **Authentification & rôles** : inscription, connexion (JWT), 3 niveaux de droits (admin / rédacteur / utilisateur) contrôlés par middleware
- **Articles** : CRUD, association à des sports, mise en avant ("featured"), statistiques et popularité, upload d'image
- **Encyclopédie sportive** : sports, règles, lexique
- **Compétitions & équipes** : championnats, équipes, matchs
- **Légendes du sport** : fiches joueurs avec palmarès (achievements)
- **Diffuseurs TV** associés aux matchs
- **Commentaires** sur les articles
- **Données sportives en direct** : classements et matchs de Ligue 1 (football-data.org) et de NBA (balldontlie.io), avec cache mémoire et repli sur cache expiré en cas d'erreur/rate-limit

## Architecture / choix techniques notables

- **Architecture MVC** : `routes/` (déclaration des endpoints) → `controllers/` (logique métier, formatage des réponses) → `models/` (accès aux données, requêtes SQL brutes via `mysql2`)
- **Sécurité par middleware composables** : `checkToken` (validité du JWT) puis `checkAdmin` / `checkEditor` (contrôle du rôle `idRole` contenu dans le token), chaînés directement dans les routes Express
- **Intégration d'API tierces résiliente** : couche `externalApiController` / `nbaController` avec cache en mémoire à TTL (30s) pour limiter les appels (quota API restreint) et mécanisme de "score shielding" qui empêche un score en direct de revenir en arrière si l'API renvoie temporairement une donnée moins à jour
- **Upload d'images** géré par Multer avec nommage unique (timestamp) et exposition du dossier `public/picture` en statique
- **Configuration par variables d'environnement** (`dotenv`) : aucun secret en dur dans le code

## Installation et lancement en local

### Prérequis
- Node.js 18+
- Une instance MySQL accessible

### Étapes

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Créer un fichier `.env` à la racine avec les variables suivantes :
   ```
   SERVER_PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=sport
   DB_PORT=3306
   JWT_SECRET=une_chaine_secrete_longue_et_aleatoire
   FOOTBALL_DATA_API_KEY=votre_cle_football-data.org
   BALL_DONT_LIE_API=votre_cle_balldontlie.io
   ```
   Les clés API externes s'obtiennent gratuitement sur [football-data.org](https://www.football-data.org/) et [balldontlie.io](https://www.balldontlie.io/).

3. Créer une base MySQL correspondant au nom défini dans `DB_NAME`, avec les tables attendues par les modèles du dossier `models/` (utilisateurs, articles, sports, championnats, équipes, matchs, légendes, achievements, diffuseurs, commentaires, règles, lexique).

4. Lancer le serveur en développement :
   ```bash
   npm start
   ```
   L'API est alors disponible sur `http://localhost:3000`.

5. (Optionnel) Lancer les tests :
   ```bash
   npm test
   ```
   Ces tests s'exécutent contre la base de données configurée dans `.env`.

## Ce que ce projet démontre

- Conception et mise en œuvre d'une API REST selon une architecture MVC
- Authentification stateless par JWT et gestion des autorisations (RBAC) via middleware Express
- Écriture et organisation de requêtes SQL manuscrites (sans ORM)
- Intégration d'API tierces avec gestion des contraintes réelles (rate-limiting, cache, dégradation gracieuse)
- Gestion d'upload de fichiers côté serveur
- Mise en place de tests automatisés (Vitest/Supertest) sur la couche d'accès aux données
