import competitionsData from './data/competitions.json'

export interface Pool {
  code: string           // Ex: "DMA", "DMB", "DMC"
  name: string           // Ex: "DEPARTEMENTALE MASCULINE A"
  category?: string      // Ex: "DEPARTEMENTALE MASCULINE", "M18 HONNEURS"
  url?: string           // URL spécifique si besoin (optionnel)
}

export interface CompetitionData {
  codent: string         // Ex: "PTBR35" - Code entité FFVB
  name: string           // Ex: "35 Ille-et-Vilaine"
  category: string       // Ex: "Départemental", "Régional"
}

export interface Competition extends CompetitionData {
  id: string             // Ex: "PTBR35" - Identifiant unique (= codent)
  saison: string         // Ex: "2025/2026"
  pools?: Pool[]         // Liste des poules (chargée dynamiquement)
}

export interface AppConfig {
  dataMode: 'mock' | 'live'
  mockServerUrl: string
  corsProxy: string
  competitions: Competition[]
  defaultCompetitionId: string
  defaultSaison: string
  defaultPoolCode: string
  lastUpdated: string
}

// Calcule la saison courante (ex: "2025/2026")
function getCurrentSaison(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed
  // La saison commence en septembre (mois 8)
  if (month >= 8) {
    return `${year}/${year + 1}`
  }
  return `${year - 1}/${year}`
}

// Transforme les données JSON en Competition[]
function loadCompetitions(): Competition[] {
  const saison = getCurrentSaison()
  return (competitionsData.competitions as CompetitionData[]).map(comp => ({
    ...comp,
    id: comp.codent,
    saison
  }))
}

const currentSaison = getCurrentSaison()

export const config: AppConfig = {
  dataMode: 'live',
  mockServerUrl: 'http://localhost:3001/ffvb-data',
  corsProxy: 'https://corsproxy.io/?',

  // Configuration par défaut
  defaultCompetitionId: 'PTBR35',
  defaultSaison: currentSaison,
  defaultPoolCode: 'DMA',

  // Date de dernière extraction des compétitions
  lastUpdated: competitionsData.lastUpdated,

  // Liste des compétitions chargées depuis le JSON
  competitions: loadCompetitions()
}