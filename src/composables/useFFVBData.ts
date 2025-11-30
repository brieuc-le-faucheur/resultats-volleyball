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

  async function loadData(): Promise<void> {
    loading.value = true
    error.value = null
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
