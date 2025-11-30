export interface Pool {
  code: string           // Ex: "DMA", "DMB", "DMC"
  name: string           // Ex: "DEPARTEMENTALE MASCULINE A"
  category?: string      // Ex: "DEPARTEMENTALE MASCULINE", "M18 HONNEURS"
  url?: string           // URL spécifique si besoin (optionnel)
}

export interface Competition {
  name: string           // Ex: "Comité d'Ille-et-Vilaine"
  id: string             // Ex: "PTBR35" - Identifiant unique de la compétition
  saison: string         // Ex: "2025/2026"
  codent: string         // Ex: "PTBR35" - Code entité FFVB (couche données uniquement)
  pools?: Pool[]         // Liste des poules (chargée dynamiquement si non fournie)
}

export interface AppConfig {
  dataMode: 'mock' | 'live'
  mockServerUrl: string
  corsProxy: string
  competitions: Competition[]
  defaultCompetitionId: string
  defaultSaison: string
  defaultPoolCode: string
  lastUpdated: string // Date de dernière extraction des codes de poules
}

export const config: AppConfig = {
  dataMode: 'live',
  mockServerUrl: 'http://localhost:3001/ffvb-data',
  corsProxy: 'https://cors-anywhere.com/',

  // Configuration par défaut
  defaultCompetitionId: 'PTBR35',
  defaultSaison: '2025/2026',
  defaultPoolCode: 'DMA',

  // Date de dernière extraction des codes de poules depuis le HTML FFVB
  lastUpdated: '2025-11-30',

  // Liste des compétitions disponibles
  // NOTE: Les poules sont chargées dynamiquement depuis la FFVB
  competitions: [
    {
      name: 'Comité d\'Ille-et-Vilaine',
      id: 'PTBR35',
      codent: 'PTBR35', // Code entité FFVB
      saison: '2025/2026'
    }
  ]
}