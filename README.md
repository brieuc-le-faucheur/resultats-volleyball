# Volleyball Dashboard

Dashboard moderne pour consulter les résultats et classements de volleyball de la FFVB.

## Fonctionnalités

- Affichage du classement DMA avec statistiques complètes
- Liste des matchs regroupés par date
- Séparation matchs joués / matchs à venir
- Filtrage par équipe (clic sur une ligne du classement)
- Statistiques détaillées de l'équipe sélectionnée
- Design moderne avec thème sombre
- Interface responsive

## Installation

```bash
# Installer les dépendances du frontend
npm install

# Installer les dépendances du backend mock
cd backend-mock
npm install
cd ..
```

## Développement

### Avec le serveur mock (recommandé)

1. Démarrer le serveur mock:
```bash
cd backend-mock
npm start
```

2. Dans un autre terminal, démarrer le frontend:
```bash
npm run dev
```

Le serveur mock sert les données FFVB depuis un fichier HTML local pour éviter les appels réseau répétés.

### Avec les données en direct

Modifier `src/config.js`:
```javascript
export const config = {
  dataMode: 'live', // au lieu de 'mock'
  // ...
}
```

Puis lancer uniquement:
```bash
npm run dev
```

## Build

```bash
npm run build
```

## Tech Stack

- Vue 3 (Composition API)
- Vite
- CSS Variables

## Source des données

Données extraites de la FFVB pour la saison 2025/2026 - DMA (Départementale Masculine A).
