<script setup lang="ts">
import { computed } from 'vue'
import { useFFVBData } from '../composables/useFFVBData'
import { useMatchFilters } from '../composables/useMatchFilters'
import { useCompetitionSelector } from '../composables/useCompetitionSelector'
import { useFavoritePools } from '../composables/useFavoritePools'
import StandingsTable from './StandingsTable.vue'
import MatchCard from './MatchCard.vue'
import FavoriteButton from './FavoriteButton.vue'

const { matches, standings, loading } = useFFVBData()
const { upcomingMatches } = useMatchFilters(matches)
const {
  selectedCompetitionId,
  selectedSaison,
  selectedPoolCode,
  selectedCompetition,
  selectedPool
} = useCompetitionSelector()

const { isFavorite, toggleFavorite } = useFavoritePools()

const isCurrentPoolFavorite = computed(() => {
  if (!selectedPool.value || !selectedCompetition.value) return false
  return isFavorite(
    selectedCompetitionId.value,
    selectedSaison.value,
    selectedPoolCode.value
  )
})

function toggleCurrentPoolFavorite() {
  if (!selectedPool.value || !selectedCompetition.value) return
  toggleFavorite({
    competitionId: selectedCompetitionId.value,
    saison: selectedSaison.value,
    poolCode: selectedPoolCode.value,
    poolName: selectedPool.value.name,
    competitionName: selectedCompetition.value.name
  })
}

// Limiter aux 8 prochains matchs pour vue compacte
const limitedUpcomingMatches = computed(() => {
  return upcomingMatches.value.slice(0, 8)
})
</script>

<template>
  <div class="compact-view">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <div v-else class="compact-grid">
      <!-- Classement -->
      <section class="standings-panel">
        <h2 class="panel-title">
          Classement
          <span v-if="selectedPool" class="pool-name">- {{ selectedPool.name }}</span>
          <FavoriteButton
            v-if="selectedPool"
            :is-active="isCurrentPoolFavorite"
            size="sm"
            @toggle="toggleCurrentPoolFavorite"
          />
        </h2>
        <div class="standings-compact">
          <StandingsTable
            :standings="standings"
            variant="compact"
            :selectable="false"
            :use-short-names="true"
          />
        </div>
      </section>

      <!-- Prochains matchs -->
      <section class="matches-panel">
        <h2 class="panel-title">Prochains matchs</h2>
        <div class="matches-compact">
          <MatchCard
            v-for="match in limitedUpcomingMatches"
            :key="match.id"
            :match="match"
            variant="compact"
            :use-short-names="true"
          />

          <div v-if="limitedUpcomingMatches.length === 0" class="empty-state">
            Aucun match à venir
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Mobile-first base styles */
.compact-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: var(--space-md);
  background: var(--color-background);
  display: flex;
  flex-direction: column;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: var(--space-md);
}

.compact-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  gap: var(--space-md);
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.standings-panel,
.matches-panel {
  background: var(--color-surface);
  border-radius: 0.75rem;
  padding: var(--space-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.standings-panel {
  max-height: 40vh;
}

.panel-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.pool-name {
  font-weight: 500;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.standings-compact {
  flex: 1;
  overflow-y: auto;
  margin: -0.5rem;
  padding: 0.5rem;
}

/* Matches */
.matches-compact {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin: -0.5rem;
  padding: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: var(--space-lg);
  color: var(--color-text-muted);
}

/* sm: 480px+ */
@media (min-width: 480px) {
  .compact-view {
    padding: var(--space-lg);
  }

  .compact-grid {
    gap: var(--space-lg);
  }

  .standings-panel {
    max-height: 45vh;
  }

  .matches-compact {
    gap: var(--space-md);
  }
}

/* lg: 1024px+ - Two column layout */
@media (min-width: 1024px) {
  .compact-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1.5rem;
  }

  .standings-panel,
  .matches-panel {
    padding: 1.5rem;
    border-radius: 1rem;
  }

  .standings-panel {
    max-height: none;
  }

  .panel-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .matches-compact {
    gap: 1rem;
  }
}
</style>