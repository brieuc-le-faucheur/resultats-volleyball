import { ref, onMounted } from 'vue'
import { fetchFFVBData } from '../services/ffvbApi.js'

export function useFFVBData() {
  const matches = ref([])
  const standings = ref([])
  const loading = ref(true)
  const error = ref(null)

  function parseFFVBDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return ''
    const [day, month, year] = dateStr.split('/')
    return `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  async function loadData() {
    loading.value = true
    error.value = null
    try {
      const data = await fetchFFVBData()
      standings.value = data.standings

      matches.value = data.matches.map(match => {
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
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(() => loadData())

  return {
    matches,
    standings,
    loading,
    error,
    reload: loadData
  }
}
