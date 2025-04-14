# Base de code du projet P6 - Parcours Front-end

## Démarrer le projet

Rien à installer ici, il suffit d'ouvrir le fichier `index.html` dans votre navigateur.

## Lien vers le site en ligne

Le projet est accessible en ligne à l'adresse suivante :  
[https://saidmohameddayas.github.io/oc-Front-End-Fisheye/](https://saidmohameddayas.github.io/oc-Front-End-Fisheye/)

## Fonctionnalités principales

- Affichage de tous les photographes sur la page d'accueil avec leurs informations (nom, slogan, lieu, prix, image miniature).
- Navigation vers une page spécifique pour chaque photographe.
- Affichage des galeries de médias (photos et vidéos) pour chaque photographe.
- Tri des médias par popularité, date ou titre.
- Gestion des likes pour chaque média, avec mise à jour du total des likes.
- Lightbox pour afficher les médias en grand format, avec navigation clavier et souris.
- Modale de contact pour envoyer un message au photographe.
- Accessibilité optimisée (navigation clavier, balises ARIA, texte alternatif pour les médias).

## Technologies utilisées

- **HTML5** : Structure des pages.
- **CSS3** : Mise en page et design conforme aux maquettes.
- **JavaScript (ES6+)** : Génération dynamique du DOM, gestion des événements, et interactions utilisateur.
- **JSON** : Source de données pour les photographes et leurs médias.
- **ESLint** : Linter pour garantir un code propre et maintenable.

## Installation et développement

### Prérequis

- Un navigateur moderne (Chrome, Firefox, Edge, etc.).
- [Node.js](https://nodejs.org/) (optionnel, pour utiliser les outils de développement comme ESLint).

### Lancer le projet en local

1. Clonez le dépôt GitHub :
   ```bash
   git clone https://github.com/saidmohameddayas/oc-Front-End-Fisheye.git
   ```
2. Accédez au dossier du projet :
   ```bash
   cd oc-Front-End-Fisheye
   ```
3. Ouvrez le fichier `index.html` dans votre navigateur.

### Lancer ESLint

Pour vérifier la qualité du code avec ESLint, exécutez la commande suivante :
```bash
npm run lint
```

## Accessibilité

Le site a été conçu pour être accessible à tous :
- Navigation au clavier entièrement fonctionnelle.
- Texte alternatif pour toutes les images et vidéos.
- Utilisation des balises ARIA pour les éléments interactifs.
- Validation avec l'outil [AChecker](https://websiteaccessibilitychecker.com/checker/index.php).

## Auteur

Ce projet a été réalisé par **Said Mohamed** dans le cadre du parcours Développeur d'application JavaScript React d'OpenClassrooms.
