<script setup lang="ts">
import { computed } from 'vue'
import { useFFVBData } from '../composables/useFFVBData'
import { useMatchFilters } from '../composables/useMatchFilters'
import StandingsTable from './StandingsTable.vue'
import MatchCard from './MatchCard.vue'

const { matches, standings, loading } = useFFVBData()
const { upcomingMatches } = useMatchFilters(matches)

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
        <h2 class="panel-title">Classement DMA</h2>
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
.compact-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1.5rem;
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
  gap: 1rem;
}

.compact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.standings-panel,
.matches-panel {
  background: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text);
  flex-shrink: 0;
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
  gap: 1rem;
  margin: -0.5rem;
  padding: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .compact-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .standings-panel {
    max-height: 40vh;
  }
}
</style>