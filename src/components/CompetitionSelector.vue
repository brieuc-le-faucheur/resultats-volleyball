<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCompetitionSelector } from '../composables/useCompetitionSelector'
import type { Pool } from '../config'

const {
  competitions,
  selectedCompetitionId,
  selectedSaison,
  selectedPoolCode,
  availablePools,
  poolsLoading,
  selectCompetition,
  selectPool
} = useCompetitionSelector()

// Recherche textuelle
const searchQuery = ref('')

// Grouper les poules par catégorie
const poolsByCategory = computed(() => {
  const groups = new Map<string, Pool[]>()

  availablePools.value.forEach(pool => {
    const category = pool.category || 'Autres'
    if (!groups.has(category)) {
      groups.set(category, [])
    }
    groups.get(category)!.push(pool)
  })

  // Trier les catégories
  return new Map(Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0])))
})

// Poules filtrées par recherche
computed(() => {
  if (!searchQuery.value.trim()) {
    return poolsByCategory.value
  }

  const query = searchQuery.value.toLowerCase()
  const filtered = new Map<string, Pool[]>()

  poolsByCategory.value.forEach((pools, category) => {
    const matchingPools = pools.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query)
    )
    if (matchingPools.length > 0) {
      filtered.set(category, matchingPools)
    }
  })

  return filtered
});
// Computed pour l'ID de compétition combiné (pour le select)
const selectedCompetitionKey = computed(() => `${selectedCompetitionId.value}|${selectedSaison.value}`)

function handleCompetitionChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  const [competitionId, saison] = target.value.split('|')
  selectCompetition(competitionId, saison)
  searchQuery.value = ''
}

function handlePoolChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  selectPool(target.value)
}
</script>

<template>
  <div class="competition-selector">
    <!-- Masquer le dropdown de compétition si une seule option -->
    <div v-if="competitions.length > 1" class="selector-group">
      <label for="competition-select">Compétition</label>
      <select
        id="competition-select"
        :value="selectedCompetitionKey"
        @change="handleCompetitionChange"
        class="selector"
      >
        <option
          v-for="comp in competitions"
          :key="`${comp.id}|${comp.saison}`"
          :value="`${comp.id}|${comp.saison}`"
        >
          {{ comp.name }} {{ comp.saison }}
        </option>
      </select>
    </div>

    <!-- Sélecteur de poule -->
    <div class="selector-group">
      <label for="pool-select">Poule</label>
      <select
        id="pool-select"
        :value="selectedPoolCode"
        @change="handlePoolChange"
        class="selector"
        :disabled="poolsLoading"
      >
        <option v-if="poolsLoading" value="">Chargement...</option>
        <template v-else-if="availablePools.length === 0">
          <option value="">Aucune poule disponible</option>
        </template>
        <template v-else>
          <optgroup
            v-for="[category, pools] in poolsByCategory"
            :key="category"
            :label="category"
          >
            <option
              v-for="pool in pools"
              :key="pool.code"
              :value="pool.code"
            >
              {{ pool.name }}
            </option>
          </optgroup>
        </template>
      </select>
    </div>
  </div>
</template>

<style scoped>
.competition-selector {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.selector {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.selector:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.selector:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.selector:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .competition-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .selector-group {
    min-width: 100%;
  }
}
</style>