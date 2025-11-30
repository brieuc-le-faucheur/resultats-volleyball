import { ref, onMounted, watch, type Ref } from 'vue'
import { fetchFFVBData, type FFVBMatch } from '../services/ffvbApi.js'
import { useCompetitionSelector } from './useCompetitionSelector'

export interface Match {
  id: string
  journee: number
  date: string
  time: string
  teamA: string
  teamB: string
  scoreA: number | null
  scoreB: number | null
  sets: string
  played: boolean
}

export interface Standing {
  position: number
  team: string
  played: number
  won: number
  lost: number
  points: number
  setsFor: number
  setsAgainst: number
}

export interface UseFFVBDataReturn {
  matches: Ref<Match[]>
  standings: Ref<Standing[]>
  loading: Ref<boolean>
  error: Ref<Error | null>
  reload: () => Promise<void>
}

interface CachedData {
  matches: Match[]
  standings: Standing[]
  timestamp: number
}

// Cache durations in milliseconds
const RESULTS_CACHE_DURATION = 24 * 60 * 60 * 1000 // 1 day - for match results and standings (change frequently)
const CONFIG_CACHE_DURATION = 2 * 30 * 24 * 60 * 60 * 1000 // 2 months - for competition/pool configs (rarely change)

export function useFFVBData(): UseFFVBDataReturn {
  const matches = ref<Match[]>([])
  const standings = ref<Standing[]>([])
  const loading = ref(true)
  const error = ref<Error | null>(null)

  // Récupérer l'URL dynamique depuis le sélecteur de compétition
  const { buildFFVBUrl, selectedCompetitionId, selectedPoolCode } = useCompetitionSelector()

  function parseFFVBDate(dateStr: string): string {
    if (!dateStr || dateStr.trim() === '') return ''
    const parts = dateStr.split('/')
    const day = parts[0]
    const month = parts[1]
    const year = parts[2]

    if (!day || !month || !year) return ''
    return `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  function getCacheKey(): string {
    return `ffvb-data-${selectedCompetitionId.value}-${selectedPoolCode.value}`
  }

  function loadFromCache(): CachedData | null {
    try {
      const cacheKey = getCacheKey()
      const cached = localStorage.getItem(cacheKey)
      if (!cached) return null

      const data: CachedData = JSON.parse(cached)
      const now = Date.now()

      // Vérifier si le cache est encore valide (1 jour pour les résultats)
      if (now - data.timestamp > RESULTS_CACHE_DURATION) {
        localStorage.removeItem(cacheKey)
        return null
      }

      return data
    } catch (err) {
      console.error('Erreur lors de la lecture du cache:', err)
      return null
    }
  }

  function saveToCache(matchesData: Match[], standingsData: Standing[]): void {
    try {
      const cacheKey = getCacheKey()
      const data: CachedData = {
        matches: matchesData,
        standings: standingsData,
        timestamp: Date.now()
      }
      localStorage.setItem(cacheKey, JSON.stringify(data))
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du cache:', err)
    }
  }

  async function loadData(): Promise<void> {
    loading.value = true
    error.value = null

    // Essayer de charger depuis le cache d'abord
    const cached = loadFromCache()
    if (cached) {
      console.log('Données chargées depuis le cache')
      matches.value = cached.matches
      standings.value = cached.standings
      loading.value = false
      return
    }

    try {
      // Utiliser l'URL dynamique au lieu de l'URL hardcodée
      const url = buildFFVBUrl()
      const data = await fetchFFVBData(url)
      standings.value = data.standings

      matches.value = data.matches.map((match: FFVBMatch) => {
        const journeeMatch = match.journee.match(/\d+/)
        return {
          id: match.code,
          journee: journeeMatch ? parseInt(journeeMatch[0]) : 0,
          date: parseFFVBDate(match.date),
          time: match.time || '-',
          teamA: match.homeTeam,
          teamB: match.awayTeam,
          scoreA: match.homeScore,
          scoreB: match.awayScore,
          sets: match.setScores,
          played: match.played
        }
      })

      // Sauvegarder dans le cache
      saveToCache(matches.value, standings.value)
      console.log('Données sauvegardées dans le cache')
    } catch (err) {
      console.error('Erreur lors du chargement des données FFVB:', err)
      error.value = err instanceof Error ? err : new Error('Unknown error')
    } finally {
      loading.value = false
    }
  }

  // Recharger les données quand la sélection de compétition ou de poule change
  watch([selectedCompetitionId, selectedPoolCode], () => {
    loadData()
  })

  onMounted(() => loadData())

  return {
    matches,
    standings,
    loading,
    error,
    reload: loadData
  }
}
