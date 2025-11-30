import { ref, computed, watch, onMounted, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { config, type Competition, type Pool } from '../config'
import { loadPoolsForCompetition } from '../services/poolLoader'

export interface UseCompetitionSelectorReturn {
  competitions: Ref<Competition[]>
  selectedCompetitionId: Ref<string>
  selectedSaison: Ref<string>
  selectedPoolCode: Ref<string>
  selectedCompetition: Ref<Competition | undefined>
  selectedPool: Ref<Pool | undefined>
  availablePools: Ref<Pool[]>
  poolsLoading: Ref<boolean>
  selectCompetition: (competitionId: string, saison: string) => void
  selectPool: (poolCode: string) => void
  buildFFVBUrl: () => string
}

// Instance singleton partagée
let selectorInstance: UseCompetitionSelectorReturn | null = null

function createCompetitionSelector(): UseCompetitionSelectorReturn {
  const router = useRouter()
  const route = useRoute()

  // État réactif
  const competitions = ref<Competition[]>(config.competitions)
  const poolsLoading = ref<boolean>(false)

  // Initialize from URL query params, fallback to localStorage, then to defaults
  const initialCompetitionId =
    (route.query.competitionId as string) ||
    localStorage.getItem('selected-competition-id') ||
    config.defaultCompetitionId

  const initialSaison =
    (route.query.saison as string) ||
    localStorage.getItem('selected-saison') ||
    config.defaultSaison

  const initialPoolCode =
    (route.query.poule as string) ||
    localStorage.getItem('selected-pool') ||
    config.defaultPoolCode

  const selectedCompetitionId = ref<string>(initialCompetitionId)
  const selectedSaison = ref<string>(initialSaison)
  const selectedPoolCode = ref<string>(initialPoolCode)

  // Pools chargées dynamiquement
  const loadedPools = ref<Map<string, Pool[]>>(new Map())

  // Computed
  const selectedCompetition = computed(() => {
    return competitions.value.find(
      c => c.id === selectedCompetitionId.value && c.saison === selectedSaison.value
    )
  })

  const availablePools = computed(() => {
    const comp = selectedCompetition.value
    if (!comp) return []

    // Use loaded pools if available, otherwise use pools from config
    const cacheKey = `${comp.id}-${comp.saison}`
    return loadedPools.value.get(cacheKey) || comp.pools || []
  })

  const selectedPool = computed(() => {
    return availablePools.value.find(p => p.code === selectedPoolCode.value)
  })

  // Load pools for a competition
  async function loadPools(comp: Competition): Promise<void> {
    const cacheKey = `${comp.id}-${comp.saison}`
    if (loadedPools.value.has(cacheKey)) return // Already loaded

    poolsLoading.value = true
    try {
      // Use codent for FFVB API call (data layer)
      const pools = await loadPoolsForCompetition(comp.codent, comp.saison)
      loadedPools.value.set(cacheKey, pools)
    } catch (error) {
      console.error('Failed to load pools:', error)
    } finally {
      poolsLoading.value = false
    }
  }

  // Actions
  async function selectCompetition(competitionId: string, saison: string): Promise<void> {
    selectedCompetitionId.value = competitionId
    selectedSaison.value = saison
    const comp = competitions.value.find(c => c.id === competitionId && c.saison === saison)
    if (comp) {
      // Load pools if not already loaded
      await loadPools(comp)

      // Reset pool to first available
      const pools = availablePools.value
      if (pools.length > 0) {
        selectedPoolCode.value = pools[0]!.code
      }
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

  // Initialize - load pools for selected competition
  onMounted(async () => {
    const comp = selectedCompetition.value
    if (comp) {
      await loadPools(comp)
    }
  })

  // Persistence: sync to both localStorage and URL
  watch(selectedCompetitionId, (newValue) => {
    localStorage.setItem('selected-competition-id', newValue)
    updateURL()
  })

  watch(selectedSaison, (newValue) => {
    localStorage.setItem('selected-saison', newValue)
    updateURL()
  })

  watch(selectedPoolCode, (newValue) => {
    localStorage.setItem('selected-pool', newValue)
    updateURL()
  })

  // Update URL with current filters
  function updateURL(): void {
    router.push({
      query: {
        competitionId: selectedCompetitionId.value,
        saison: selectedSaison.value,
        poule: selectedPoolCode.value
      }
    })
  }

  return {
    competitions,
    selectedCompetitionId,
    selectedSaison,
    selectedPoolCode,
    selectedCompetition,
    selectedPool,
    availablePools,
    poolsLoading,
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
