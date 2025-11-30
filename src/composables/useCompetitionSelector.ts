import { ref, computed, watch, type Ref } from 'vue'
import { config, type Competition, type Pool } from '../config'

export interface UseCompetitionSelectorReturn {
  competitions: Ref<Competition[]>
  selectedCompetitionId: Ref<string>
  selectedPoolCode: Ref<string>
  selectedCompetition: Ref<Competition | undefined>
  selectedPool: Ref<Pool | undefined>
  availablePools: Ref<Pool[]>
  selectCompetition: (competitionId: string) => void
  selectPool: (poolCode: string) => void
  buildFFVBUrl: () => string
}

// Instance singleton partagée
let selectorInstance: UseCompetitionSelectorReturn | null = null

function createCompetitionSelector(): UseCompetitionSelectorReturn {
  // État réactif
  const competitions = ref<Competition[]>(config.competitions)
  const selectedCompetitionId = ref<string>(
    localStorage.getItem('selected-competition') || config.defaultCompetitionId
  )
  const selectedPoolCode = ref<string>(
    localStorage.getItem('selected-pool') || config.defaultPoolCode
  )

  // Computed
  const selectedCompetition = computed(() => {
    return competitions.value.find(c => c.id === selectedCompetitionId.value)
  })

  const availablePools = computed(() => {
    return selectedCompetition.value?.pools || []
  })

  const selectedPool = computed(() => {
    return availablePools.value.find(p => p.code === selectedPoolCode.value)
  })

  // Actions
  function selectCompetition(competitionId: string): void {
    selectedCompetitionId.value = competitionId
    // Reset pool to first available when changing competition
    const comp = competitions.value.find(c => c.id === competitionId)
    if (comp && comp.pools.length > 0) {
      selectedPoolCode.value = comp.pools[0]!.code
    }
  }

  function selectPool(poolCode: string): void {
    selectedPoolCode.value = poolCode
  }

  function buildFFVBUrl(): string {
    const comp = selectedCompetition.value
    const pool = selectedPool.value
    if (!comp || !pool) return ''

    return `https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php?saison=${encodeURIComponent(comp.saison)}&codent=${comp.codent}&poule=${pool.code}`
  }

  // Persistence
  watch(selectedCompetitionId, (newValue) => {
    localStorage.setItem('selected-competition', newValue)
  })

  watch(selectedPoolCode, (newValue) => {
    localStorage.setItem('selected-pool', newValue)
  })

  return {
    competitions,
    selectedCompetitionId,
    selectedPoolCode,
    selectedCompetition,
    selectedPool,
    availablePools,
    selectCompetition,
    selectPool,
    buildFFVBUrl
  }
}

export function useCompetitionSelector(): UseCompetitionSelectorReturn {
  if (!selectorInstance) {
    selectorInstance = createCompetitionSelector()
  }
  return selectorInstance
}
