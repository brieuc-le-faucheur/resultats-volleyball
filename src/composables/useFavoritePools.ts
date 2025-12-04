import { ref, computed, watch } from 'vue'

export interface FavoritePool {
  competitionId: string
  saison: string
  poolCode: string
  poolName: string
  competitionName: string
}

const STORAGE_KEY = 'volleyball-favorite-pools'

// Etat global partage (singleton)
const favorites = ref<FavoritePool[]>([])

// Initialisation depuis localStorage
function loadFromStorage(): void {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      favorites.value = JSON.parse(saved)
    } catch {
      favorites.value = []
    }
  }
}

// Charger au demarrage
loadFromStorage()

// Sauvegarder a chaque changement
watch(favorites, (newValue) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue))
}, { deep: true })

export function useFavoritePools() {
  const hasFavorites = computed(() => favorites.value.length > 0)

  function isFavorite(competitionId: string, saison: string, poolCode: string): boolean {
    return favorites.value.some(
      f => f.competitionId === competitionId && f.saison === saison && f.poolCode === poolCode
    )
  }

  function addFavorite(pool: FavoritePool): void {
    if (!isFavorite(pool.competitionId, pool.saison, pool.poolCode)) {
      favorites.value.push(pool)
    }
  }

  function removeFavorite(competitionId: string, saison: string, poolCode: string): void {
    const index = favorites.value.findIndex(
      f => f.competitionId === competitionId && f.saison === saison && f.poolCode === poolCode
    )
    if (index !== -1) {
      favorites.value.splice(index, 1)
    }
  }

  function toggleFavorite(pool: FavoritePool): void {
    if (isFavorite(pool.competitionId, pool.saison, pool.poolCode)) {
      removeFavorite(pool.competitionId, pool.saison, pool.poolCode)
    } else {
      addFavorite(pool)
    }
  }

  return {
    favorites,
    hasFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  }
}
